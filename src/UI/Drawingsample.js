import React, { Component } from 'react';
import { connect } from 'react-redux'


class Drawingsample extends Component {

    state = {}
  
    constructor(props){
        super(props);
        this.canvRef = React.createRef()
    }

    getSize(){
      return {x: this.state.width, y: this.state.height}
    }
  
    componentDidMount(){
      var height = document.getElementById('drawingsample-canvas').clientHeight;
      var width = document.getElementById('drawingsample-canvas').clientWidth;
      console.log(height,width)
      this.setState({
        height: height,
        width: width,
      })
    }    
  
    componentDidUpdate(){
      var penstate = this.props.penstate;
      const ctx = this.canvRef.current.getContext('2d');
      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);

      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);
      var trace = this.sampleTrace();

      ctx.beginPath();
      ctx.moveTo((trace[0].x-460), (trace[0].y-390));


      for (var j = 1; j < trace.length; j++){
          ctx.lineTo((trace[j].x-460), (trace[j].y-390));
      }

      ctx.stroke()
            
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

    sampleTrace() {
        return [{x: 564, y: 413.3333740234375}
        , {x: 565.3333740234375, y: 412.66668701171875}
        , {x: 566.6666870117188, y: 412.66668701171875}
        , {x: 566.6666870117188, y: 412}
        , {x: 566, y: 412}
        , {x: 565.3333740234375, y: 412}
        , {x: 564.6666870117188, y: 412}
        , {x: 563.3333740234375, y: 412}
        , {x: 560.6666870117188, y: 412.66668701171875}
        , {x: 557.3333740234375, y: 413.3333740234375}
        , {x: 553.3333740234375, y: 413.3333740234375}
        , {x: 548, y: 414}
        , {x: 542, y: 414.66668701171875}
        , {x: 535.3333740234375, y: 416}
        , {x: 528, y: 418}
        , {x: 520.6666870117188, y: 419.3333740234375}
        , {x: 514.6666870117188, y: 422}
        , {x: 508, y: 424}
        , {x: 502.66668701171875, y: 426.66668701171875}
        , {x: 498, y: 429.3333740234375}
        , {x: 494, y: 432}
        , {x: 491.3333740234375, y: 434}
        , {x: 489.3333740234375, y: 436.66668701171875}
        , {x: 488, y: 439.3333740234375}
        , {x: 488, y: 441.3333740234375}
        , {x: 488.66668701171875, y: 444}
        , {x: 490, y: 446}
        , {x: 492.66668701171875, y: 448}
        , {x: 496.66668701171875, y: 449.3333740234375}
        , {x: 501.3333740234375, y: 451.3333740234375}
        , {x: 506, y: 453.3333740234375}
        , {x: 511.3333740234375, y: 454.66668701171875}
        , {x: 516.6666870117188, y: 457.3333740234375}
        , {x: 521.3333740234375, y: 459.3333740234375}
        , {x: 525.3333740234375, y: 461.3333740234375}
        , {x: 528, y: 463.3333740234375}
        , {x: 530.6666870117188, y: 465.3333740234375}
        , {x: 532.6666870117188, y: 468}
        , {x: 533.3333740234375, y: 470}
        , {x: 533.3333740234375, y: 472.66668701171875}
        , {x: 532.6666870117188, y: 474}
        , {x: 531.3333740234375, y: 476}
        , {x: 530, y: 477.3333740234375}
        , {x: 528, y: 479.3333740234375}
        , {x: 525.3333740234375, y: 480.66668701171875}
        , {x: 522.6666870117188, y: 482}
        , {x: 520.6666870117188, y: 484}
        , {x: 518, y: 486}
        , {x: 516, y: 488}
        , {x: 514, y: 490.66668701171875}
        , {x: 512, y: 492.66668701171875}
        , {x: 511.3333740234375, y: 495.3333740234375}
        , {x: 510.66668701171875, y: 498.66668701171875}
        , {x: 510.66668701171875, y: 502}
        , {x: 511.3333740234375, y: 506}
        , {x: 512.6666870117188, y: 510}
        , {x: 514, y: 514}
        , {x: 516, y: 517.3333740234375}
        , {x: 518, y: 522}
        , {x: 519.3333740234375, y: 525.3333740234375}
        , {x: 520.6666870117188, y: 529.3333740234375}
        , {x: 520.6666870117188, y: 532.6666870117188}
        , {x: 521.3333740234375, y: 536}
        , {x: 520.6666870117188, y: 539.3333740234375}
        , {x: 519.3333740234375, y: 542}
        , {x: 518, y: 545.3333740234375}
        , {x: 515.3333740234375, y: 548.6666870117188}
        , {x: 513.3333740234375, y: 552}
        , {x: 511.3333740234375, y: 556}
        , {x: 510, y: 560.6666870117188}
        , {x: 509.3333740234375, y: 565.3333740234375}
        , {x: 509.3333740234375, y: 570}
        , {x: 510, y: 575.3333740234375}]
    }

  
    render() {
      return (
        <canvas id="drawingsample-canvas" 
        ref={this.canvRef} 
        height={this.getSize().y} 
        width={this.getSize().x}
        ></canvas>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    penstate: state.penstate
  }
}
  

export default connect(mapStateToProps)(Drawingsample)