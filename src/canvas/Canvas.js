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
        transform: {type: 'mid', x:0, y:0},
        moveref: null
      }

    constructor(props){
      super(props)
      this.canvRef = React.createRef();
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

        //draw imageupload container
        const ctx = this.canvRef.current.lastChild.firstChild.getContext('2d');
        ctx.fillStyle = "#333333"
        ctx.fillRect(0, 0, 100, 100);
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.props.uicolor;
        ctx.setLineDash([6]);
        ctx.strokeRect(0, 0, 100, 100);
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle"; 
        ctx.fillStyle = this.props.uicolor;
        ctx.font = "15px Tahoma";
        const fillText = "upload image"
        ctx.fillText(fillText, 50, 45); 
        ctx.font = "7px Tahoma";
        const fillText2 = "click or drag your image here"
        ctx.fillText(fillText2, 50, 60); 
    
    }
    componentDidUpdate(){

      const ctx = this.canvRef.current.firstChild.firstChild.getContext('2d');
      var t = this.props.t + this.props.deltaT;



      //check if imageplacement
      var imageplacement = false;

      var indexT
      for(indexT = this.props.traces.length - 1; indexT > 0; --indexT){
        if(this.props.traces[indexT].t > t){
        }
        else{
          break;
        }
      }
      var indexImg;
      for(indexImg = indexT; indexImg > 0; indexImg--){
        if(this.props.traces[indexImg].type === 'image'){
          imageplacement = true;
          break;
        }
        else if (this.props.traces[indexImg].type === 'draw'){
          break;
        }
        else if (this.props.traces[indexImg].transform && this.props.traces[indexImg].transform.type === 'place'){
          break;
        }
      }

      var img
      if(imageplacement){
        img = this.props.traces[indexImg].imgData
      }

      //checkspiral
      if(!this.state.spiralMode && this.props.history === '3' && this.state.pointertrace.length > 0){
        const spiralRef = this.state.pointertrace[0]
        var spiralCounter = 0;
        for(var i = 3; i < this.state.pointertrace.length - 1; i++){
          if(this.dist(this.state.pointertrace[i], spiralRef) < 20){
            if(this.dist(this.state.pointertrace[i-1], spiralRef) > this.dist(this.state.pointertrace[i], spiralRef) && this.dist(this.state.pointertrace[i], spiralRef) < this.dist(this.state.pointertrace[i+1], spiralRef)){
              spiralCounter++
            }
          }
        }
        if (spiralCounter > 2){
          this.setState({
            pointertrace: [],
            spiralMode: true,
            deltaT: this.props.deltaT
          })
        }
      }

      ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
      var penstate = this.props.penstate;

      ctx.strokeStyle = this.getColor(penstate);
      ctx.lineWidth = this.getPoint(penstate);

      if(this.state.spiralMode){
        penstate = {
          color: '#000000',
          alpha: 1,
          point: .05,
          linedash: false,
        }
      }
      
      //TODO try move to pendown
      if(imageplacement){
        penstate = {
            color: '#000000',
            alpha: 1,
            point: .05,
            linedash: false,
        }

        //possible image transformation
          var refX = 0;
          var refY = 0;
          var refWidth = this.state.imgwidth;
          var refHeight = this.state.imgheight;

          //var temptransform = "";
          var i = indexImg;

          var shadowpenstate = this.props.initpenstate;

          for(var ind; ind <= i; ind++){
            if(this.props.traces[ind].changes){
              shadowpenstate = [...shadowpenstate, this.props.traces[ind].changes]
            }
          }

          var color = shadowpenstate.color;
          var shadow = shadowpenstate.shadow

          // for(i = this.props.traces.length - 1; i >= 0; i--){
          //   if(this.props.traces[i].type === 'image'){
          //     break
          //   }
            
          //   else if (this.props.traces[i].type === 'imgtrace'){
          //     if(this.props.traces[i].transform.type === 'place'){
          //       i= -2;
          //       break
          //     }
          //   }
          // }
          for(i++; 0 < i && i < this.props.traces.length; i++){
            if(this.props.traces[i].t > t){
              break;
            }
            if(!this.props.traces[i].transform){
              if(this.props.traces[i].changes.shadow){
                ctx.shadowColor = color;
                ctx.shadowOffsetX = 20;
                ctx.shadowOffsetY = 20;
                ctx.shadowBlur = 10;
              }
              else if(this.props.traces[i].changes.shadow === false){
                ctx.shadowColor = "transparent"
              }
              if(this.props.traces[i].changes.color){
                color = this.props.traces[i].changes.color;
                ctx.shadowColor = color;
              }
              //TODO add UItraces
              continue
            }
            switch(this.props.traces[i].transform.type){
              case('mid'):
                //temptransform = this.getMatrixString([1,0,0,1,this.props.traces[i].transform.x, this.props.traces[i].transform.y]) + ' ' + temptransform;
                refX += this.props.traces[i].transform.x;
                refY += this.props.traces[i].transform.y;
                break;
              case('tl'):
                //temptransform = this.getMatrixString([this.props.traces[i].transform.f1, 0,0, this.props.traces[i].transform.f2, (1-this.props.traces[i].transform.f1) * (refWidth + refX), (1-this.props.traces[i].transform.f2) * (refHeight + refY)]) + ' ' + temptransform;
                refX += (1-this.props.traces[i].transform.f1) * (refWidth)
                refY += (1-this.props.traces[i].transform.f2) * (refHeight)
                refWidth *= this.props.traces[i].transform.f1;
                refHeight *= this.props.traces[i].transform.f2;
                break;
              case('tr'):
                //temptransform = this.getMatrixString([this.props.traces[i].transform.f1, 0,0, this.props.traces[i].transform.f2, (1-this.props.traces[i].transform.f1) * (refX), (1-this.props.traces[i].transform.f2) * (refHeight + refY)]) + ' ' + temptransform;
                refY += (1-this.props.traces[i].transform.f2) * (refHeight);
                refWidth *= this.props.traces[i].transform.f1;
                refHeight *= this.props.traces[i].transform.f2;
                break;
              case('bl'):
                //temptransform = this.getMatrixString([this.props.traces[i].transform.f1, 0,0, this.props.traces[i].transform.f2, (1-this.props.traces[i].transform.f1) * (refWidth + refX), (1-this.props.traces[i].transform.f2) * (refY)]) + ' ' + temptransform;
                refX += (1-this.props.traces[i].transform.f1) * (refWidth)
                refWidth *= this.props.traces[i].transform.f1;
                refHeight *= this.props.traces[i].transform.f2;
                break;
              case('br'):
                //temptransform = this.getMatrixString([this.props.traces[i].transform.f1, 0,0, this.props.traces[i].transform.f2, (1-this.props.traces[i].transform.f1) * refX, (1-this.props.traces[i].transform.f2) * refY]) + ' ' + temptransform;
                refWidth *= this.props.traces[i].transform.f1;
                refHeight *= this.props.traces[i].transform.f2;
                break;
            }

            // const ctx = this.canvRef.current.firstChild.firstChild.getContext('2d');
            // ctx.beginPath()
            // ctx.moveTo(refX+refWidth,refY)
            // ctx.lineTo(refX,refY);
            // ctx.lineTo(refX, refY + refHeight);
            // ctx.stroke()
          }

          switch(this.state.transform.type){
            case('mid'):
              //temptransform = this.getMatrixString([1,0,0,1,this.state.transform.x,this.state.transform.y]) + ' ' + temptransform;
              refX += this.state.transform.x;
              refY += this.state.transform.y;
              break;
            case('tl'):
              //temptransform = this.getMatrixString([this.state.transform.f1, 0,0, this.state.transform.f2, (1-this.state.transform.f1) * (refWidth + refX), (1-this.state.transform.f2) * (refHeight + refY)]) + ' ' + temptransform;
              refX += (1-this.state.transform.f1) * (refWidth);
              refY += (1-this.state.transform.f2) * (refHeight);
              refWidth *= this.state.transform.f1;
              refHeight *= this.state.transform.f2;
              break
            case('tr'):
              //temptransform = this.getMatrixString([this.state.transform.f1, 0,0, this.state.transform.f2, (1-this.state.transform.f1) * (refX), (1-this.state.transform.f2) * (refHeight + refY)]) + ' ' + temptransform;
              refY += (1-this.state.transform.f2) * (refHeight);
              refWidth *= this.state.transform.f1;
              refHeight *= this.state.transform.f2;
              break;
            case('bl'):
              //temptransform = this.getMatrixString([this.state.transform.f1, 0,0, this.state.transform.f2, (1-this.state.transform.f1) * (refWidth + refX), (1-this.state.transform.f2) * (refY)]) + ' ' + temptransform;
              refX += (1-this.state.transform.f1) * (refWidth)
              refWidth *= this.state.transform.f1;
              refHeight *= this.state.transform.f2;
              break;
            case('br'):
              //temptransform = this.getMatrixString([this.state.transform.f1, 0,0, this.state.transform.f2, (1-this.state.transform.f1) * refX, (1-this.state.transform.f2) * refY]) + ' ' + temptransform;
              refWidth *= this.state.transform.f1;
              refHeight *= this.state.transform.f2;
              break;
          }
          //from old version of imageplacement
          // if(this.state.imageplacement){
          //   this.canvRef.current.firstChild.lastChild.style.transform = temptransform;
          // }
          ctx.drawImage(img, refX, refY, refWidth, refHeight);
          this.displayHandlers(refX, refY, refWidth, refHeight);
      }else{
        this.hideHandlers();
      }

      if(this.state.pendown){
        if(this.state.spiralMode){
          this.drawalltraces();
        }
        //draw current trace
        ctx.strokeStyle = this.getColor(penstate);
        ctx.lineWidth = this.getPoint(penstate);

        if(penstate.linedash){
          ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
        }
        else{
          ctx.setLineDash([])
        }
        
        if(penstate.end){
          ctx.lineCap = "round"
        }
        else {
          ctx.lineCap = "butt"
        }

        if(penstate.shadow){
          ctx.shadowColor = this.getColor(penstate);
          ctx.shadowOffsetX = 20;
          ctx.shadowOffsetY = 20;
          ctx.shadowBlur = 10;
        }
        else{
          ctx.shadowColor = "transparent"
        }
        
        if (this.state.pointertrace.length > 1){
          ctx.beginPath();
          ctx.moveTo(this.state.pointertrace[0].x, this.state.pointertrace[0].y);

          if(penstate.line){
            ctx.lineTo(this.state.pointertrace[this.state.pointertrace.length-1].x, this.state.pointertrace[this.state.pointertrace.length-1].y)
          }
          else{
            for (i = 1; i < this.state.pointertrace.length; i++){
                  ctx.lineTo(this.state.pointertrace[i].x, this.state.pointertrace[i].y);
            }
          }

          if(penstate.fill){
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill()
          }
          else{
            ctx.stroke()
          }
        }
        
      }
      else{
        this.drawalltraces()
      }
      this.displaytraces()


      //draw current trace
      
    }

    displayHandlers(refX, refY, refWidth, refHeight){
      //topleft
      var el = document.getElementById("resizehandleTL");
      el.style.display = "block";
      el.style.top = refY - 25 + "px";
      el.style.left = refX - 25 + "px";
      //topleft
      el = document.getElementById("resizehandleTR");
      el.style.display = "block";
      el.style.top = refY - 25 + "px";
      el.style.left = refWidth + refX - 25 + "px";
      //topleft
      el = document.getElementById("resizehandleBL");
      el.style.display = "block";
      el.style.top = refY + refHeight - 25 + "px";
      el.style.left = refX - 25 + "px";
      //topleft
      el = document.getElementById("resizehandleBR");
      el.style.display = "block";
      el.style.top = refY + refHeight - 25 + "px";
      el.style.left = refX + refWidth - 25 + "px";
      //topleft
      el = document.getElementById("resizehandleMID");
      el.style.display = "block";
      el.style.top = refY + refHeight/2 - 25 + "px";
      el.style.left = refX + refWidth/2 - 25 + "px";
    }

    hideHandlers(){
      var el = document.getElementById("resizehandleTL");
      el.style.display = "none";
      var el = document.getElementById("resizehandleTR");
      el.style.display = "none";
      var el = document.getElementById("resizehandleBL");
      el.style.display = "none";
      var el = document.getElementById("resizehandleBR");
      el.style.display = "none";
      var el = document.getElementById("resizehandleMID");
      el.style.display = "none";
    }
    
    getSize(){
        return {x: this.state.width, y: this.state.height}
      }

    dist(a,b){
      return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), .5);
    }

    diff(a,b){
      return {x: a.x - b.x, y: a.y - b.y};
    }

    angle(p1,p2,mid){
      var vecA = this.diff(p1, mid);
      var vecB = this.diff(p2, mid);
      var valA = this.dist(p1,mid);
      var valB = this.dist(p2,mid);
      var sign = vecA.x * vecB.y - vecA.y * vecB.x > 0 ? -1:1;
      return sign * Math.acos((vecA.x * vecB.x + vecA.y * vecB.y) / (valA * valB))
    }

    pointerDownHandler(e) {

      const offsetTop = this.canvRef.current.firstChild.offsetTop + this.canvRef.current.parentElement.offsetTop;
      const offsetLeft = this.canvRef.current.firstChild.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
      var p = {x: e.clientX - offsetLeft, y: e.clientY - offsetTop};

      //check if imageplacement
      var imageplacement = false;
      var t = this.props.t + this.props.deltaT;

      var indexT
      for(indexT = this.props.traces.length - 1; indexT > 0; --indexT){
        if(this.props.traces[indexT].t > t){
        }
        else{
          break;
        }
      }
      var indexImg;
      for(indexImg = indexT; indexImg > 0; indexImg--){
        if(this.props.traces[indexImg].type === 'image'){
          imageplacement = true;
          break;
        }
        else if (this.props.traces[indexImg].type === 'draw'){
          break;
        }
        else if (this.props.traces[indexImg].transform && this.props.traces[indexImg].transform.type === 'place'){
          break;
        }
      }

      if(imageplacement){
        const div = this.canvRef.current.firstChild.lastChild;
        //const rect = this.canvRef.current.firstChild.lastChild.getBoundingClientRect();

        var tl = document.getElementById("resizehandleTL").getBoundingClientRect();
        var tr = document.getElementById("resizehandleTR").getBoundingClientRect();
        var bl = document.getElementById("resizehandleBL").getBoundingClientRect();
        var br = document.getElementById("resizehandleBR").getBoundingClientRect();
        var mid = document.getElementById("resizehandleMID").getBoundingClientRect();

        const rect = {x: (tl.left + tl.right) / 2, y: (tl.top + tl.bottom) / 2, width: br.left - tl.left, height: br.top - tl.top}


        this.setState({
          rect
        })

        if(this.dist(p,{x: tl.left + .5 * tl.width - offsetLeft, y: tl.top + .5 * tl.width - offsetTop}) < tl.width / 2){
          //console.log("tl")
          this.setState({
            imageplacement: 'tl',
          })
        }
        else if(this.dist(p,{x: tr.left + .5 * tr.width - offsetLeft, y: tr.top + .5 * tr.width - offsetTop}) < tr.width / 2){
          //console.log("tr")
          this.setState({
            imageplacement: 'tr',
          })
        }
        else if(this.dist(p,{x: bl.left + .5 * bl.width - offsetLeft, y: bl.top + .5 * bl.width - offsetTop}) < bl.width / 2){
          //console.log("bl")
          this.setState({
            imageplacement: 'bl',
          })
        }
        else if(this.dist(p,{x: br.left + .5 * br.width - offsetLeft, y: br.top + .5 * br.width - offsetTop}) < br.width / 2){
          //console.log("br")
          this.setState({
            imageplacement: 'br',
          })
        }
        else if(this.dist(p,{x: mid.left + .5 * mid.width - offsetLeft, y: mid.top + .5 * mid.width - offsetTop}) < mid.width / 2){
          //console.log("middle");
          this.setState({
            imageplacement: 'mid',
            moveref: {x: mid.left + .5 * mid.width - offsetLeft, y: mid.top + .5 * mid.width - offsetTop},
          })
        }
        else if(tl.right - offsetLeft < p.x && p.x < br.left - offsetLeft && tl.bottom - offsetTop < p.y && p.y < br.top - offsetTop){
          //console.log("place");
          this.setState({
            imageplacement: 'place',
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
      //delete displayed traces on canvas
      if(e.button===5 || e.button===2){
        this.setState({
          pendown: false,
          pointertrace: [],
          changes: {}
        })
        var deltrace = null;
        var dist = 5;
        for(var i = 0; i < this.props.displaytraces.length; i++){
          var temp = this.props.traces.find(el => el.t === this.props.displaytraces[i].t && el.type === "imgtrace");
          console.log(temp)
          if(temp){
            var trace = temp.trace;
          } else {
            continue;
          }
          var t = temp.t;
          for(var j = 0; j < trace.length; j++){
            var offsetX = this.canvRef.current.firstChild.getBoundingClientRect().x;
            var offsetY = this.canvRef.current.firstChild.getBoundingClientRect().y;
            var newdist = Math.pow(Math.pow((trace[j].x - e.clientX + offsetX),2) + Math.pow((trace[j].y - e.clientY + offsetY),2),.5)
            if(newdist < dist){
              deltrace = t;
              dist = newdist;
            }
          }
        }
        if(deltrace !== null){
          this.props.delTrace(deltrace)
        }
        return
      }



      if(this.state.spiralMode){
        this.setState({
          spiralMode: false
        })
      }
      else if(this.state.imageplacement){
        if(this.state.imageplacement === 'init'){
          //console.log("setfalse")
          //this.setState({ imageplacement: false })
          //TODO PLACE IMAGE ON CANVAS
        }
        else if(this.state.imageplacement === 'place'){
          this.props.addImageTrace(this.state.pointertrace, this.state.transform);
          this.setState({ 
            imageplacement: false,
            transform: {type: 'mid', x:0, y:0},

          })
        }
        else{
          this.props.addImageTrace(this.state.pointertrace, this.state.transform)
          this.setState({ 
            imageplacement: 'init',
            transform: {type: 'mid', x:0, y:0},
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

      if(penstate.end){
          ctx.lineCap = "round"
        }
        else {
          ctx.lineCap = "butt"
        }

        if(penstate.shadow){
          ctx.shadowColor = this.getColor(penstate);
          ctx.shadowOffsetX = 20;
          ctx.shadowOffsetY = 20;
          ctx.shadowBlur = 10;
        }
        else{
          ctx.shadowColor = "transparent"
        }

      //temporary image data
      var imgData;
      var dX = 0;
      var dY = 0;
      var dWidth;
      var dHeight;


      for(var i = 0; i < this.props.traces.length; i++){

          if(this.props.t + this.props.deltaT < this.props.traces[i].t){
            return
          }
          if(this.props.traces[i].type === 'image'){
            var current = true;
            for(var j=i; j < this.props.traces.length; j++){
              if(this.props.traces[j].type === 'imgtrace' || this.props.t + this.props.deltaT < this.props.traces[j].t){
                
              }
              else{
                current = false;
                break;
              }
            }
            if(current){
              return
            }else
            imgData = this.props.traces[i].imgData;
            dWidth = this.props.traces[i].width;
            dHeight = this.props.traces[i].height;
            dX = 0;
            dY = 0;
            continue
          }
          else if (this.props.traces[i].type === 'imgtrace') {
            if(this.props.traces[i].transform.type === 'place'){

              ctx.drawImage(imgData, dX, dY, dWidth, dHeight)
            }
            else {
              //ctx.restore();
              switch(this.props.traces[i].transform.type){
                case('mid'):
                  dX += this.props.traces[i].transform.x;
                  dY += this.props.traces[i].transform.y;
                  break;
                case('tl'):
                  dX += (1 - this.props.traces[i].transform.f1) * (dWidth)
                  dY += (1 - this.props.traces[i].transform.f2) * (dHeight)
                  dWidth *= this.props.traces[i].transform.f1;
                  dHeight *= this.props.traces[i].transform.f2;
                  break;
                case('tr'):
                  dY += (1-this.props.traces[i].transform.f2) * (dHeight);
                  dWidth *= this.props.traces[i].transform.f1;
                  dHeight *= this.props.traces[i].transform.f2;
                  break;
                case('bl'):
                  dX += (1-this.props.traces[i].transform.f1) * (dWidth)
                  dWidth *= this.props.traces[i].transform.f1;
                  dHeight *= this.props.traces[i].transform.f2;
                  break;
                case('br'):
                  dWidth *= this.props.traces[i].transform.f1;
                  dHeight *= this.props.traces[i].transform.f2;
                  break;
              }
            }
            continue
          }
          else if(this.props.traces[i].type === 'ui'){
            penstate = {...penstate, ...this.props.traces[i].changes}
            ctx.strokeStyle = this.getColor(penstate);
            ctx.lineWidth = this.getPoint(penstate);
            if(penstate.linedash){
              ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
            }
            else{
              ctx.setLineDash([])
            }
            if(penstate.end){
              ctx.lineCap = "round"
            }
            else {
              ctx.lineCap = "butt"
            }
    
            if(penstate.shadow){
              ctx.shadowColor = this.getColor(penstate)
              ctx.shadowOffsetX = 20;
              ctx.shadowOffsetY = 20;
              ctx.shadowBlur = 10;
            }
            else{
              ctx.shadowColor = "transparent"
            }
            continue
          }

          ctx.beginPath();
          ctx.moveTo(this.props.traces[i].trace[0].x, this.props.traces[i].trace[0].y);

          if(penstate.line){
            ctx.lineTo(this.props.traces[i].trace[this.props.traces[i].trace.length - 1].x, this.props.traces[i].trace[this.props.traces[i].trace.length - 1].y)
          }
          else{
            for (var j = 1; j < this.props.traces[i].trace.length; j++){
                ctx.lineTo(this.props.traces[i].trace[j].x, this.props.traces[i].trace[j].y);
            }
          }
          if(penstate.fill){
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
          }
          else{
            ctx.stroke()
          }
      }
    }
  
    pointerMoveHandler(e) {
      
      if(this.state.spiralMode && this.props.history === '3' && this.state.pointertrace.length > 3){
        const mid = this.state.pointertrace[0];
        var angle = 0;
        for(var i = 2; i < this.state.pointertrace.length; i++){
          
          var angleDiff = this.angle(this.state.pointertrace[i-1], this.state.pointertrace[i], mid);
          if(!isNaN(angleDiff)){
            angle += angleDiff;
          }
        }
        this.props.setDeltaT(this.state.deltaT-Math.floor(angle/Math.PI * 5));



        var t = this.props.t + this.state.deltaT - Math.floor(angle/Math.PI * 5);
        if(t !== this.state.spiralTempT){

          var penstate = this.props.initpenstate;
          for(var i = 1; i < this.props.traces.length; i++){
            if(this.props.traces[i].t > t){
              break
            }
            else if (this.props.traces[i].type === 'ui'){
              penstate = {...penstate, ...this.props.traces[i].changes}
            }
          }
          this.props.setPenstate(penstate)

          this.setState({spiralTempT : t});
        }

        
      }


      if (this.state.pendown) {

        const offsetTop = this.canvRef.current.firstChild.offsetTop + this.canvRef.current.parentElement.offsetTop;
        const offsetLeft = this.canvRef.current.firstChild.offsetLeft + this.canvRef.current.parentElement.offsetLeft;
        this.setState({
          pointertrace: [...this.state.pointertrace, {x: e.clientX - offsetLeft, y: e.clientY - offsetTop}]
        })

        var tl = document.getElementById("resizehandleTL").getBoundingClientRect();
        var br = document.getElementById("resizehandleBR").getBoundingClientRect();
        var mid = document.getElementById("resizehandleMID").getBoundingClientRect();
        const rect = this.state.rect
        var f1,f2;
        switch(this.state.imageplacement){
          case('init'):
            this.pointerDownHandler(e);
            break;
          case('mid'):
            this.setState({
              transform: {type:'mid', x:e.clientX - offsetLeft - this.state.moveref.x, y:e.clientY - offsetTop - this.state.moveref.y},
            })
            break;
          case('tl'):
            f1 = Math.max(0,1 - ((e.clientX - rect.x)/ rect.width));
            f2 = Math.max(0,1 - ((e.clientY - rect.y)/ rect.height));
            this.setState({
              transform: {f1, f2, type:'tl'} 
            })
            break;
          case('tr'):
            f1 = Math.max(0,((e.clientX - rect.x)/ rect.width));
            f2 = Math.max(0,1 - ((e.clientY - rect.y)/ rect.height));
            this.setState({
              transform: {f1, f2, type:'tr'} 
            })
            break;
          case('bl'):
            f1 = Math.max(0,1 - ((e.clientX - rect.x)/ rect.width));
            f2 = Math.max(0,((e.clientY - rect.y)/ rect.height));
            this.setState({
              transform: {f1, f2, type:'bl'} 
            })
            break;
          case('br'):
            f1 = Math.max(0,(e.clientX - rect.x)/ rect.width);
            f2 = Math.max(0,(e.clientY - rect.y)/ rect.height);
            this.setState({
              transform: {f1, f2, type:'br'} //(-1 + factor1) * rect.width / 2, (-1 + factor2) * rect.height / 2
            })
            break;
          case('place'):
            this.setState({
              transform: {type: 'place'}
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
      
      //TODO fix
      if(this.state.imageplacement){
        alert("Cannot upload file during imageplacement")
        return
      }
      if(!file){
        return
      }
      if(file.type.slice(0,5) !== "image"){
        alert("file is not an image")
        return
      }
      const reader = new FileReader()
      //var img = new Image()
      var img = document.createElement('img');
      img.src = e.target.files[0]
      var addthis = this

      var onload1 = false;
      var onload2 = false;
      var w,h;

      img.src = e.target.files[0];

      reader.addEventListener("load", async function () {
      // convert image file to base64 string

        img.src = reader.result;
        onload2 = true;

        img.addEventListener('load', async function() {
          w = img.width;
          h = img.height;
          addthis.placeImage(img,w,h);
        });

        }, false);

        if (file) {
          reader.readAsDataURL(file);
      }

    }

    placeImage(img, w, h){

      this.setState({
        imageplacement: 'init'
      })


      this.setState({
        imgheight: h,
        imgwidth: w,
      })
      this.props.addImage(img, h, w)

      //transform: {f1, f2, type:'tl'} 

      //const parent = this.canvRef.current.firstChild;

      // var div = document.createElement('div')
      // var div2 = document.createElement('div')
      // // var top = (this.state.containerheight - 600 - 20)/2 + 20;
      // // var left = (this.state.containerwidth - 600 - 20)/2 + 20;

      // div.style.position = 'absolute'
      // // div.style.top = top + 'px';
      // // div.style.left = left + 'px';
      // div.style.zIndex = 19;
      // div.style.transformOrigin = "top left"

      // div2.appendChild(img);
      // div.appendChild(div2);

      // const resizersize = 50

      // const resize1 = document.createElement('div');
      // const resize2 = document.createElement('div');
      // const resize3 = document.createElement('div');
      // const resize4 = document.createElement('div');
      // const resize5 = document.createElement('div');
      // const resize6 = document.createElement('div');

      // resize1.style.position = "absolute"
      // resize1.className = "resizeEl"
      // resize1.style.borderRadius = "50%"
      // resize1.style.height = resizersize + "px"
      // resize1.style.width = resizersize + "px"
      // resize1.style.background = "cyan"
      // resize1.style.opacity = "40%"
      
      

      // var cssForAll = resize1.style.cssText;

      // resize1.style.top = -.5*resizersize + "px"
      // resize1.style.left = -.5*resizersize + "px"

      // resize2.style.cssText = cssForAll
      // resize2.style.top = -.5*resizersize + "px"
      // resize2.style.right = -.5*resizersize + "px"

      // resize3.style.cssText = cssForAll
      // resize3.style.bottom = -.5*resizersize  + 4 + "px"
      // resize3.style.right = -.5*resizersize + "px"

      // resize4.style.cssText = cssForAll;
      // resize4.style.bottom = -.5*resizersize + 4 + "px";
      // resize4.style.left = -.5*resizersize + "px";

      // resize5.style.cssText = cssForAll;
      // resize5.style.top = "calc(50% - "+ .5 * resizersize + "px)";
      // resize5.style.left = "calc(50% - "+ .5 * resizersize + "px)";

      // resize6.style.cssText = cssForAll;
      // resize6.style.top = "calc(50% - "+ .5 * resizersize + "px)";
      // resize6.style.left = "calc(75% - "+ .5 * resizersize + "px)";


      //div.appendChild(resize1);
      //div.appendChild(resize2);
      //div.appendChild(resize3);
      //div.appendChild(resize4);
      //div.appendChild(resize5);
      //div.appendChild(resize6);

      

      //parent.appendChild(div);


    }

    displaytraces(){
      const ctx = this.canvRef.current.firstChild.firstChild.getContext('2d');
      //ctx.clearRect(0, 0, this.getSize().x, this.getSize().y);
      for(var i = 0; i < this.props.displaytraces.length; i++){
        var tmp = this.props.traces.find(el => el.t === this.props.displaytraces[i].t && el.type === "imgtrace")
        if(tmp){
          this.drawtrace(ctx, tmp.trace, this.props.displaytraces[i].alpha);
        }
      }
    }

    drawtrace(ctx, trace, alpha){
      ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trace[0].x, trace[0].y);
  
      for(var i = 1; i < trace.length; i++){
        ctx.lineTo(trace[i].x,trace[i].y);
      }
      ctx.stroke();
    }

    render(){
        return(
          <div 
          id="canvasInteractionDiv" 
          ref={this.canvRef} 
          onPointerDown={this.pointerDownHandler.bind(this)} 
          onPointerUp={this.pointerUpHandler.bind(this)} 
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
                <div id = "resizehandleTL" className="resizeHandle"></div>
                <div id = "resizehandleTR" className="resizeHandle"></div>
                <div id = "resizehandleBL" className="resizeHandle"></div>
                <div id = "resizehandleBR" className="resizeHandle"></div>
                <div id = "resizehandleMID" className="resizeHandle"></div>
              </div>

              <Topruler/>
              <Sideruler/>
              <Drawingsample />



              <input type="file" id="fileupload" name="file" onChange={this.addImage.bind(this)}/>
              <label for="fileupload">
                <canvas height="100" width="100"></canvas>
              </label>
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
      traces: state.traces,
      displaytraces: state.displaytraces,
      initpenstate: state.initpenstate,
      penstate: state.penstate,
      t:state.t,
      uicolor: state.uicolor,
      deltaT: state.deltaT
    }
}

const mapDispatchToProps = dispatch => {
    return {
      addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
      addImage: (image, height, width) => { dispatch({type: 'ADD_IMAGE', imgData: image, height, width}) },
      addImageTrace: (imagetrace, transform) => { dispatch ({ type : 'ADD_IMAGETRACE', trace: imagetrace, transform: transform }) },
      setDeltaT: (deltaT) => { dispatch ({ type: 'DELTA_T', deltaT}) },
      setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
      delTrace: (t) => { dispatch({type: 'DEL_UITRACE', t: t}) },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);