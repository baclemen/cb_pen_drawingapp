import React, { Component } from 'react';
import { connect } from 'react-redux';

class Historybar extends Component {
  state = {
      numOfEls: 10,
      pentrace: [],
      pendown : false,
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

    ctx.strokeStyle = this.props.uicolor

    ctx.moveTo(10,30);
    ctx.lineTo(10, this.getSize().y - 10);
    ctx.lineTo(10 + uitracelist.length * 120, this.getSize().y - 10);
    ctx.lineTo(10 + uitracelist.length * 120, 30);
    ctx.lineTo(10,30);
    ctx.stroke();

    var offsetX = 120;
    
    for(var i = 0; i < uitracelist.length; i++){

        ctx.fillStyle = this.props.uicolor;
        ctx.font = "15px Tahoma"
        ctx.textAlign = "center";

        if(i+1 == uitracelist.length){
          ctx.fillText("t", 10 + 60 + 120*i, 20); 
        }
        else{
          ctx.fillText("t - " + (uitracelist.length - i - 1), 10 + 60 + 120*i, 20); 
        }
        

        ctx.beginPath();
        ctx.moveTo(uitracelist[i].trace[0].x / 4 + 25 + offsetX * i, uitracelist[i].trace[0].y / 4 + 22);

        for(var j = 0; j < uitracelist[i].trace.length; j++){
            ctx.lineTo(uitracelist[i].trace[j].x / 4 + 25 + offsetX * i, uitracelist[i].trace[j].y / 4 + 22);
        }
        ctx.stroke();
    }
    //drawing the pentrace
    console.log(this.state.pendown, this.state.pentrace.length)
    if(this.state.pentrace.length > 0){
      ctx.beginPath();
      ctx.moveTo(this.state.pentrace[0].x, this.state.pentrace[0].y)
      for(var i = 1; i < this.state.pentrace.length; i++){
        ctx.lineTo(this.state.pentrace[i].x, this.state.pentrace[i].y)
      }
      ctx.stroke()
    }

  }

  componentDidUpdate(){
    var penstate = this.props.initpenstate;

    for(var i = 0; i < this.props.traces.length; i++){
      if(this.props.traces[i].type === 'ui'){
        penstate = {...penstate, ...this.props.traces[i].changes}
      }
    }
    if(penstate){
      this.props.setPenstate(penstate)
    }
    else{
      this.props.setInit()
    }
    this.drawHistory()
  }

  pointerDownHandler(event){
    //console.log(event.button)
    if(event.button === 5 || event.button===2){
    }
    else{
      console.log(event.clientX)
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
        this.props.clrDisplaytrace()
        this.props.delTrace(uitracelist[Math.floor(event.clientX / 120)].t)
    }
    else{
      if(this.dist( this.state.pentrace[0], this.state.pentrace[this.state.pentrace.length-1]) < 40){
        this.setState({
          pendown: false
        })
      }
      else{
        this.setState({
          pentrace: [],
          pendown: false
        })
      }
    }
  }

  pointerMoveHandler(event){
    this.props.clrDisplaytrace()
    var uitracelist = this.getUItraceList();
    if(event.clientX % 120 > 20 && event.clientX / 120 <= this.getUItraceList().length){
      this.props.addDisplaytrace(uitracelist[Math.floor(event.clientX / 120)].t, 1);
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
    this.props.clrDisplaytrace();
  }

  dist(a,b){
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
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
      clrDisplaytrace: () => { dispatch({type: 'CLR_DISPLAYTRACE'}) }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Historybar);
 