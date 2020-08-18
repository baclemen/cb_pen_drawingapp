import React, { Component } from 'react';
import { connect } from 'react-redux'

class Historyselector extends Component {
  state = {
      selectedOption: '0',
      pointertrace: [],
  }

  constructor(props){
      super(props);
      this.setHistory = props.setHistory
      this.canvRef = React.createRef();
  }

  componentDidMount(){
    this.drawComponent();
  }

  componentDidUpdate(){
    this.drawComponent();

    const ctx = this.canvRef.current.getContext('2d')

    if(this.state.pointertrace.length > 0){
      ctx.beginPath();
      ctx.strokeStyle = this.props.uicolor;
      ctx.moveTo(this.state.pointertrace[0].x, this.state.pointertrace[0].y)
      for(var i = 1; i < this.state.pointertrace.length; i++){
        ctx.lineTo(this.state.pointertrace[i].x, this.state.pointertrace[i].y)
      }
    }
    ctx.stroke()


  }

  drawComponent(){
    const ctx = this.canvRef.current.getContext('2d')
    const delX = 70;
    ctx.clearRect(0,0,350,40)
    for(var i = 0; i < 4; i++){
      ctx.strokeStyle = this.props.uicolor;
      ctx.beginPath();
      ctx.arc(15 + i * 70 + 70, 20, 10, 0, 2 * Math.PI);
      ctx.rect(32 + i * 70 + 70, 5, 30, 30);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(32 + 70,5);
    ctx.lineTo(62 + 70,35);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(102 + 70,25,30,10);
    ctx.fillStyle = this.props.uicolor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(187 + 70, 20, 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();

    for (i=0; i< 130; i++) {
      var angle = 0.1 * i;
      var x= 257 + 70 + (1+angle)*Math.cos(angle);
      var y= 20 + (1+angle)*Math.sin(angle);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(15  + 70 + this.state.selectedOption * 70, 20, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  pointerDownHandler(e){
    var p = {x: e.clientX - this.canvRef.current.getBoundingClientRect().x,y: e.clientY - this.canvRef.current.getBoundingClientRect().y};
    this.setState({
      pointertrace: [p],
      pendown: true
    })

    for(var i = 0; i < 4; i++){
      if(this.dist(p, {x: 10 + 70*i + 70, y: 20}) < 10){
        this.setState({selectedOption : i})
        this.props.clrDisplaytraces();
        this.setHistory(i.toString());
        break;
      }
    }

  }

  pointerUpHandler(e){
    this.setState({
      pointertrace: [],
      pendown: false,
    })
  }

  pointerMoveHandler(e){
    if(this.state.pendown){
      var p = {x: e.clientX - this.canvRef.current.getBoundingClientRect().x,y: e.clientY - this.canvRef.current.getBoundingClientRect().y};
      this.setState({
        pointertrace: [...this.state.pointertrace, p],
      })
  
      for(var i = 0; i < 4; i++){
        if(this.dist(p, {x: 10 + 70*i + 70, y: 20}) < 10){
          this.setState({selectedOption : i})
          this.props.clrDisplaytraces();
          this.setHistory(i.toString())
          break;
        }
      }
    }
  }

  dist(a,b){
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
  }
  
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
    this.setHistory(changeEvent.target.value)
  }

  render() {
    return (
        <canvas 
        ref={this.canvRef} 
        id="historyselector"
        height="40px" 
        width="350px"
        onPointerDown={this.pointerDownHandler.bind(this)} 
        onPointerUp={this.pointerUpHandler.bind(this)} 
        onPointerMove={this.pointerMoveHandler.bind(this)}
        />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      uicolor: state.uicolor,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clrDisplaytraces: () => { dispatch({type: 'CLR_DISPLAYTRACES'}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Historyselector);
