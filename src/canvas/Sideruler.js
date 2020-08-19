import React, { Component } from 'react';

class Sideruler extends Component {
    state = {
        height: 0
    }

    constructor(props){
        super(props)
        this.barRef = React.createRef();
    }

    componentDidUpdate(){
        const svgel = this.barRef.current
        if(Math.abs(svgel.height.animVal.value - this.state.height) > 1){
            this.setState({
                height: svgel.height.animVal.value,
            })
            this.drawRuler()
        }
    }

    drawRuler(){

        const svgel = this.barRef.current
        const width = svgel.width.animVal.value;
        const height = svgel.height.animVal.value;
        const canvheight = document.getElementById('drawing-canvas').height;

        const elstart = (height - canvheight + width)/2;


        while(svgel.firstChild){
            svgel.removeChild(svgel.firstChild);
        }

        for(var i = -Math.floor(elstart/5)*5 + 25; i < canvheight + elstart; i= i + 5){
            var newElement, p1, p2
            if(Math.abs(i) % 100 < 1){
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                p1 = "M " + 12 + " " +(i + Math.floor(elstart));
                p2 = "L " + 20 + " " + (i + Math.floor(elstart));
                newElement.setAttribute("d", p1 + " " + p2); //Set path's data
                newElement.style.stroke = "#C6C6C6"; //Set stroke colour
                newElement.style.strokeWidth = "1px"; //Set stroke width
                svgel.appendChild(newElement);

                var newText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                newText.setAttributeNS(null,"y",i + Math.floor(elstart));     
                newText.setAttributeNS(null,"x",10); 
                newText.setAttributeNS(null,"text-anchor", "middle"); 
                newText.setAttributeNS(null,"font-size","9");
                newText.style.stroke = "#C6C6C6";
                newText.setAttributeNS(null,"transform","rotate(270,10,"+ (Math.floor(elstart) + i) +")");
                newText.innerHTML = i
                svgel.appendChild(newText);



            } 
            else if(Math.abs(i) % 20 < 1){
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                p1 = "M " + 16 + " " +(i + Math.floor(elstart));
                p2 = "L " + 20 + " " + (i + Math.floor(elstart));
                newElement.setAttribute("d", p1 + " " + p2); //Set path's data
                newElement.style.stroke = "#000"; //Set stroke colour
                newElement.style.strokeWidth = "1px"; //Set stroke width
                newElement.style.stroke = "#C6C6C6";
                svgel.appendChild(newElement);
            }
            else{
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                p1 = "M " + 18 + " " +(i + Math.floor(elstart));
                p2 = "L " + 20 + " " + (i + Math.floor(elstart));
                newElement.setAttribute("d", p1 + " " + p2); //Set path's data
                newElement.style.stroke = "#000"; //Set stroke colour
                newElement.style.strokeWidth = "1px"; //Set stroke width
                newElement.style.stroke = "#C6C6C6";
                svgel.appendChild(newElement);
            }

        }

    }

    render(){

        return(
          <svg ref={this.barRef} className="ruler" height="100%" width="20px"></svg>
        )
    }
}

export default Sideruler;