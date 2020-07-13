import React, { Component } from 'react';
import { connect } from 'react-redux'



class InteractionLayer extends Component {
  state = {
    pointertrace: [],
    stateupdated: [],
    pendown: false,
  }

  constructor(props){
      //console.log(props)
      super(props);
      this.canvRef = React.createRef();
      this.getSize = props.getSize;
      this.interpretTraceEl = props.interpretTraceEl
  }

  pointerDownHandler(e) {
    //console.log(e, this)
    this.setState({
      pendown: true,
      pointertrace: [{x: e.clientX, y: e.clientY}]
    })

    const ctx = this.canvRef.current.getContext('2d');

    ctx.beginPath();
  }

  pointerUpHandler(e) {
    this.props.addTrace(this.state.pointertrace);
    this.setState({
      pendown: false,
      pointertrace: []
    })
    const ctx = this.canvRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
  }

  pointerMoveHandler(e) {
    if (this.state.pendown) {
      this.setState({
        pointertrace: [...this.state.pointertrace, {x: e.clientX, y: e.clientY}]
      })
      const ctx = this.canvRef.current.getContext('2d');

      if(this.interpretTraceEl(this.state.pointertrace.slice(-2))){
        console.log("notnull")
      }


      ctx.moveTo(this.state.pointertrace[this.state.pointertrace.length-1].x, this.state.pointertrace[this.state.pointertrace.length-1].y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke(); 
    }
  }


  render() {
    //console.log(this.props);
    return (
        <canvas id="interactionlayer" ref={this.canvRef} height={this.getSize().y} width={this.getSize().x} onPointerDown={this.pointerDownHandler.bind(this)} onPointerUp={this.pointerUpHandler.bind(this)} onPointerMove={this.pointerMoveHandler.bind(this)}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    uitraces: state.traces,
    penstate: state.penstate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTrace: (pointertrace) => { dispatch({type: 'ADD_UITRACE', trace: pointertrace}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractionLayer);
