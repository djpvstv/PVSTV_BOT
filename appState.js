class AppState {
    #foundTags = [];
    #batchSize = 20;
    #frameLeniency = 45;
    #hitsPerPage = 100;
    #isoPath = '';
    #slippiPath = '';

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
}

module.exports = AppState;