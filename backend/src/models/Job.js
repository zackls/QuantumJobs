export default class {
    constructor(id, title, submissionTime) {
        this.id = id;
        this.title = title;

        this.submissionTime = new Date().valueOf();
        this.finished = false;
        this.executionTime = Math.random() * 14500 + 500;
    }

    run(completion) {
        setTimeout(() => {
            this.finished = true;
            completion();
        }, this.executionTime);
    }
}

export function serializeJob(job) {
    return {
        id: job.id,
        title: job.title,
        finished: job.finished,
        submissionTime: job.submissionTime
    }
};
