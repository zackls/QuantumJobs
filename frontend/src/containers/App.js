import React, { Component } from 'react';
import JobsPage from './JobsPage';
import Header from '../components/Header';
import { Col } from 'react-bootstrap';

import './App.css';

// main component of the application

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <Header></Header>
        </div>
        <div className='main-columns'>
          <Col xsOffset={2} xs={8}>
            <JobsPage></JobsPage>
          </Col>
        </div>
      </div>
    );
  }
}

export default App;
