import React, { Component } from 'react';
import { connect } from 'react-redux'

class Checkbox extends Component{

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
  

      if (this.props.title === 'linedash'){
        ctx.strokeStyle = this.props.uicolor;
        ctx.lineWidth = 3;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(40,20);
        ctx.lineTo(90,20);
        ctx.stroke();

      } else {
        ctx.lineWidth = 1;
        //title
        ctx.font = "15px Tahoma"
        ctx.fillStyle = this.props.uicolor;
        ctx.fillText(this.props.title, 40, 27)
    }
    
      ctx.setLineDash([]);
      //box
      ctx.beginPath();
      ctx.strokeStyle = this.props.uicolor
      ctx.lineWidth = 3;
      ctx.moveTo(110,10);
      ctx.lineTo(130,10);
      ctx.lineTo(130,30);
      ctx.lineTo(110,30);
      ctx.lineTo(110,10)
      ctx.stroke();

      if(this.props.penstate[this.props.title]){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(110,10);
        ctx.lineTo(130,30);
        ctx.moveTo(130,10);
        ctx.lineTo(110,30);
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