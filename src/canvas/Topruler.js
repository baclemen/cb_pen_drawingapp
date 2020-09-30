import React, { Component } from 'react';

class Topruler extends Component {
    state = {
        width: 0
    }

    constructor(props){
        super(props)
        this.barRef = React.createRef();
    }

    componentDidUpdate(){
        const svgel = this.barRef.current
        if(svgel.width.animVal.value - this.state.width > 1){
            this.setState({
                width: svgel.width.animVal.value,
            })
            this.drawRuler()
        }
    }

    drawRuler(){

        const svgel = this.barRef.current
        const width = svgel.width.animVal.value;
        const height = svgel.height.animVal.value;
        const canvwidth = document.getElementById('drawing-canvas').width;

        const elstart = (width - canvwidth + height)/2;


        while(svgel.firstChild){
            svgel.removeChild(svgel.firstChild);
        }

        for(var i = -Math.floor(elstart/5)*5 + 25; i < canvwidth + elstart; i= i + 5){
            var newElement, p1,p2
            if(Math.abs(i) % 100 < 1){
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                p1 = "M " + (i + Math.floor(elstart)) + " " + 12
                p2 = "L " + (i + Math.floor(elstart)) + " " + 20
                newElement.setAttribute("d", p1 + " " + p2); //Set path's data
                newElement.style.stroke = "#C6C6C6"; //Set stroke colour
                newElement.style.strokeWidth = "1px"; //Set stroke width
                svgel.appendChild(newElement);

                var newText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                newText.setAttributeNS(null,"x",i + Math.floor(elstart));     
                newText.setAttributeNS(null,"y",10); 
                newText.setAttributeNS(null,"text-anchor", "middle"); 
                newText.setAttributeNS(null,"font-size","9");
                newText.style.stroke = "#C6C6C6";
                newText.innerHTML = i
                svgel.appendChild(newText);



            } 
            else if(Math.abs(i) % 20 < 1){
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                p1 = "M " + (i + Math.floor(elstart)) + " " + 16
                p2 = "L " + (i + Math.floor(elstart)) + " " + 20
                newElement.setAttribute("d", p1 + " " + p2); //Set path's data
                newElement.style.stroke = "#C6C6C6"; //Set stroke colour
                newElement.style.strokeWidth = "1px"; //Set stroke width
                svgel.appendChild(newElement);
            }
            else{
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                p1 = "M " + (i + Math.floor(elstart)) + " " + 18
                p2 = "L " + (i + Math.floor(elstart)) + " " + 20
                newElement.setAttribute("d", p1 + " " + p2); //Set path's data
                newElement.style.stroke = "#C6C6C6"; //Set stroke colour
                newElement.style.strokeWidth = "1px"; //Set stroke width
                svgel.appendChild(newElement);
            }

        }

    }

    render(){

        return(
          <svg ref={this.barRef} className="ruler" height="20" width="100%"></svg>
        )
    }
}

export default Topruler;