import React, { Component } from 'react';
import { connect } from 'react-redux';

class Historybar extends Component {
  state = {
      numOfEls: 10
  }

  constructor(props){
      super(props);
      this.canvRef = React.createRef();
  }

  getSize(){
    return {x: this.state.width, y: this.state.height}
  }

  getUItraceList(){
    return this.props.traces.filter(el => el.isUI).slice(-this.state.numOfEls)
  }

  componentDidMount(){
    var height = document.getElementById('historybar-canvas').clientHeight;
    var width = document.getElementById('historybar-canvas').clientWidth;
    this.setState({
      height: height,
      width: width,
      numOfEls: (Math.floor(width / 120))
    })
  }

  drawHistory(){
    var uitracelist = this.getUItraceList();
    const ctx = this.canvRef.current.getContext('2d');
    ctx.canvas.width  = this.getSize().x;
    ctx.canvas.height = this.getSize().y;
    ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
    var offsetX = 120;
      
    for(var i = 0; i < uitracelist.length; i++){

        ctx.beginPath();
        ctx.moveTo(uitracelist[i].trace[0].x / 4 + 25 + offsetX * i, uitracelist[i].trace[0].y / 4 + 12);

        for(var j = 0; j < uitracelist[i].trace.length; j++){
            ctx.lineTo(uitracelist[i].trace[j].x / 4 + 25 + offsetX * i, uitracelist[i].trace[j].y / 4 + 12);
        }
        ctx.stroke();
    }
  }

  componentDidUpdate(){
    var penstate =this.props.initpenstate;

    for(var i = 0; i < this.props.traces.length; i++){
      if(this.props.traces[i].isUI){
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
  }

  pointerUpHandler(event){
    var uitracelist = this.getUItraceList()
    if(event.button === 5 && event.clientX % 120 > 20 && event.clientX / 120 <= this.getUItraceList().length){
        this.props.clrDisplaytrace()
        this.props.delTrace(uitracelist[Math.floor(event.clientX / 120)].t)
    }
  }

  pointerMoveHandler(event){
    this.props.clrDisplaytrace()
    var uitracelist = this.getUItraceList();
    if(event.clientX % 120 > 20 && event.clientX / 120 <= this.getUItraceList().length){
      this.props.addDisplaytrace(uitracelist[Math.floor(event.clientX / 120)].t, 1);
    }
  }

  pointerOutHandler(event){
    this.props.clrDisplaytrace();
  }

  render() {
    return (
    <canvas id="historybar-canvas" 
    ref={this.canvRef} 
    height={this.getSize.bind(this).y} 
    width={this.getSize.bind(this).x} 
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
 