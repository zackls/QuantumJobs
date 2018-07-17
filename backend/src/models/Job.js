export default class {
    constructor(id, title) {
        this.id = id;
        this.title = title;

        // initialize some variables
        this.submissionTime = new Date().valueOf();
        this.finished = false;
        // random between 0.5s and 15s
        this.executionTime = Math.random() * 14500 + 500;
    }

    run(completion = undefined) {
        // simply set finished to true after a certain amount of time
        setTimeout(() => {
            this.finished = true;
            if (completion) {
                completion();
            }
        }, this.executionTime);
    }
}

export function serializeJob(job) {
    // determines what should be exposed to the frontend
    return {
        id: job.id,
        title: job.title,
        finished: job.finished,
        submissionTime: job.submissionTime
    }
};
