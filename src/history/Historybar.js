import React, { Component } from 'react';
import { connect } from 'react-redux';

class Historybar extends Component {
  state = {
      numOfEls: 10,
      pentrace: [],
      pendown : false,
      selected: [],
      temptrace : false,
      selectedtraces: [],
  }

  constructor(props){
      super(props);
      this.canvRef = React.createRef();
  }

  getSize(){
    return {x: this.state.width, y: this.state.height}
  }

  getUItraceList(){
    return this.props.traces.filter(el => el.type === 'ui' || (el.type === 'imgtrace' && el.transform.type !== 'place')).slice(-this.state.numOfEls)
  }

  componentDidMount(){
    var height = document.getElementById('historybar-canvas').clientHeight;
    var width = document.getElementById('historybar-canvas').clientWidth;
    this.setState({
      height: height,
      width: width,
      numOfEls: (Math.floor((width - 20) / 120))
    })
  }

  drawHistory(){
    var uitracelist = this.getUItraceList();
    const ctx = this.canvRef.current.getContext('2d');
    ctx.canvas.width  = this.getSize().x;
    ctx.canvas.height = this.getSize().y;
    ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);

    ctx.strokeStyle = this.props.uicolor;

    var offsetX = 120;
    var i,j;

    for(i = 0; i < uitracelist.length; i++){

      ctx.fillStyle = this.props.uicolor;
      ctx.textAlign = "center"; 
      ctx.font = "15px Tahoma"
      ctx.textAlign = "center";

      if(i+1 == uitracelist.length){
        ctx.fillText("t", 10 + 60 + 120*i, 20); 
      }
      else{
        ctx.fillText("t - " + (uitracelist.length - i - 1), 10 + 60 + 120*i, 20); 
      }
      
      if(uitracelist[i].type === "ui"){
        ctx.font = "10px Tahoma"
        ctx.textAlign = "end"; 

        const text = Array.from(Object.keys(uitracelist[i].changes));
        for(var k = 0; k < text.length; k++){
           ctx.fillText(text[k], 10 + 100 + 120*i, 180 - 12*k);
        }
        ctx.beginPath();
        ctx.moveTo(uitracelist[i].trace[0].x / 4 + 25 + offsetX * i, uitracelist[i].trace[0].y / 4 + 22);

        for(j = 0; j < uitracelist[i].trace.length; j++){
            ctx.lineTo(uitracelist[i].trace[j].x / 4 + 25 + offsetX * i, uitracelist[i].trace[j].y / 4 + 22);
        }
        ctx.stroke();
      }
      else if(uitracelist[i].type === "imgtrace"){
        ctx.font = "10px Tahoma";
        ctx.textAlign = "end";
        const text = uitracelist[i].transform.type
        var printtext
        switch(text){
          case("tl"):
            printtext = "resize: top left";
            break;
          case("tr"):
            printtext = "resize: top right";
            break;
          case("bl"):
            printtext = "resize: bottom left";
            break;
          case("br"):
            printtext = "resize: bottom right";
            break;
          case("mid"):
            printtext = "move:middle";
            break;
        }
        ctx.fillText(printtext, 10 + 100 + 120*i, 180);


        ctx.beginPath();
        ctx.moveTo(uitracelist[i].trace[0].x / 6 + 25 + offsetX * i, 30 + uitracelist[i].trace[0].y / 6 + 22);

        for(j = 0; j < uitracelist[i].trace.length; j++){
            ctx.lineTo(uitracelist[i].trace[j].x / 6 + 25 + offsetX * i, 30 + uitracelist[i].trace[j].y / 6 + 22);
        }
        ctx.stroke();
      }
    }

    //drawselection
    ctx.fillStyle = "#3297FD22"
    for(i = 0; i < uitracelist.length; i++){
      //var insert = false
      for(j = 0; j < this.state.selectedtraces.length; j++){
        if(uitracelist[i].t === this.state.selectedtraces[j].t){
          ctx.fillRect(20 + 120 * i, 30, 100, 160)
        }
      }
    }

    ctx.moveTo(10,30);
    ctx.lineTo(10, this.getSize().y - 10);
    ctx.lineTo(10 + uitracelist.length * 120, this.getSize().y - 10);
    ctx.lineTo(10 + uitracelist.length * 120, 30);
    ctx.lineTo(10,30);
    ctx.stroke();

  }

  componentDidUpdate(){
    var penstate = this.props.initpenstate;

    // for(var i = 0; i < this.props.traces.length; i++){
    //   if(this.props.traces[i].type === 'ui'){
    //     penstate = {...penstate, ...this.props.traces[i].changes}
    //   }
    // }
    // if(penstate){
    //   this.props.setPenstate(penstate)
    // }
    // else{
    //   this.props.setInit()
    // }

    //drawing the pentrace
    const ctx = this.canvRef.current.getContext('2d');
    if(this.state.pentrace.length > 0){
      ctx.beginPath();
      ctx.moveTo(this.state.pentrace[0].x, this.state.pentrace[0].y)
      for(var i = 1; i < this.state.pentrace.length; i++){
        ctx.lineTo(this.state.pentrace[i].x, this.state.pentrace[i].y)
      }
      ctx.stroke()
    }

    if(!this.state.pendown){
      this.drawHistory()
    }
  }

  pointerDownHandler(event){
    //console.log(event.button)
    if(event.button === 5 || event.button===2){
    }
    else{

      var offsetX = this.canvRef.current.getBoundingClientRect().x;
      var offsetY = this.canvRef.current.getBoundingClientRect().y;

      this.setState({
        pentrace: [{x: event.clientX - offsetX,y: event.clientY - offsetY}],
        pendown: true
      })
    }
  }

  pointerUpHandler(event){
    var uitracelist = this.getUItraceList()
    if((event.button === 5 || event.button===2) && event.clientX % 120 > 20 && event.clientX / 120 <= this.getUItraceList().length){
        //this.props.clrDisplaytrace()
        this.props.delTrace(uitracelist[Math.floor(event.clientX / 120)].t)
    }
    else{
      if(this.state.pentrace.length > 1){
        //for selection by circle
        //if(this.dist(this.state.pentrace[0], this.state.pentrace[this.state.pentrace.length-1]) < 40){
          var selectedtraces = this.interpretTrace(this.state.pentrace).map(x => ({t: x, alpha: 1}));

          this.setState({
            selectedtraces,
            pentrace: [],
            pendown: false
          })
        //}
        // else{
        //   this.setState({
        //     pentrace: [],
        //     pendown: false
        //   })
        //}
      }
    }
  }

  pointerMoveHandler(event){
    //error on my surface i don't know why this happens
    if(170 < event.clientX && event.clientX < 171 && 702 < event.clientY && event.clientY < 703){
      return
    }

    var rect = this.canvRef.current.getBoundingClientRect()
    if(!this.state.pendown){
      if(event.clientY > rect.top && event.clientX % 120 > 20 && event.clientX / 120 <= this.getUItraceList().length){             

        var uitracelist = this.getUItraceList();
        var temptrace = uitracelist[Math.floor(event.clientX / 120)].t
        this.setState({
          temptrace
        })
        this.props.setDisplaytraces([...this.state.selectedtraces, {t: temptrace, alpha:1}])
      }
    }

    if(event.button === 5 || event.button===2){
    }
    else{
      if(this.state.pendown){
        var offsetX = this.canvRef.current.getBoundingClientRect().x;
        var offsetY = this.canvRef.current.getBoundingClientRect().y;

        this.setState({
          pentrace: [...this.state.pentrace, {x: event.clientX - offsetX,y: event.clientY - offsetY}]
        })
      }
    }
  }

  pointerOutHandler(event){
    this.pointerUpHandler(event);
    this.setState({
      temptrace: null
    })
    this.props.setDisplaytraces(this.state.selectedtraces)
    //this.props.clrDisplaytrace();
  }

  dist(a,b){
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
  }

  interpretTrace(trace) {
    var arr = new Array(this.state.numOfEls).fill(0)

    for(var i = 0; i < trace.length; i++){
      if(trace[i].y > 30 && trace[i].y < this.getSize().y - 10)
        for(var j = 0; j < this.state.numOfEls; j++){
          if(trace[i].x > 20 + 120 * j && trace[i].x < 120 + j * 120){
            arr[j]++
            break
          }
      }
    }

    var threshold = 1;
    var temp = arr.map(x => x > threshold);

    var result = []
    var uitrace = this.getUItraceList();

    for(i = 0; i < uitrace.length; i++){

      if(temp[i]){
        result.push(uitrace[i].t)
      }
    }

    return result;
  }

  render() {
    return (
    <canvas id="historybar-canvas" 
    ref={this.canvRef} 
    height={this.getSize.bind(this).y} 
    width={this.getSize.bind(this).x} 
    onContextMenu={(e)=>  {e.preventDefault(); return false;}}
    onPointerDown={this.pointerDownHandler.bind(this)} 
    onPointerUp={this.pointerUpHandler.bind(this)} 
    onPointerMove={this.pointerMoveHandler.bind(this)}
    onPointerOut={this.pointerOutHandler.bind(this)}
    ></canvas>
    );
  }
}



const mapStateToProps = (state, ownProps) => {
    return {
      traces: state.traces,
      uicolor: state.uicolor
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      delTrace: (t) => { dispatch({type: 'DEL_UITRACE', t: t}) },
      setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
      setInit: () => { dispatch({type: 'SET_INIT'}) },
      addDisplaytrace: (t,alpha) => { dispatch({type: 'ADD_DISPLAYTRACE', t: t, alpha: alpha}) },
      setDisplaytraces: (list) => { dispatch({ type: 'SET_DISPLAYTRACES', list})},
      clrDisplaytraces: () => { dispatch({type: 'CLR_DISPLAYTRACES'}) },
      clrDisplaytrace: (t) => { dispatch({type: 'CLR_DISPLAYTRACE', t}) },
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Historybar);
 