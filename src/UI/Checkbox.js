import React, { Component } from 'react';
import { connect } from 'react-redux'

class Checkbox extends React.Component{

    state = {
        isChecked: false
    }
  
    constructor(props){
        super(props);
        this.canvRef = React.createRef();
    }

    componentDidUpdate(){
        this.renderCanvas()
    }
  
    renderCanvas(){
      const ctx = this.canvRef.current.getContext('2d');
      ctx.clearRect(0, 0, this.props.width, this.props.height);
  
      ctx.lineWidth = 1;
      //title
      ctx.font = "20px Tahoma"
      ctx.fillText(this.props.title, 80, 47)

      //box
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(40,30);
      ctx.lineTo(60,30);
      ctx.lineTo(60,50);
      ctx.lineTo(40,50);
      ctx.lineTo(40,30)
      ctx.stroke();

      if(this.props.penstate[this.props.title]){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(40,30);
        ctx.lineTo(60,50);
        ctx.moveTo(60,30);
        ctx.lineTo(40,50);
        ctx.stroke();
      }
    }

    render(){
        return(
            <canvas id={this.props.title} ref={this.canvRef} height={this.props.height} width={this.props.width}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        penstate: state.penstate

    }
}


export default connect(mapStateToProps)(Checkbox)