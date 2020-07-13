import React, { Component } from 'react';
import UserInterface from './UI/UserInterface'
import Canvas from './Canvas'
import Historybar from './Historybar'
import Historyselector from './Historyselector'

class App extends Component {
  state = {
    showHistorybar: false
  }

  setHistorybar(val){
    this.setState({
      showHistorybar: val
    })
  }

  render() {

    return (
      <div id='appcontainer'>
        {this.state.showHistorybar &&
          <div id="historybar">
            <Historybar/>
          </div>
        }
        <div id="topcontainer">
          <Historyselector setHistorybar={this.setHistorybar.bind(this)}/>
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
