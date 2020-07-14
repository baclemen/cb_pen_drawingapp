import React, { Component } from 'react';
import InteractionLayer from './InteractionLayer';
import Penslider from './Penslider';
import Drawingsample from './Drawingsample';
import { connect } from 'react-redux';

class UserInterface extends Component {

    state = {
        height: 0,
        width: 0
      }

    componentDidMount(){
        var height = document.getElementById('ui-container').clientHeight;
        var width = document.getElementById('ui-container').clientWidth;
        this.setState({
          height,
          width
        })
    
        console.log(height,width)
    }
    componentDidUpdate(){
        
    }
    
    getSize(){
      return {x: this.state.width, y: this.state.height}
    }

    interpretTraceEl(traceels){
      if(traceels.length <2){
        return null
      }
      if(traceels[0].x>40 && traceels[0].x<360){
        if(this.intersects(traceels[0], traceels[1], {x:40, y:275}, {x:360, y:275})){

          let alpha = (traceels[0].x-40)/320
          this.props.setAlpha(alpha)
          return{'alpha': alpha}
        }
        else if (this.intersects(traceels[0], traceels[1], {x:40, y:375}, {x:360, y:375})) {
          let point = (traceels[0].x-40)/320
          this.props.setPoint(point)
          return{'point': point}
        } 
        else {
          return false
        }

      }
      else{
      return null;
      }

    }

    setSlider(name, value){

    }

    intersects(p1, p2, p3, p4) {
      var a = p1.x;
      var b = p1.y;
      var c = p2.x;
      var d = p2.y;
      var p = p3.x;
      var q = p3.y;
      var r = p4.x;
      var s = p4.y;
  
      var det, gamma, lambda;
      det = (c - a) * (s - q) - (r - p) * (d - b);
      if (det === 0) {
        return false;
      } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
      }
    };

    render(){
        return(
            <div id="ui-container">
              <InteractionLayer getSize={this.getSize.bind(this)} interpretTraceEl={this.interpretTraceEl.bind(this)} />
              <Drawingsample />
              <div id="sliderdiv">
                <Penslider title={"alpha"} width={this.state.width} height={100}/>
                <Penslider title={"point"} width={this.state.width} height={100}/>
              </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPoint: (val) => { dispatch({type: 'SET_POINT', point: val})},
    setAlpha: (val) => { dispatch({type: 'SET_ALPHA', alpha: val})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInterface);