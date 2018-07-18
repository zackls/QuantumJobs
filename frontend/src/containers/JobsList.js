import React, { Component } from 'react';
import { Col, Row, Button, Panel, Modal } from 'react-bootstrap';
import { getJobs, deleteJob, isPaused, pauseSubmission } from '../api';
import axios from 'axios';
import ReactLoading from "react-loading";
import ModalContent from '../components/ModalContent';

import './JobsList.css';

class JobsList extends Component {
  constructor() {
    super();

    this.state = {
      jobs: undefined,
      paused: false,
      loading: true,

      showConfirmModal: false,
      showAddJobModal: false,
    }
  }

  componentWillMount() {
    axios.all([getJobs(), isPaused()]).then(axios.spread((jobs, paused) => {
      this.setState({
        jobs: jobs,
        paused: paused,
        loading: false
      });
    }));
  }

  render() {
    const { paused, jobs, loading, showConfirmModal, showAddJobModal } = this.state;
    return (
      <Col>
        <Modal show={showConfirmModal}>
          <ModalContent
            title='Pause Submission'
            body='Are you sure you want to pause submission of jobs? This means no more jobs may be submitted.'
            buttons={[
              { title: 'Confirm', bsStyle: 'primary', onClick: () => {
                this.setState({ loading: true, showConfirmModal: false });
                pauseSubmission().then(newPaused => {
                  this.setState({
                    paused: newPaused,
                    loading: false,
                  });
                });
              }},
              { title: 'Cancel', onClick: () => this.setState({showConfirmModal: false}) },
            ]}
          >
          </ModalContent>
        </Modal>
        <Row>
          <Col xs={6}>
            <h3>Jobs</h3>
          </Col>
          <Col xs={6} className='right'>
            <Button onClick={() => {
              if (paused) {
                this.setState({ loading: true });
                pauseSubmission(false).then(newPaused => {
                  this.setState({
                    paused: newPaused,
                    loading: false
                  });
                });
              } else {
                this.setState({ showConfirmModal: true });
              }
            }} disabled={loading}>
              { paused ? 'Unpause Submission' : 'Pause Submission' }
            </Button>
            <Button bsStyle='primary' disabled={paused || loading}>
              Add New Job
            </Button>
          </Col>
        </Row>
        { loading ?
          <Row className='center'>
            <div className='loading-wrapper'>
              <ReactLoading type='bubbles' color='#999' />
            </div>
          </Row>
          :
          null
        }
        {
          jobs === undefined ?
            null
            :
              jobs.length === 0 ?
                <h4 className='center empty-message'>No jobs were found, try adding a new one!</h4>
                :
                <div>
                  jobs.map(j => (
                    <Panel>j.id</Panel>
                  ))
                </div>
        }
      </Col>
    );
  }
}

export default JobsList;