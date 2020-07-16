import React, { Component } from 'react';
import { connect } from 'react-redux'



class Penslider extends Component {
  status = {
      sliderpos: 0
  }

  constructor(props){
      super(props);
      this.canvRef = React.createRef();
  }
  componentDidMount(){
    this.setState({
        width: this.props.width,
        heigth: this.props.height,
        sliderpos: 0
    })
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
    ctx.fillText(this.props.title, 0, 30)

    //sliderline
    ctx.beginPath();

    ctx.moveTo(0, 75);
    ctx.lineTo(320, 75);
    ctx.stroke(); 

    //slider
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(this.props.penstate[this.props.title]*320, 50);
    ctx.lineTo(this.props.penstate[this.props.title]*320, 100);
    ctx.stroke();
  }


  render() {
    return (
        <canvas id={this.props.title} ref={this.canvRef} className="slider" height={this.props.height} width={this.props.width*.8}/>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
        penstate: state.penstate,
        displaytraces: state.displaytraces
    }
  }
  
  export default connect(mapStateToProps)(Penslider);
  