import React, { Component } from 'react';
import { connect } from 'react-redux';
import Topruler from './Topruler';
import Sideruler from './Sideruler';
import Drawingsample from './Drawingsample';


class Canvas extends Component {

    state = {
        pointertrace: [],
        pendown: false,

        //for image placement
        placementtime: null,
        transformtrace: [],
        transform: [1,0,0,1,0,0],
        moveref: null
      }

    componentDidMount(){
        var height = document.getElementById('drawing-canvas').clientHeight;
        var width = document.getElementById('drawing-canvas').clientWidth;
        var containerheight = document.getElementById('drawing-canvas-container').clientHeight;
        var containerwidth = document.getElementById('drawing-canvas-container').clientWidth;
        this.setState({
          height,
          width,
          containerheight,
          containerwidth,
        })
    
    }
    componentDidUpdate(){

      console.log(this.state.imageplacement)

      const ctx = this.canvRef.current.firstChild.firstChild.getContext('2d');
      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
      var penstate = this.props.initpenstate;

      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);
      
      //TODO try move to pendown
      if(this.state.imageplacement){
        penstate = {
            color: '#000000',
            alpha: 1,
            point: .05,
            linedash: false,
        }
      }else{

        for(var i = 0; i < this.props.traces.length; i++){
            if(this.props.traces[i].type === 'ui'){
              penstate = {...penstate, ...this.props.traces[i].changes}
            }
        }
      }

      if(this.state.pendown){
        //draw current trace
        ctx.strokeStyle = this.getColor(penstate);
        ctx.lineWidth = this.getPoint(penstate);
        if(penstate.linedash){
          ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
        }
        else{
          ctx.setLineDash([])
        }
        
        if (this.state.pointertrace.length > 1){
          ctx.beginPath();
          ctx.moveTo(this.state.pointertrace[0].x, this.state.pointertrace[0].y);

          for (i = 1; i < this.state.pointertrace.length; i++){
                ctx.lineTo(this.state.pointertrace[i].x, this.state.pointertrace[i].y);
          }

          ctx.stroke()
        }
        //possible image transformation
        if (this.state.imageplacement){
          if(this.state.imageplacement){
            var temptransform = ""
            for(var i = 0; i < this.state.transformtrace.length; i++){
              temptransform = " " + this.getMatrixString(this.state.transformtrace[i]) + temptransform
            }
            this.canvRef.current.firstChild.lastChild.style.transform = this.getMatrixString(this.state.transform) + temptransform;
          }
        }
      }
      else{this.drawalltraces()}


      //draw current trace
      
    }
    
    getSize(){
        return {x: this.state.width, y: this.state.height}
      }

    constructor(props){
        super(props)
        this.canvRef = React.createRef();
    }

    dist(a,b){
      return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
    }

    pointerDownHandler(e) {
      const offsetTop = this.canvRef.current.firstChild.offsetTop + this.canvRef.current.parentElement.offsetTop;
      const offsetLeft = this.canvRef.current.firstChild.offsetLeft + this.canvRef.current.parentElement.offsetLeft;

      var p = {x: e.clientX - offsetLeft, y: e.clientY - offsetTop}

      if(this.state.imageplacement){
        const div = this.canvRef.current.firstChild.lastChild;
        const rect = this.canvRef.current.firstChild.lastChild.getBoundingClientRect();

        this.setState({
          rect
        })

        if(this.dist(p,{x: rect.left - offsetLeft + rect.width, y: rect.top - offsetTop + rect.height}) < div.firstChild.nextSibling.getBoundingClientRect().width / 2){
          console.log("br")
          this.setState({
            imageplacement: 'br',
          })
        }
        else if(this.dist(p,{x: rect.left - offsetLeft + rect.width/2, y: rect.top - offsetTop + rect.height/2}) < div.firstChild.nextSibling.getBoundingClientRect().width / 2){
          console.log("middle");
          this.setState({
            imageplacement: 'mid',
            moveref: {x: rect.left - offsetLeft + rect.width/2, y: rect.top - offsetTop + rect.height/2},
          })
        }

      }
      

      this.setState({
        pendown: true,
        pointertrace: [p]
      })

      const ctx = this.canvRef.current.firstChild.firstChild.getContext('2d');

      ctx.strokeStyle = this.getColor(this.props.initpenstate);
      ctx.lineWidth = this.getPoint(this.props.initpenstate);
      var penstate =this.props.initpenstate;

      for(var i = 0; i < this.props.traces.length; i++){
        if(this.props.traces[i].type === 'ui'){
          penstate = {...penstate, ...this.props.traces[i].changes}
          ctx.strokeStyle = this.getColor(penstate);
          ctx.lineWidth = this.getPoint(penstate);
        }
      }
    }
  
    pointerUpHandler(e) {

      if(this.state.imageplacement){
        if(this.state.imageplacement === 'init'){
          //console.log("setfalse")
          //this.setState({ imageplacement: false })
          //TODO PLACE IMAGE ON CANVAS
        }
        else{
          this.setState({ 
            imageplacement: 'init',
            transformtrace: [...this.state.transformtrace, this.state.transform],
            transform: [1,0,0,1,0,0],
          })
        }
      }
      else{
        const ctx = this.canvRef.current.firstChild.firstChild.getContext('2d');
        ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
        this.props.addTrace(this.state.pointertrace)
      }
      this.setState({
        pendown: false,
        pointertrace: []
      })
    }

    drawalltraces(){

      const ctx = this.canvRef.current.firstChild.firstChild.nextSibling.getContext('2d');
      //const ctx = this.canvRef.getElementsByTagName('canvas')[1].getContext('2d');

      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);

      let penstate = this.props.initpenstate;

      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);
      if(penstate.linedash){
        ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
      }
      else{
        ctx.setLineDash([])
      }

      for(var i = 0; i < this.props.traces.length; i++){
          if(this.props.traces[i].type === 'ui'){
            penstate = {...penstate, ...this.props.traces[i].changes}
            ctx.strokeStyle = this.getColor(penstate);
            ctx.lineWidth = this.getPoint(penstate);
            if(penstate.linedash){
              ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
            }
            else{
              ctx.setLineDash([])
            }
            continue
          } else if (this.props.traces[i].type === 'image'){
            ctx.drawImage(this.props.traces[i].imgData,0,0);
            continue;
          }

          ctx.beginPath();
          ctx.moveTo(this.props.traces[i].trace[0].x, this.props.traces[i].trace[0].y);

          for (var j = 1; j < this.props.traces[i].trace.length; j++){
              ctx.lineTo(this.props.traces[i].trace[j].x, this.props.traces[i].trace[j].y);
          }
          ctx.stroke()
      }
    }
  
    pointerMoveHandler(e) {
      if (this.state.pendown) {

        const offsetTop = this.canvRef.current.firstChild.offsetTop + this.canvRef.current.parentElement.offsetTop;
        const offsetLeft = this.canvRef.current.firstChild.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
        this.setState({
          pointertrace: [...this.state.pointertrace, {x: e.clientX - offsetLeft, y: e.clientY - offsetTop}]
        })


        if(this.state.imageplacement === 'init'){
          this.pointerDownHandler(e);
        }
        else if(this.state.imageplacement === 'mid'){
          this.setState({
            transform: [1,0,0,1,e.clientX - offsetLeft - this.state.moveref.x, e.clientY - offsetTop - this.state.moveref.y],
          })
        }
        else if(this.state.imageplacement === 'br'){
          const div = this.canvRef.current.firstChild.lastChild;
          const rect = this.state.rect;
          console.log(rect)
          var factor1 = (e.clientX - rect.x)/ rect.width;
          var factor2 = (e.clientY - rect.y)/ rect.height;
          var t1 = (1-factor1) * (rect.x - offsetLeft)
          var t2 = (1-factor2) * (rect.y - offsetTop)
          this.setState({
            transform: [factor1,0,0,factor2, t1,t2] //(-1 + factor1) * rect.width / 2, (-1 + factor2) * rect.height / 2
          })
        }
      }

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

    getMatrixString(matrix){
      return 'matrix(' + matrix[0] + ',' + matrix[1] + ',' + matrix[2] + ',' + matrix[3] + ',' + matrix[4] + ',' + matrix[5] + ')';
    }

    addImage(e){

      var file = e.target.files[0]
      const reader = new FileReader()
      var img = new Image()
      var addthis = this

      reader.addEventListener("load", function () {
        // convert image file to base64 string
        img.src = reader.result;
        addthis.placeImage(img);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }

    placeImage(img){

      this.setState({
        imageplacement: 'init'
      })


      const parent = this.canvRef.current.firstChild;

      var div = document.createElement('div')
      var div2 = document.createElement('div')
      // var top = (this.state.containerheight - 600 - 20)/2 + 20;
      // var left = (this.state.containerwidth - 600 - 20)/2 + 20;

      div.style.position = 'absolute'
      // div.style.top = top + 'px';
      // div.style.left = left + 'px';
      div.style.zIndex = 19
      div.style.transformOrigin = "top left"

      div2.appendChild(img)
      div.appendChild(div2);


      const resizersize = 50

      const resize1 = document.createElement('div');
      const resize2 = document.createElement('div');
      const resize3 = document.createElement('div');
      const resize4 = document.createElement('div');
      const resize5 = document.createElement('div');

      resize1.style.position = "absolute"
      resize1.className = "resizeEl"
      resize1.style.borderRadius = "50%"
      resize1.style.height = resizersize + "px"
      resize1.style.width = resizersize + "px"
      resize1.style.background = "cyan"
      resize1.style.opacity = "40%"
      
      

      var cssForAll = resize1.style.cssText;

      resize1.style.top = -.5*resizersize + "px"
      resize1.style.left = -.5*resizersize + "px"

      resize2.style.cssText = cssForAll
      resize2.style.top = -.5*resizersize + "px"
      resize2.style.right = -.5*resizersize + "px"

      resize3.style.cssText = cssForAll
      resize3.style.bottom = -.5*resizersize  + 4 + "px"
      resize3.style.right = -.5*resizersize + "px"

      resize4.style.cssText = cssForAll;
      resize4.style.bottom = -.5*resizersize + 4 + "px";
      resize4.style.left = -.5*resizersize + "px";

      resize5.style.cssText = cssForAll;
      resize5.style.top = "calc(50% - "+ .5 * resizersize + "px)";
      resize5.style.left = "calc(50% - "+ .5 * resizersize + "px)";


      div.appendChild(resize1);
      div.appendChild(resize2);
      div.appendChild(resize3);
      div.appendChild(resize4);
      div.appendChild(resize5);

      parent.appendChild(div);

      console.log(div)

      

    }

    render(){
        return(
          <div 
          id="canvasInteractionDiv" 
          ref={this.canvRef} 
          onGotPointerCapture={this.pointerDownHandler.bind(this)} 
          onLostPointerCapture={this.pointerUpHandler.bind(this)} 
          onPointerMove={this.pointerMoveHandler.bind(this)} 
          >
              <div id="innerCanvasContainer">
                <canvas id="drawing-canvas" 
                height={this.getSize().y} 
                width={this.getSize().x} 
                />

                <canvas id="drawing-canvas2" 
                height={this.getSize().y} 
                width={this.getSize().x} 
                />
              </div>

              <Topruler/>
              <Sideruler/>
              <Drawingsample />

              <input type="file" id="fileupload" name="file" onChange={this.addImage.bind(this)}/>
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
      traces: state.traces,
      initpenstate: state.initpenstate,
      t:state.t
    }
}

const mapDispatchToProps = dispatch => {
    return {
      addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
      addImage: (image) => { dispatch({type: 'ADD_IMAGE', imgData: image}) },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);