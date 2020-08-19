import React, { Component } from 'react';
import UserInterface from './UI/UserInterface'
import Canvas from './canvas/Canvas'
import Historybar from './history/Historybar'
import Historyselector from './history/Historyselector'
import Button from './history/Button'
import Topbar from './Topbar'
import { connect } from 'react-redux';

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

  componentDidMount(){
    var props = this.props;
    document.addEventListener('keydown', this.keyDownHandler.bind(this))
  }

  keyDownHandler(event){
    if (event.ctrlKey && event.key === 'z') {
      this.props.undo()
    }
    else if (event.ctrlKey && event.key === 'y') {
      this.props.redo()
    }
  }

  render() {
    return (
      <div id='appcontainer'>
        <Topbar/>
        {this.state.History === '2' &&
          <div id="button">
            <Button />
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
            <Canvas history={this.state.History}/>
          </div>
        </div>
      </div>

    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    undo: () => { dispatch({type: 'UNDO' }) },
    redo: () => { dispatch({type: 'REDO' }) },
  }
}

export default connect(null, mapDispatchToProps)(App);
