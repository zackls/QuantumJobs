import React, { Component } from 'react';
import { Col, Row, Button, Modal } from 'react-bootstrap';
import { getJobs, createJob, deleteJob, isPaused, pauseSubmission } from '../api';
import axios from 'axios';
import ReactLoading from "react-loading";
import ModalContent from '../components/ModalContent';
import { Text, Form } from 'react-form';
import JobsList from '../components/JobsList';

import './JobsPage.css';

class JobsPage extends Component {
  constructor() {
    super();

    this.state = {
      jobs: undefined,
      paused: false,
      loading: true,

      showConfirmModal: false,
      showAddJobModal: false,
    };
  }

  componentWillMount() {
    axios.all([getJobs(), isPaused()]).then(axios.spread((jobs, paused) => {
      this.setState({
        jobs: jobs,
        paused: paused,
        loading: false
      });
    }));

    const poll = () => {
      setTimeout(() => {
        getJobs().then(jobs => {
          this.setState({ jobs: jobs });
          poll();
        });
      }, 1000);
    };
    poll();
  }

  render() {
    const { paused, jobs, loading, showConfirmModal, showAddJobModal } = this.state;
    return (
      <Col>
        <Modal show={showConfirmModal}>
          <ModalContent title='Pause Submission'
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
        <Modal show={showAddJobModal}>
          <ModalContent title='Add New Job'
            body={
              <Form onSubmit={values => {
                this.setState({ loading: true, showAddJobModal: false });
                createJob(values).then(job => {
                  jobs.push(job);
                  this.setState({
                    jobs: jobs,
                    loading: false
                  });
                });
              }}>
                {formApi => (
                  <form onSubmit={formApi.submitForm}>
                    <label htmlFor="title">Title</label><br/>
                    <Text field="title" id="title" validate={value => value ? null : 'Value cannot be empty'} />
                    <hr/>
                    <Button type="submit" bsStyle='primary'>
                      Submit
                    </Button>
                    <Button onClick={() => this.setState({showAddJobModal: false})}>
                      Cancel
                    </Button>
                  </form>
                )}
              </Form>
            }
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
            <Button bsStyle='primary' disabled={paused || loading} onClick={() => this.setState({ showAddJobModal: true })}>
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
            <JobsList jobs={jobs} onRemove={j => {
              this.setState({ loading: true });
              deleteJob(j.id).then(() => {
                this.setState({ loading: false, jobs: jobs.filter(job => job.id != j.id) });
              });
            }}></JobsList>
        }
      </Col>
    );
  }
}

export default JobsPage;