import React, { Component } from 'react';
import { connect } from 'react-redux';

class Button extends Component {


  constructor(props) {
        super(props);
        this.state = {
          historybox: false,
        };
    
        this.handleInputChange = this.handleInputChange.bind(this);
  }
    
  handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'historybox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value    });
  }
 

  render() {
    return (
        <div id="historybox">
            <form>
                <label>
                showHistory
                    <input
                        name="historybox" type="checkbox"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange} 
                    />
                </label>
            </form>
        </div>
    );
  }
}

export default Button;
 