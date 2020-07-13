import React, { Component } from 'react';
import { connect } from 'react-redux'

class Canvas extends Component {

    state = {
        pointertrace: [],
        pendown: false,
      }

    componentDidMount(){
        var height = document.getElementById('drawing-canvas').clientHeight;
        var width = document.getElementById('drawing-canvas').clientWidth;
        this.setState({
          height,
          width
        })
    
    }
    componentDidUpdate(){
        
    }
    
    getSize(){
        return {x: this.state.width, y: this.state.height}
      }

    constructor(props){
        super(props)
        this.canvRef = React.createRef()
    }
  
    pointerDownHandler(e) {
      this.setState({
        pendown: true,
        pointertrace: [{x: e.clientX, y: e.clientY}]
      })
  
      const ctx = this.canvRef.current.getContext('2d');
      ctx.strokeStyle = this.getColor(this.props.penstate);
      ctx.lineWidth = this.getPoint(this.props.penstate);
    }
  
    pointerUpHandler(e) {

      const ctx = this.canvRef.current.getContext('2d');
      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
      this.drawalltraces();
      this.drawcurrenttrace();

      this.props.addTrace(this.state.pointertrace)
      this.setState({
        pendown: false,
        pointertrace: []
      })
      console.log(this.props.penstate)

  

    }

    drawalltraces(){

      const offsetTop = this.canvRef.current.offsetTop;
      const offsetLeft = this.canvRef.current.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
      const ctx = this.canvRef.current.getContext('2d');


      for(var i = 0; i < this.props.drawtraces.length; i++){
          ctx.beginPath();
          ctx.moveTo(this.props.drawtraces[i].trace[0].x - offsetLeft, this.props.drawtraces[i].trace[0].y - offsetTop);
          ctx.strokeStyle = this.getColor(this.props.drawtraces[i].penstate);
          ctx.lineWidth = this.getPoint(this.props.drawtraces[i].penstate);

          for (var j = 1; j < this.props.drawtraces[i].trace.length; j++){
              ctx.lineTo(this.props.drawtraces[i].trace[j].x - offsetLeft, this.props.drawtraces[i].trace[j].y - offsetTop);
          }

          ctx.stroke()
      }
  
    }

    drawcurrenttrace(){

        const offsetTop = this.canvRef.current.offsetTop;
        const offsetLeft = this.canvRef.current.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
        const ctx = this.canvRef.current.getContext('2d');

        ctx.beginPath();
        ctx.strokeStyle = this.getColor(this.props.penstate);
        ctx.lineWidth = this.getPoint(this.props.penstate);
        ctx.moveTo(this.state.pointertrace[0].x - offsetLeft, this.state.pointertrace[0].y - offsetTop);

        for(var i = 1; i < this.state.pointertrace.length; i++){
            ctx.lineTo(this.state.pointertrace[i].x - offsetLeft, this.state.pointertrace[i].y - offsetTop);
        }
        ctx.stroke()

    }
  
    pointerMoveHandler(e) {
      if (this.state.pendown) {
        this.setState({
          pointertrace: [...this.state.pointertrace, {x: e.clientX, y: e.clientY}]
        })
        const ctx = this.canvRef.current.getContext('2d')

        const offsetTop = this.canvRef.current.offsetTop;
        const offsetLeft = this.canvRef.current.offsetLeft + this.canvRef.current.parentElement.offsetLeft;


        ctx.beginPath();
        ctx.moveTo(this.state.pointertrace[this.state.pointertrace.length-1].x - offsetLeft, this.state.pointertrace[this.state.pointertrace.length-1].y - offsetTop)
        ctx.lineTo(e.clientX - offsetLeft, e.clientY - offsetTop);
        ctx.stroke(); 
      }
    }

    getColor(penstate){
        var newcolor = penstate.color.slice(0,7)
        if(penstate.alpha * 255 < 17){
            newcolor = newcolor + "0" + Math.floor(penstate.alpha*255).toString(16);
        }
        else {
            newcolor = newcolor + Math.floor(penstate.alpha*255).toString(16);
        }
        return newcolor;
    }

    getPoint(penstate){
        return penstate.point * 50;
    }


    render(){
        return(
            <canvas id="drawing-canvas" ref={this.canvRef} height={this.getSize().y} width={this.getSize().x} onPointerDown={this.pointerDownHandler.bind(this)} onPointerUp={this.pointerUpHandler.bind(this)} onPointerMove={this.pointerMoveHandler.bind(this)}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
      drawtraces: state.drawtraces,
      penstate: state.penstate
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
      addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);