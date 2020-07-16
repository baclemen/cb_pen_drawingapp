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
      if(this.state.pendown){}
      else{this.drawalltraces()}

      const ctx = this.canvRef.current.firstChild.getContext('2d')
      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
      var penstate = this.props.initpenstate

      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);


      for(var i = 0; i < this.props.traces.length; i++){
          if(this.props.traces[i].isUI){
            penstate = {...penstate, ...this.props.traces[i].changes}
          }
      }
      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);
      console.log(penstate)
      if(penstate.linedash){
        ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
      }
      else{
        ctx.setLineDash([])
      }
      
      
      if (this.state.pointertrace.length > 1){
        ctx.beginPath();
        ctx.moveTo(this.state.pointertrace[0].x, this.state.pointertrace[0].y);

        for (i = 1; i < this.state.pointertrace.length; i++){
              ctx.lineTo(this.state.pointertrace[i].x, this.state.pointertrace[i].y);
        }

        ctx.stroke()
      }
    }
    
    getSize(){
        return {x: this.state.width, y: this.state.height}
      }

    constructor(props){
        super(props)
        this.canvRef = React.createRef();
    }
  
    pointerDownHandler(e) {
      const offsetTop = this.canvRef.current.firstChild.offsetTop;
      const offsetLeft = this.canvRef.current.firstChild.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
      this.setState({
        pendown: true,
        pointertrace: [{x: e.clientX - offsetLeft, y: e.clientY - offsetTop}]
      })
  
      const ctx = this.canvRef.current.firstChild.getContext('2d');

      ctx.strokeStyle = this.getColor(this.props.initpenstate);
      ctx.lineWidth = this.getPoint(this.props.initpenstate);
      var penstate =this.props.initpenstate;

      for(var i = 0; i < this.props.traces.length; i++){
        if(this.props.traces[i].isUI){
          penstate = {...penstate, ...this.props.traces[i].changes}
          ctx.strokeStyle = this.getColor(penstate);
          ctx.lineWidth = this.getPoint(penstate);
        }
      }
    }
  
    pointerUpHandler(e) {
      const ctx = this.canvRef.current.firstChild.getContext('2d');
      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
      this.props.addTrace(this.state.pointertrace)
      this.setState({
        pendown: false,
        pointertrace: []
      })
    }

    drawalltraces(){

      const ctx = this.canvRef.current.lastChild.getContext('2d');

      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);

      let penstate = this.props.initpenstate;

      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);
      if(penstate.linedash){
        ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
      }
      else{
        ctx.setLineDash([])
      }


      for(var i = 0; i < this.props.traces.length; i++){
          if(this.props.traces[i].isUI){
            penstate = {...penstate, ...this.props.traces[i].changes}
            ctx.strokeStyle = this.getColor(penstate);
            ctx.lineWidth = this.getPoint(penstate);
            if(penstate.linedash){
              ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
            }
            else{
              ctx.setLineDash([])
            }
            continue
          }

          ctx.beginPath();
          ctx.moveTo(this.props.traces[i].trace[0].x, this.props.traces[i].trace[0].y);


          for (var j = 1; j < this.props.traces[i].trace.length; j++){
              ctx.lineTo(this.props.traces[i].trace[j].x, this.props.traces[i].trace[j].y);
          }

          ctx.stroke()
      }
  
    }
  
    pointerMoveHandler(e) {
      if (this.state.pendown) {

        const offsetTop = this.canvRef.current.firstChild.offsetTop;
        const offsetLeft = this.canvRef.current.firstChild.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
        this.setState({
          pointertrace: [...this.state.pointertrace, {x: e.clientX - offsetLeft, y: e.clientY - offsetTop}]
        })
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
          <div ref={this.canvRef} >
              <canvas id="drawing-canvas" 
              height={this.getSize().y} 
              width={this.getSize().x} 
              onPointerDown={this.pointerDownHandler.bind(this)} 
              onPointerUp={this.pointerUpHandler.bind(this)} 
              onPointerMove={this.pointerMoveHandler.bind(this)} 
              />
              <canvas id="drawing-canvas2" 
              height={this.getSize().y} 
              width={this.getSize().x} 
              />
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
      traces: state.traces,
      initpenstate: state.initpenstate,
      t:state.t
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
      addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);