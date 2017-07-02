import React, { Component } from 'react';
import './Fetching.css';

class Fetching extends Component {
  render() {
    return (
      <div className="fetching-container">
        <h1 className="fetching-title no-margin">Meepo?</h1>
        <div className="fetching-logo"/>
        <span role="img" className="fetching-mag" aria-label="basta">🔍</span>
      </div>
    );
  }
}

export default Fetching;
