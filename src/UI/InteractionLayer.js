import React, { Component } from 'react';
import { connect } from 'react-redux'



class InteractionLayer extends Component {
  state = {
    pointertrace: [],
    changes: {},
    pendown: false,
  }

  constructor(props){
      super(props);
      this.canvRef = React.createRef();
      this.getSize = props.getSize;
      this.interpretTraceEl = props.interpretTraceEl
  }

  pointerDownHandler(e) {
    if(e.button===5){
      return}
    //console.log(e, this)
    this.setState({
      pendown: true,
      pointertrace: [{x: e.clientX, y: e.clientY}]
    })

    const ctx = this.canvRef.current.getContext('2d');

    ctx.beginPath();
  }

  pointerUpHandler(e) {
    if(e.button===5){
      this.setState({
        pendown: false,
        pointertrace: [],
        changes: {}
      })
      for(var i = 0; i < this.props.displaytraces.length; i++){
        var trace = this.props.traces.find(el => el.t === this.props.displaytraces[i].t).trace;
        var t = this.props.traces.find(el => el.t === this.props.displaytraces[i].t).t;
        for(var j = 0; j < trace.length; j++){
          if(Math.pow((trace[j].x - e.clientX),2) + Math.pow((trace[j].x - e.clientX),2) < Math.pow(5,2)){
            this.props.delTrace(t);
            this.props.clrDisplaytrace();
            return
          }
        }
      }
      return
    }
    this.props.addTrace(this.state.pointertrace, this.state.changes);
    this.setState({
      pendown: false,
      pointertrace: [],
      changes: {}
    })
    const ctx = this.canvRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
  }

  pointerMoveHandler(e) {
    if(e.button===5){
      return}
    if (this.state.pendown) {
      this.setState({
        pointertrace: [...this.state.pointertrace, {x: e.clientX, y: e.clientY}]
      })
      const ctx = this.canvRef.current.getContext('2d');

      var change = this.interpretTraceEl(this.state.pointertrace.slice(-2))
      if(change){
        this.setState({ 
          changes : {...this.state.changes, ...change}
        })
      }


      ctx.moveTo(this.state.pointertrace[this.state.pointertrace.length-1].x, this.state.pointertrace[this.state.pointertrace.length-1].y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke(); 
    }
  }

  componentDidUpdate(){
    if(!this.state.pendown){
      this.displaytraces();
    }
  }

  displaytraces(){
    const ctx = this.canvRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
    for(var i = 0; i < this.props.displaytraces.length; i++){
      var tmp = this.props.traces.find(el => el.t === this.props.displaytraces[i].t)
      if(tmp){
        this.drawtrace(ctx, tmp.trace, this.props.displaytraces[i].alpha);
      }
    }
  }

  drawtrace(ctx, trace, alpha){
    ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
    ctx.beginPath();
    ctx.moveTo(trace[0].x, trace[0].y);

    for(var i = 1; i < trace.length; i++){
      ctx.lineTo(trace[i].x,trace[i].y);
    }
    ctx.stroke();
  }

  render() {
    //console.log(this.props);
    return (
        <canvas id="interactionlayer" 
        ref={this.canvRef} 
        height={this.getSize().y} 
        width={this.getSize().x} 
        onPointerDown={this.pointerDownHandler.bind(this)} 
        onPointerUp={this.pointerUpHandler.bind(this)} 
        onPointerMove={this.pointerMoveHandler.bind(this)}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    traces: state.traces,
    penstate: state.penstate,
    displaytraces: state.displaytraces,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTrace: (pointertrace, changes) => { dispatch({type: 'ADD_UITRACE', trace: pointertrace, changes: changes}) },
    delTrace: (t) => { dispatch({type: 'DEL_UITRACE', t: t}) },
    clrDisplaytrace: () => { dispatch({type: 'CLR_DISPLAYTRACE'}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractionLayer);
