class AppState {
    #foundTags = [];

    getFoundTags () {
        return this.#foundTags;
    }

    setFoundTags (val) {
        this.#foundTags = val;
    }
}

module.exports = AppState;