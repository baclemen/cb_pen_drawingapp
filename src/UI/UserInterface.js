import React, { Component } from 'react';
import InteractionLayer from './InteractionLayer';
import Penslider from './Penslider';
import Saturationslider from './Saturationslider';
import Checkbox from './Checkbox';
import Colorpicker from './Colorpicker';
import { connect } from 'react-redux';

class UserInterface extends Component {

    state = {
        height: 0,
        width: 0,
        colorpos: {x:0,y:0},
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
          width,
        })

        //setTitleCanvas
        const ctx = this.divRef.current.firstChild.nextSibling.getContext('2d');

        const delx = -20;
        const dely = 0;
        ctx.fillStyle = "#1C1C1C"
        ctx.fillRect(delx + 40, dely + 10,40,40)
        ctx.lineJoin = "round"
        ctx.beginPath();
        ctx.strokeStyle = this.props.uicolor
        ctx.rect(delx + 40, dely + 10, 40, 40);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(delx + 45, dely + 35);
        ctx.lineTo(delx + 45, dely + 45);
        ctx.lineTo(delx + 55, dely + 45);
        ctx.lineTo(delx + 75, dely + 25);
        ctx.lineTo(delx + 65, dely + 15);
        ctx.lineTo(delx + 45, dely + 35);
        ctx.moveTo(delx + 60, dely + 20);
        ctx.lineTo(delx + 70, dely + 30)
        ctx.stroke();

        ctx.font = "20px Tahoma";
        ctx.fillStyle = this.props.uicolor;
        ctx.fillText("Settings Penstroke", delx + 90, dely + 38);
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
        var p1 = {x: 50 + slider.offsetLeft, y: slider.offsetTop + slider.parentElement.offsetTop + 25};
        var p2 = {x: slider.offsetLeft + slider.width, y: slider.offsetTop + slider.parentElement.offsetTop + 25};


        if(this.intersects(traceels[0], traceels[1], p1, p2)){
          var val = ((traceels[0].x + traceels[1].x) / 2 - 50 - slider.offsetLeft) / (slider.width - 50);
          var id = slider.id;
          var record = {}
          if(sliders[i].id === 'saturation'){
            var hsl = this.hexToHSL(this.props.penstate.color);
            var hex = this.HSLToHex(hsl.h, 100*val, hsl.l);
            record['color'] = hex;
            record[id] = val;
            this.props.setPenstate(record);
            return record;
          }
          else{
            record[id] = val;
            this.props.setPenstate(record);
            return record;
          }
        }
      }

      const checkboxes = this.divRef.current.querySelector("#checkboxdiv").childNodes

      for(i = 0; i < checkboxes.length; i++){
        var checkbox = checkboxes[i];
        p1 = {x: checkbox.offsetLeft + checkbox.parentElement.offsetLeft + 110, y: checkbox.offsetTop + checkbox.parentElement.offsetTop + 10};
        p2 = {x: checkbox.offsetLeft + checkbox.parentElement.offsetLeft + 130, y: checkbox.offsetTop + checkbox.parentElement.offsetTop + 30};

        if(!this.inBox(traceels[0], p1, p2) && this.inBox(traceels[1], p1, p2)){
          this.props.setCheckbox(checkbox.id)
          var val = !this.props.penstate[checkbox.id];
          var id = checkbox.id;
          var record = {
            [id]: val
          };
          return record;
        }

        const colorpicker = this.divRef.current.querySelector("#colorpickerel")
        p1 = {x: colorpicker.offsetLeft, y: colorpicker.offsetTop};
        p2 = {x: colorpicker.offsetLeft + colorpicker.width, y: colorpicker.offsetTop + colorpicker.height};

        if(this.inBox(traceels[1],p1,p2)){
          const ctx = colorpicker.getContext('2d');
          var colorpos = {x:traceels[1].x - colorpicker.offsetLeft, y: traceels[1].y - colorpicker.offsetTop};
          var color = ctx.getImageData(colorpos.x, colorpos.y, 1, 1).data; 
          var val = "#" + ("000000" +this.rgbToHex(color[0], color[1], color[2])).slice(-6);
          this.props.setPenstate({color: val})
          return {color: val}
        }


        //
        //this.props.setColor()


      }

      return null;

    }

    inBox(val, p1, p2){
      return val.x > p1.x && val.y > p1.y && val.x < p2.x && val.y < p2.y;
    }

    rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255)
          throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
    }

    hexToHSL(H) {
      // Convert hex to RGB first
      let r = 0, g = 0, b = 0;
      if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
      } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
      }
      // Then to HSL
      r /= 255;
      g /= 255;
      b /= 255;
      let cmin = Math.min(r,g,b),
          cmax = Math.max(r,g,b),
          delta = cmax - cmin,
          h = 0,
          s = 0,
          l = 0;
    
      if (delta == 0)
        h = 0;
      else if (cmax == r)
        h = ((g - b) / delta) % 6;
      else if (cmax == g)
        h = (b - r) / delta + 2;
      else
        h = (r - g) / delta + 4;
    
      h = Math.round(h * 60);
    
      if (h < 0)
        h += 360;
    
      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);
    
      return {h,s,l};
    }

    HSLToHex(h,s,l) {
      s /= 100;
      l /= 100;
    
      let c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs((h / 60) % 2 - 1)),
          m = l - c/2,
          r = 0,
          g = 0,
          b = 0;
    
      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }
      // Having obtained RGB, convert channels to hex
      r = Math.round((r + m) * 255).toString(16);
      g = Math.round((g + m) * 255).toString(16);
      b = Math.round((b + m) * 255).toString(16);
    
      // Prepend 0s, if necessary
      if (r.length == 1)
        r = "0" + r;
      if (g.length == 1)
        g = "0" + g;
      if (b.length == 1)
        b = "0" + b;
    
      return "#" + r + g + b;
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
              <InteractionLayer getSize={this.getSize.bind(this)} interpretTraceEl={this.interpretTraceEl.bind(this)} uicolor={this.props.uicolor} />

              <canvas id="uititle" height="60px" width="400px"></canvas>

              <svg height="3" width="400" className="uiline">
                <line x1="0" y1="2" x2="400" y2="2" stroke="black" />
              </svg> 
              
              <div id="checkboxdiv">
                <Checkbox title={"linedash"} className="pencheckbox" width={this.state.width*.5} height={40} uicolor={this.props.uicolor}/>
                <Checkbox title={"fill"} className="pencheckbox" width={this.state.width*.5} height={40} uicolor={this.props.uicolor}/>
                <Checkbox title={"end"} className="pencheckbox" width={this.state.width*.5} height={40} uicolor={this.props.uicolor}/>
                <Checkbox title={"shadow"} className="pencheckbox" width={this.state.width*.5} height={40} uicolor={this.props.uicolor}/>
                <Checkbox title={"line"} className="pencheckbox" width={this.state.width*.5} height={40} uicolor={this.props.uicolor}/>
              </div>

              <svg height="3" width="400" className="uiline">
                <line x1="0" y1="2" x2="400" y2="2" stroke="black" />
              </svg> 

              <div id="sliderdiv">
                <Penslider title={"alpha"} className="penslider" width={this.state.width} height={50} uicolor={this.props.uicolor}/>
                <Penslider title={"point"} className="penslider" width={this.state.width} height={50} uicolor={this.props.uicolor}/>
                <Saturationslider title={"saturation"} className="penslider" width={this.state.width} height={50} uicolor={this.props.uicolor}/>
              </div>

              <svg height="3" width="400" className="uiline">
                <line x1="0" y1="2" x2="400" y2="2" stroke="black" />
              </svg> 

              <Colorpicker title={"colorpicker"} colorpos={this.state.colorpos} width={320} height={200} uicolor={this.props.uicolor}/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    penstate: state.penstate,
    uicolor: state.uicolor
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCheckbox: (type) => { dispatch({type: "CHECK", id: type}) },
    setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInterface);