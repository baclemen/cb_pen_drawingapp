import React, { Component } from 'react';
import UserInterface from './UI/UserInterface'
import Canvas from './Canvas'

class App extends Component {

  render() {
    return (
    <div id='appcontainer'>
      <UserInterface/>
      <div id="drawing-canvas-container">
        <Canvas/>
      </div>
    </div>

    );
  }
}

export default App;
