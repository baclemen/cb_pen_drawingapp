import React, { Component } from 'react';
import { connect } from 'react-redux'



class Saturationslider extends Component {
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
      //console.log(this.props.penstate)
  }

  renderCanvas(){
    const ctx = this.canvRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.props.width, this.props.height);

    ctx.lineWidth = 1;
    //title
    ctx.font = "15px Tahoma";
    ctx.fillStyle = this.props.uicolor;
    if(this.props.title.length > 5){
        ctx.fillText(this.props.title.slice(0,5) + ".", 0, 30)
    }
    else{
        ctx.fillText(this.props.title, 0, 30);
    }

    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    }
    img.height = 40;
    img.width = 40;

    //sliderline
    ctx.beginPath()
    var grad = ctx.createLinearGradient(50, 0, 320, 0);

    var hsl = this.hexToHSL(this.props.penstate.color);

    grad.addColorStop(0, this.HSLToHex(hsl.h, 0 , hsl.l));     //
    grad.addColorStop(1, this.HSLToHex(hsl.h, 100, hsl.l));   //

    ctx.fillStyle = grad;
    // show the whole gradient
    ctx.fillRect(50, 23, 270, 4);
    // OP's square
    ctx.strokeRect(100, 100, 100, 100);

    ctx.stroke();

    ctx.strokeStyle = this.props.uicolor;
    ctx.beginPath()

    //slider
    ctx.lineWidth = 3;
    ctx.moveTo( 50 + this.props.penstate[this.props.title]*270, 10);
    ctx.lineTo( 50 + this.props.penstate[this.props.title]*270, 40);
    ctx.stroke();


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



  render() {
    return (

          <canvas id={this.props.title} ref={this.canvRef} className="slider" height={this.props.height} width={this.props.width*.8 + 3}/>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
        penstate: state.penstate,
        displaytraces: state.displaytraces
    }
  }
  
  export default connect(mapStateToProps)(Saturationslider);
  