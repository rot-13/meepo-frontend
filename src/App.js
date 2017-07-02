import React, { Component } from 'react';
import './App.css';
import Fetching from './Fetching';
import List from './List';

const DATA_SOURCE = 'http://meepo-api.herokuapp.com/summary'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: true
    }
  }

  componentWillMount() {
    fetch(DATA_SOURCE)
    .then(res => res.json())
    .then(({ entries, devices }) => {
      setTimeout((() => this.setState({ fetching: false, entries, devices })), 1000)
    })
  }

  render() {
    return (
      <div>
        {this.state.fetching ? <Fetching/> : <List entries={this.state.entries} devices={this.state.devices} />}
      </div>
    );
  }
}

export default App;
