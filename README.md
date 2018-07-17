# Quantum Job Simulator

This is a really quick/dirty, full-javascript implementation of a simple quantum jobs queue system. Users submit jobs (currently only names) which are queued up, and then pulled off to be simulated, which can take anywhere from 500 milliseconds to 15 seconds. Only one
program is simulated at a time. Users may also pause submission of jobs to the queue if they like, and view the status of past jobs.

### Setup

Both frontend and backend are written in node (react and hapi, respectively). To run either application, navigate to either `frontend` or `backend`, run `npm install`, and then run `npm start` to start the server.

### Testing

Currently, only backend tests are implemented. Since Hapi's testing suite (Lab) currently doesn't appear to support ES6 natively, the tests require a server to be running at `localhost:8000` (the default for the backend) to function properly. This was due to the fact that ES6 code couldn't be very-easily run from the tests, so the tests currently test that the server endpoints function as they should.

To run the backend tests, navigate to `backend` and run `npm test`.