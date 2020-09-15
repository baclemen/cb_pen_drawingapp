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
          {(this.state.History === 0 || this.state.History === '0') && 
          <button id="buttonUndo" onClick={this.props.undo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" version="1.1" x="0px" y="0px"><title>undo</title><desc>Created with Sketch.</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-5.000000, -5.000000)" fill="white"><path d="M6.68026306,11 L10.5,15.3357608 L9.8637811,16 L5,10.5 L9.86412375,5 L10.4994224,5.61683991 L6.67592819,10 L16.5,10 C20.0898509,10 23,12.9101491 23,16.5 C23,20.0898509 20.0898509,23 16.5,23 L10,23 L10,22 L16.5,22 C19.5375661,22 22,19.5375661 22,16.5 C22,13.4624339 19.5375661,11 16.5,11 L6.68026306,11 Z"/></g></g><text x="0" y="33" fill="#000000" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by xwoodhillx</text><text x="0" y="38" fill="#000000" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text></svg>
          </button>}
          {(this.state.History === 0 || this.state.History === '0') && 
          <button id="buttonRedo" onClick={this.props.redo}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{transform: "scale(-1,1)"}} viewBox="0 0 18 18" version="1.1" x="0px" y="0px"><title>undo</title><desc>Created with Sketch.</desc><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-5.000000, -5.000000)" fill="white"><path d="M6.68026306,11 L10.5,15.3357608 L9.8637811,16 L5,10.5 L9.86412375,5 L10.4994224,5.61683991 L6.67592819,10 L16.5,10 C20.0898509,10 23,12.9101491 23,16.5 C23,20.0898509 20.0898509,23 16.5,23 L10,23 L10,22 L16.5,22 C19.5375661,22 22,19.5375661 22,16.5 C22,13.4624339 19.5375661,11 16.5,11 L6.68026306,11 Z"/></g></g><text x="0" y="33" fill="#000000" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by xwoodhillx</text><text x="0" y="38" fill="#000000" font-size="5px" font-weight="bold" font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text></svg>
          </button>}
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
