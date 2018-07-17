
const expect = require('expect');
const Lab = require('lab');
const request = require('request');

const lab = exports.lab = Lab.script();

const base = 'http://localhost:8000';

// http get request
const GET = async url => new Promise((resolve, reject) => {
    request.get(base + url, (_, response, body) => {
        if (response.error) {
            reject(response.error);
        }
        try {
            resolve(JSON.parse(body));
        } catch (e) {
            reject(e);
        }
    });
});

// http post request
const POST = async (url, data) => new Promise((resolve, reject) => {
    request.post(base + url, { json: data }, (_, response, body) => {
        if (response.error) {
            reject(response.error);
        }
        resolve(body);
    });
});

// http delete request
const DELETE = async (url, data) => new Promise((resolve, reject) => {
    request.delete(base + url, (_, response, body) => {
        if (response.error) {
            reject(response.error);
        }
        resolve(body);
    });
});

lab.test('tests job execution time', { timeout: 16000 }, async () => {
    let job = await POST('/jobs', {
        title: 'title'
    });
    expect(job.finished).toEqual(false);
    
    // wait 15 seconds synchronously... this can probably be made better by manually passing an execution time
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(undefined);
        }, 15000);
    });
    
    job = (await GET('/jobs')).find(j => j.id === job.id);
    expect(job.finished).toEqual(true);
});

lab.test('tests posting/getting/deleting jobs', async () => {
    let jobs = await GET('/jobs');
    const previousLength = jobs.length;

    const newJob = await POST('/jobs', {
        title: 'job title'
    });
    expect(newJob.title).toEqual('job title');
    expect(newJob.finished).toEqual(false);
    
    jobs = await GET('/jobs');
    expect(jobs.length).toEqual(previousLength + 1);
    expect(jobs[jobs.length - 1].title).toEqual(newJob.title);
    expect(jobs[jobs.length - 1].id).toEqual(newJob.id);
    expect(jobs[jobs.length - 1].finished).toEqual(false);

    await DELETE('/jobs/' + newJob.id);
    jobs = await GET('/jobs');
    expect(jobs.length).toEqual(previousLength);
});

lab.test('tests server pause', async () => {
    let job = await POST('/jobs', {
        title: 'title'
    });
    expect(job.title).toEqual('title');

    await POST('/pause', { pause: true });

    const notAllowed = await POST('/jobs', {
        title: 'title'
    });
    expect(notAllowed.statusCode).toEqual(405);
    
    await POST('/pause', { pause: false });
    job = await POST('/jobs', {
        title: 'title'
    });
    expect(job.title).toEqual('title');
});