import React, { Component } from 'react';
import InteractionLayer from './InteractionLayer';
import Penslider from './Penslider';
import Checkbox from './Checkbox';
import Drawingsample from './Drawingsample';
import { connect } from 'react-redux';

class UserInterface extends Component {

    state = {
        height: 0,
        width: 0
      }

    constructor(props){
      super(props);
      this.divRef = React.createRef();
    }

    componentDidMount(){
        var height = document.getElementById('ui-container').clientHeight;
        var width = document.getElementById('ui-container').clientWidth;
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

    interpretTraceEl(traceels){

      if(traceels.length <2){
        return null
      }

      const sliders = this.divRef.current.querySelector("#sliderdiv").childNodes

      for(var i = 0; i<sliders.length; i++){
        var slider = sliders[i]
        var p1 = {x: slider.offsetLeft, y: slider.offsetTop + slider.parentElement.offsetTop + 75};
        var p2 = {x: slider.offsetLeft + slider.width, y: slider.offsetTop + slider.parentElement.offsetTop + 75};


        if(this.intersects(traceels[0], traceels[1], p1, p2)){
          var val = (traceels[0].x-slider.offsetLeft)/slider.width;
          var id = slider.id;
          var record = {}
          record[id] = val;

          this.props.setPenstate(record);
          return record;
        }
      }

      const checkboxes = this.divRef.current.querySelector("#checkboxdiv").childNodes

      for(var i = 0; i < checkboxes.length; i++){
        var checkbox = checkboxes[i]
        p1 = {x: checkbox.offsetLeft + 40, y: checkbox.offsetTop + checkbox.parentElement.offsetTop + 30}
        p2 = {x: checkbox.offsetLeft + 60, y: checkbox.offsetTop + checkbox.parentElement.offsetTop + 50}

        if(!this.inBox(traceels[0], p1, p2) && this.inBox(traceels[1], p1, p2)){
          this.props.dottedCheckbox()
        }


      }

      return null;

    }

    inBox(val, p1, p2){
      return val.x > p1.x && val.y > p1.y && val.x < p2.x && val.y < p2.y;
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
            <div id="ui-container" ref={this.divRef}>
              <InteractionLayer getSize={this.getSize.bind(this)} interpretTraceEl={this.interpretTraceEl.bind(this)} />
              <Drawingsample />
              <div id="sliderdiv">
                <Penslider title={"alpha"} className="penslider" width={this.state.width} height={100}/>
                <Penslider title={"point"} className="penslider" width={this.state.width} height={100}/>
              </div>
              <div id="checkboxdiv">
                <Checkbox title={"linedash"} className="pencheckbox" width={this.state.width*.5} height={80}/>
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
    dottedCheckbox: () => { dispatch({type: "CHECK_DOTTED"}) },
    setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInterface);