import React, { Component } from 'react';
import { connect } from 'react-redux'


const fontSpecs = {
    fontFamily: undefined,
    color: 'white',
    fontSize: 15,
  }

class Colorpicker extends Component{
    

  
    constructor(props){
        super(props);
        this.canvRef = React.createRef();
    }

    componentDidMount(){
        const ctx = this.canvRef.current.parentElement.parentElement.firstChild.getContext('2d');
        ctx.lineWidth = 1;
        //title
        ctx.font = "15px Tahoma";
        ctx.fillStyle = this.props.uicolor;
        ctx.fillText(this.props.title, 0, 30);
        console.log(ctx)
        this.renderCanvas();
    }

    componentDidUpdate(){
        this.renderCanvas();
    }
  
    renderCanvas(){
      const ctx = this.canvRef.current.getContext('2d');
      ctx.clearRect(0, 0, this.props.width, this.props.height);
      var imgData = ctx.createImageData(this.props.width, this.props.height);
      var s = this.props.penstate.saturation;
      for (var i = 0; i < this.props.width; i += 1) {
        for (var j = 0; j < this.props.height; j += 1) {
            var pos = j * this.props.width * 4 + i * 4;
    
            var h = i / this.props.width;
            var l = j / this.props.height;

    
            var rgb = this.hslToRgb(h, s, l);

    
            imgData.data[pos + 0] = rgb[0];
            imgData.data[pos + 1] = rgb[1];
            imgData.data[pos + 2] = rgb[2];
            imgData.data[pos + 3] = 255;
        }
      }
    
        ctx.putImageData(imgData, 0, 0);
    }

    hslToRgb(h, s, l) {
        var r, g, b;
    
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
    
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    render(){

        return(
            <div id="colorpickerwithtitle">
                <canvas id="colorpickertitle" height="40px" width="300px" />
                <div id={this.props.title}>
                    <canvas id={this.props.title + "el"} ref={this.canvRef} height={this.props.height} width={this.props.width}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        penstate: state.penstate
    }
}

const mapDispatchToProps = dispatch => {
    return {
      setColor: (color) => { dispatch({type: "SET_COLOR"}) },
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(Colorpicker)