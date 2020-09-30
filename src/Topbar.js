import React, { Component } from 'react';
import {ReactComponent as TimestrokeLogo} from './svg/Timestroke.svg'


const fontSpecs = {
    fontFamily: undefined,
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
  }

class Topbar extends Component{


    render(){
        return(
            <div id="topbar">
                <TimestrokeLogo id="logo"/>
                <p id="title" style={fontSpecs}>Timestroke Drawing Application</p>
            </div>
        )
    }
}

export default Topbar;