'use strict';

const Job = require('./models/Job');
const Hapi = require('hapi');
const Database = {
    jobs: []
};

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/jobs',
    handler: (request, h) => {
        return Database.jobs;
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