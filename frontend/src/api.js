import axios from 'axios';

const base = 'http://localhost:8000';

export const getJobs = () => {
    return axios.get(base + '/jobs').then(r => r.data);
}
export const createJob = (title) => {
    return axios.post(base + '/jobs', {title: title}).then(r => r.data);
}
export const deleteJob = (id) => {
    return axios.delete(base + '/jobs/' + id).then(r => r.data);
}

export const isPaused = () => {
    return axios.get(base + '/pause').then(r => r.data.paused);
}
export const pauseSubmission = (pause = true) => {
    return axios.post(base + '/pause', {pause: pause}).then(r => r.data.paused);
}

