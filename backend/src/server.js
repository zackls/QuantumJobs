import Hapi from 'hapi';
import Job, { serializeJob } from './models/job';
import Boom from 'boom';

// mock of a database, stores data locally
const Database = {
    jobs: [],
    nextId: 1,
    runningJobs: false,
};
// helper variable to store whether or not a job is currently being run
let runningJobs = false;
// helper variable to store the current queue state
let paused = false;

// initialize server
const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

/**
 * -- JOBS --
 */
server.route({
    method: 'GET',
    path: '/jobs',
    handler: (request, h) => {
        // return a serialized list of all jobs
        return Database.jobs.map(serializeJob);
    }
});
server.route({
    method: 'POST',
    path: '/jobs',
    handler: (request, h) => {
        if (paused) {
            // if the database is paused, throw a 405
            return Boom.methodNotAllowed('Cannot add another job, queue is paused.')
        } else {
            // read the payload and create a new job with the correct id
            const job = new Job(
                Database.nextId,
                request.payload.title,
            );
            Database.jobs.push(job);
            Database.nextId += 1;

            if (!runningJobs) {
                // if not already running jobs, kick that process off
                runningJobs = true;
                const completion = () => {
                    // check if a new job can be run once one finishes
                    const nextJob = Database.jobs.find(j => !j.finished);
                    if (nextJob) {
                        // run the new job
                        nextJob.run(completion);
                    } else {
                        // otherwise, complete running
                        runningJobs = false;
                    }
                };
                job.run(completion);
            }

            // return the new job
            return serializeJob(job);
        }
    }
});
server.route({
    method: 'DELETE',
    path: '/jobs/{id}',
    handler: (request, h) => {
        // find the job, throw a 404 if it doesnt exist
        const job = Database.jobs.find(j => j.id == request.params.id);
        if (job) {
            // remove the job
            Database.jobs = Database.jobs.filter(j => j.id !== job.id);
            return { status: 'ok' };
        }
        return Boom.notFound();
    }
});

/**
 * -- PAUSING --
 */
server.route({
    method: 'POST',
    path: '/pause',
    handler: (request, h) => {
        // simply read the request and pause if needed
        paused = request.payload.pause;
        return { status: 'ok' };
    }
});

// error handling, from Hapi docs
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// initialize the server
const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};
init();
