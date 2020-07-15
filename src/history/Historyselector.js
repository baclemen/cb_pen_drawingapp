import React, { Component } from 'react';

class Historyselector extends Component {
  state = {
      selectedOption: '0'
  }

  constructor(props){
      super(props);
      this.setHistory = props.setHistory
  }

  
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
    this.setHistory(changeEvent.target.value)
  }
  
  

  render() {
    return (
      <form id="historyselector">
        <div className="radio">
          <label>
            <input type="radio" value="0" 
                          checked={this.state.selectedOption === '0'} 
                          onChange={this.handleOptionChange.bind(this)} />
            None
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="1" 
                          checked={this.state.selectedOption === '1'} 
                          onChange={this.handleOptionChange.bind(this)} />
            Bar
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="2" 
                          checked={this.state.selectedOption === '2'} 
                          onChange={this.handleOptionChange.bind(this)} />
            Button
          </label>
        </div>
      </form>
    );
  }
}

export default Historyselector;
