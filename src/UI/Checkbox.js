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

      } 
      else if (this.props.title === 'end'){
        ctx.strokeStyle = this.props.uicolor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40,30);
        ctx.lineTo(70,30);
        ctx.moveTo(40,10);
        ctx.lineTo(70,10);
        ctx.arc(70, 20, 10, Math.PI*3/2, Math.PI/2)
        ctx.moveTo(40,20);
        ctx.lineTo(70,20);
        ctx.stroke();

        ctx.fillStyle = this.props.uicolor;
        ctx.beginPath();
        ctx.arc(70, 20, 3, 0, 2*Math.PI)
        ctx.fill()
      }
      else if(this.props.title === 'line'){
        ctx.strokeStyle = this.props.uicolor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(45,20);
        ctx.lineTo(85,20);
        ctx.stroke();
        ctx.fillStyle = this.props.uicolor;
        ctx.beginPath();
        ctx.arc(42.5, 20, 3, 0, 2*Math.PI)
        ctx.arc(87.5, 20, 3, 0, 2*Math.PI)
        ctx.fill()
      }

      else if(this.props.title === 'shadow'){
        ctx.strokeStyle = this.props.uicolor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(40,17);
        ctx.lineTo(80,17);
        ctx.shadowColor = this.props.uicolor;
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 6;
        ctx.stroke();
        ctx.fillStyle = this.props.uicolor;
        ctx.shadowColor = 'transparent'
      }
      else if(this.props.title === 'fill'){
        // #path20
	ctx.beginPath();
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.lineWidth = 0.224014;
	ctx.moveTo(53.171595, 13.160542);
	ctx.lineTo(58.256718, 18.861929);
	ctx.bezierCurveTo(58.256718, 20.557044, 56.561601, 22.560180, 56.561601, 24.717437);
	ctx.bezierCurveTo(56.561601, 28.261566, 61.184361, 28.261566, 61.184361, 24.563315);
	ctx.bezierCurveTo(61.184361, 21.943693, 59.335123, 18.861929, 58.410615, 18.091321);
	ctx.moveTo(49.473343, 11.927792);
	ctx.lineTo(55.637095, 18.091544);
	ctx.lineTo(43.309592, 18.091544);
	ctx.moveTo(49.858647, 9.616413);
	ctx.bezierCurveTo(49.473343, 9.231109, 49.473343, 9.231109, 49.088263, 9.616413);
	ctx.lineTo(39.072139, 20.017842);
	ctx.bezierCurveTo(38.686834, 20.403146, 38.686834, 20.403146, 39.072139, 20.788227);
	ctx.lineTo(47.547269, 29.263359);
	ctx.bezierCurveTo(47.932573, 29.648662, 47.932573, 29.648662, 48.317654, 29.263359);
	ctx.lineTo(58.333778, 18.861929);
	ctx.lineTo(58.333778, 18.091544);
	ctx.fill();
      }
      else{
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