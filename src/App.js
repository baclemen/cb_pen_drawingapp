import React, { Component } from 'react';
import UserInterface from './UI/UserInterface'
import Canvas from './Canvas'
import Historybar from './history/Historybar'
import Historyselector from './history/Historyselector'
import Button from './history/Button'
import Historyoverlay from './history/Historyoverlay'

class App extends Component {
  state = {
    History: 0
  }

  setHistory(val){
    this.setState({
      History: val,
      Historyoverlay: false
    })
  }

  render() {

    return (
      <div id='appcontainer'>
        {this.state.History === '2' &&  this.state.Historyoverlay &&
          <Historyoverlay/>}
        {this.state.History === '2' &&
          <div id="button">
            <Button setHistoryoverlay={console.log("overlay")}/>
          </div>}
        {this.state.History === '1' &&
          <div id="historybar">
            <Historybar/>
          </div>
        }
        <div id="topcontainer">
          <Historyselector setHistory={this.setHistory.bind(this)}/>
          <UserInterface/>
          <div id="drawing-canvas-container">
            <Canvas />
          </div>
        </div>
      </div>

    );
  }
}

export default App;
