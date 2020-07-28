import React, { Component } from 'react';
import { connect } from 'react-redux'

class Button extends Component {
  state={
    numOfEls: 5
  }

  constructor(props) {
        super(props);
        this.canvRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
  }
    
  handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'historybox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
        
  }

  componentDidUpdate(){
    const ctx = this.canvRef.current.getContext('2d')

    ctx.clearRect(0,0,200,100)

    this.drawComponent()

    if(this.state.pointertrace.length > 0){
      ctx.beginPath();
      ctx.strokeStyle = this.props.uicolor;
      ctx.moveTo(this.state.pointertrace[0].x, this.state.pointertrace[0].y)
      for(var i = 1; i < this.state.pointertrace.length; i++){
        ctx.lineTo(this.state.pointertrace[i].x, this.state.pointertrace[i].y)
      }
    }
    ctx.stroke()


    var penstate =this.props.initpenstate;

    for(var i = 0; i < this.props.traces.length; i++){
      if(this.props.traces[i].type === 'ui'){
        penstate = {...penstate, ...this.props.traces[i].changes}
      }
    }
    if(penstate){
      this.props.setPenstate(penstate)
    }
    else{
      this.props.setInit()
    }

    this.props.clrDisplaytrace();
    if(this.state["historybox"]){
      var uitracelist = this.getUItraceList()
      for(i = 0; i < uitracelist.length; i++){
        this.props.addDisplaytrace(uitracelist[i].t, (6-uitracelist.length)*.2 + .2*i);
      }
    }
    else{

    }
  }

  drawComponent(){
    const ctx = this.canvRef.current.getContext('2d');
    console.log("kan")
    ctx.beginPath();
    ctx.rect(10,10,30,30);
    ctx.stroke();

  }
  
  getUItraceList(){
    return this.props.traces.filter(el => el.type === 'ui').slice(-this.state.numOfEls-1)
  }

  pointerDownHandler(e){
    var p = {x: e.clientX - this.canvRef.current.getBoundingClientRect().x,y: e.clientY - this.canvRef.current.getBoundingClientRect().y};
    this.setState({
      pointertrace: [p],
      pendown: true
    })
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
      console.log(this.state.pointertrace)
    }
  }

  dist(a,b){
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
  }

  render() {
    return (
        <div id="historybox">
          <canvas
          height="100px"
          width="200px"
          ref={this.canvRef} 
          onPointerDown={this.pointerDownHandler.bind(this)} 
          onPointerUp={this.pointerUpHandler.bind(this)} 
          onPointerMove={this.pointerMoveHandler.bind(this)}
          ></canvas>
            <form>
                <label>
                showHistory
                    <input
                        name="historybox" type="checkbox"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange}
                    />
                </label>
            </form>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    traces: state.traces,
    initpenstate: state.initpenstate,
    uicolor: state.uicolor
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
    addDisplaytrace: (t,alpha) => { dispatch({type: 'ADD_DISPLAYTRACE', t: t, alpha: alpha}) },
    clrDisplaytrace: () => { dispatch({type: 'CLR_DISPLAYTRACE'}) },
    setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Button);