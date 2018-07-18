import React, { Component } from 'react';
import JobsList from './JobsList';
import Header from '../components/Header';
import { Col } from 'react-bootstrap';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <Header></Header>
        </div>
        <div className='main-columns'>
          <Col xsOffset={2} xs={8}>
            <JobsList></JobsList>
          </Col>
        </div>
      </div>
    );
  }
}

export default App;
