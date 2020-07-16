import React, { Component } from 'react';
import { connect } from 'react-redux'

class Button extends Component {
  state={
    numOfEls: 5
  }

  constructor(props) {
        super(props);
    
        this.handleInputChange = this.handleInputChange.bind(this);
  }
    
  handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'historybox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value    });
        
  }

  componentDidUpdate(){
    var penstate =this.props.initpenstate;

    for(var i = 0; i < this.props.traces.length; i++){
      if(this.props.traces[i].isUI){
        penstate = {...penstate, ...this.props.traces[i].changes}
      }
    }
    if(penstate){
      this.props.setPenstate(penstate)
    }
    else{
      this.props.setInit()
    }

    this.props.clrDisplaytrace();
    if(this.state["historybox"]){
      var uitracelist = this.getUItraceList()
      for(var i = 0; i < uitracelist.length; i++){
        this.props.addDisplaytrace(uitracelist[i].t, (6-uitracelist.length)*.2 + .2*i);
      }
    }
    else{

    }
  }
  
  getUItraceList(){
    return this.props.traces.filter(el => el.isUI).slice(-this.state.numOfEls-1)
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

const mapStateToProps = (state, ownProps) => {
  return {
    traces: state.traces,
    initpenstate: state.initpenstate,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTrace: (pointertrace) => { dispatch({type: 'ADD_DRAWTRACE', trace: pointertrace}) },
    addDisplaytrace: (t,alpha) => { dispatch({type: 'ADD_DISPLAYTRACE', t: t, alpha: alpha}) },
    clrDisplaytrace: () => { dispatch({type: 'CLR_DISPLAYTRACE'}) },
    setPenstate: (val) => { dispatch({type: 'SET_PENSTATE', update:val}) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Button);