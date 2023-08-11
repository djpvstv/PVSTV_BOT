class AppState {
    #foundTags = [];
    #batchSize = 20;
    #frameLeniency = 45;
    #hitsPerPage = 100;
    #isoPath = '';
    #slippiPath = '';
    #postReplayFrames = 0;
    #preReplayFrames = 120;

    getFoundTags () {
        return this.#foundTags;
    }

    setFoundTags (val) {
        this.#foundTags = val;
    }

    getIsoPath () {
        return this.#isoPath;
    }

    setIsoPath (val) {
        this.#isoPath = val;
    }

    getSlippiPath () {
        return this.#slippiPath;
    }

    setSlippiPath (val) {
        this.#slippiPath = val;
    }

    getBatchSize () {
        return this.#batchSize;
    }

    setBatchSize (val) {
        this.#batchSize = val;
    }

    getFrameLeniency () {
        return this.#frameLeniency;
    }

    setFrameLeniency (val) {
        this.#frameLeniency = val;
    }

    getHitsPerPage () {
        return this.#hitsPerPage;
    }

    setHitsPerPage (val) {
        this.#hitsPerPage = val;
    }

    getPreReplayFrames () {
        return this.#preReplayFrames;
    }

    setPreReplayFrames (val) {
        this.#preReplayFrames = val;
    }

    getPostReplayFrames () {
        return this.#postReplayFrames;
    }
    
    setPostReplayFrames (val) {
        this.#postReplayFrames = val;
    }
}

module.exports = AppState;