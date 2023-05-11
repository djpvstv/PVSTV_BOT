class Utility {
    static waitTimeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = Utility;