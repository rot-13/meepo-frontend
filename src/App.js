import React, { Component } from 'react';
import './App.css';
import Fetching from './Fetching';
import List from './List';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: true
    }
  }

  render() {
    return (
      <div>
        {this.state.fetching ? <Fetching/> : <List/>}
      </div>
    );
  }
}

export default App;
