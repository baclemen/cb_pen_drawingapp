import React, { Component } from 'react';
import { connect } from 'react-redux'

class Button extends Component {
  state={
    numOfEls: 5,
    pointertrace: []
  }

  constructor(props) {
        super(props);
        this.canvRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
  }
    
  handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'historybox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
        
  }

  componentDidUpdate(){
    const ctx = this.canvRef.current.getContext('2d');

    ctx.clearRect(0,0,100,100);

    this.drawComponent()

    if(this.state.pointertrace.length > 0){
      ctx.beginPath();
      ctx.moveTo(this.state.pointertrace[0].x, this.state.pointertrace[0].y)
      for(var i = 1; i < this.state.pointertrace.length; i++){
        ctx.lineTo(this.state.pointertrace[i].x, this.state.pointertrace[i].y)
      }
    }
    ctx.stroke()


    // var penstate =this.props.initpenstate;

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

    this.props.clrDisplaytraces();
    if(this.state.historybox){
      var uitracelist = this.getUItraceList()
      for(i = 0; i < uitracelist.length; i++){
        this.props.addDisplaytrace(uitracelist[i].t, 1)//(6-uitracelist.length)*.2 + .2*i);
      }
    }
    else{

    }
  }

  componentDidMount(){
    this.drawComponent()
  }

  drawComponent(){
    const ctx = this.canvRef.current.getContext('2d');
    ctx.strokeStyle = this.props.uicolor;
    ctx.beginPath();
    ctx.rect(50,50,40,40);

    if(this.state.historybox){
      ctx.moveTo(50,50);
      ctx.lineTo(90,90);
      ctx.moveTo(90,50);
      ctx.lineTo(50,90);
    }
    ctx.stroke();

    ctx.fillStyle = this.props.uicolor;
    ctx.font = "12px Tahoma";
    ctx.textAlign = "end";
    ctx.fillText("Display", 40, 67);
    ctx.fillText("Traces", 40, 85);

  }
  
  getUItraceList(){
    return this.props.traces.filter(el => el.type === 'ui' || (el.type === 'imgtrace' && el.transform.type !== 'place'))//.slice(-this.state.numOfEls-1)
  }

  pointerDownHandler(e){
    var p = {x: e.clientX - this.canvRef.current.getBoundingClientRect().x,y: e.clientY - this.canvRef.current.getBoundingClientRect().y};
    this.setState({
      pointertrace: [p],
      pendown: true
    })
  }

  pointerUpHandler(e){
    //console.log(this.state.pointertrace)
    var p = {x: e.clientX - this.canvRef.current.getBoundingClientRect().x,y: e.clientY - this.canvRef.current.getBoundingClientRect().y};
    var p1 = {x:50,y:50}
    var p2 = {x:90,y:90}
    if(this.state.pointertrace.length < 4 && this.inBox(p,p1,p2)){
      var value = !this.state.historybox;
      //console.log(value)
      this.setState({
        historybox: value
      });
    }
    this.setState({
      pointertrace: [],
      pendown: false,
    })
  }

  pointerMoveHandler(e){
    if(this.state.pendown){
      var p = {x: e.clientX - this.canvRef.current.getBoundingClientRect().x,y: e.clientY - this.canvRef.current.getBoundingClientRect().y};

      var p1 = {x:50,y:50}
      var p2 = {x:90,y:90}

      if(this.state.pointertrace.length > 0 && !this.inBox(this.state.pointertrace[this.state.pointertrace.length - 1],p1,p2) && this.inBox(p,p1,p2)){
        var value = !this.state.historybox;
        //console.log(value)
        this.setState({
          historybox: value
        });
      }

      this.setState({
        pointertrace: [...this.state.pointertrace, p],
      })
    }
  }

  dist(a,b){
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
  }

  inBox(val, p1, p2){
    return val.x > p1.x && val.y > p1.y && val.x < p2.x && val.y < p2.y;
  }

  render() {
    return (
        <div id="historybox">
          <canvas
          height="100px"
          width="100px"
          ref={this.canvRef} 
          onPointerDown={this.pointerDownHandler.bind(this)} 
          onPointerUp={this.pointerUpHandler.bind(this)} 
          onPointerMove={this.pointerMoveHandler.bind(this)}
          ></canvas>
            {/* <form>
                <label>
                showHistory
                    <input
                        name="historybox" type="checkbox"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange}
                    />
                </label>
            </form> */}
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    traces: state.traces,
    initpenstate: state.initpenstate,
    uicolor: state.uicolor
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
    addDisplaytrace: (t,alpha) => { dispatch({type: 'ADD_DISPLAYTRACE', t: t, alpha: alpha}) },
    clrDisplaytraces: () => { dispatch({type: 'CLR_DISPLAYTRACES'}) },
    setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Button);