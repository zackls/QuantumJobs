import Hapi from 'hapi';
import Job, { serializeJob } from './models/job';
import Boom from 'boom';

const Database = {
    jobs: [],
    nextId: 1,
    runningJobs: false,
    paused: false,
};

let runningJobs = false;

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/jobs',
    handler: (request, h) => {
        return Database.jobs.map(serializeJob);
    }
});
server.route({
    method: 'POST',
    path: '/jobs',
    handler: (request, h) => {
        if (Database.paused) {
            return Boom.methodNotAllowed('Cannot add another job, queue is paused.')
        } else {
            const job = new Job(
                Database.nextId,
                request.payload.title,
            );
            Database.jobs.push(job);
            Database.nextId += 1;

            if (!runningJobs) {
                runningJobs = true;
                const completion = () => {
                    const nextJob = Database.jobs.find(j => !j.finished);
                    if (nextJob) {
                        nextJob.run(completion);
                    } else {
                        runningJobs = false;
                    }
                };
                job.run(completion);
            }

            return serializeJob(job);
        }
    }
});
server.route({
    method: 'DELETE',
    path: '/jobs/{id}',
    handler: (request, h) => {
        const job = Database.jobs.find(j => j.id == request.params.id);
        if (job) {
            Database.jobs = Database.jobs.filter(j => j.id !== job.id);
            return { status: 'ok' };
        }
        return Boom.notFound();
    }
});

server.route({
    method: 'POST',
    path: '/pause',
    handler: (request, h) => {
        Database.paused = request.payload.pause;
    }
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();