import React from 'react';
import moment from 'moment';
import { Col, Row, Button, Panel } from 'react-bootstrap';

import './JobsList.css';

export default ({jobs, onRemove}) => {
  return jobs.length === 0 ?
    <h4 className='center empty-message'>No jobs were found, try adding a new one!</h4>
    :
    <div>
      {
        jobs.map(j => (
          <Panel className='padded' key={j.id}>
            <Row>
              <Col md={6}>
                <h4>{j.title}</h4>
                Job #{j.id}<br/>
                Submitted {moment.utc(j.submissionTime).local().fromNow()}
              </Col>
              <Col md={6} className='right'>
                <div className='status-text'>
                  Status: {j.finished ? <span className='finished-text'>Finished</span> : 'Queued'}
                </div>
                <Button bsStyle='danger' onClick={() => onRemove(j)}>Remove</Button>
              </Col>
            </Row>
          </Panel>
        ))
      }
    </div>
};