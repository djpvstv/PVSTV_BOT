const child_process = require('child_process');
const { app } = require('electron');
const { join } = require('path');
const fs = require('fs').promises;

class SlippiPlayer {
    #isBusy = null;
    #isSetUp = null;
    #isoPath = null;
    #dolphinPath = null;
    #appDataPath = null;
    #APP_NAME = null;

    constructor (appName) {
        this.#isBusy = false;
        this.#isSetUp = false;
        this.#APP_NAME = appName;
    }

    setSlippiPath (val) {
        this.#dolphinPath = val;
    }

    setIsoPath (val) {
        this.#isoPath = val;
    }

    async setup() {
        const appDataPath = join(app.getPath("appData"), this.#APP_NAME);
        try {
            await fs.access(appDataPath);
            this.#isSetUp = true;
            this.#appDataPath = appDataPath;
            return true;
        } catch {
            try {
                await fs.mkdir(appDataPath);
            } catch {
                return false;
            }
        }

        try {
            await fs.access(appDataPath);
            this.#isSetUp = true;
            this.#appDataPath = appDataPath;
            return true;
        } catch {
            return false;
        }
    }

    async playCombos (combos) {
        if (!this.#isSetUp) {
            if (!(await this.setup())) return;
        }

        await this._createJSONSettings(combos);
        await this._playCombo();
    }

    _playCombo () {
        if (!this.#isBusy) {
            return new Promise((resolve, reject) => {
                const params = ["-i"]; 
                params.push(join(this.#appDataPath, "queue.json"));
                params.push("-e");
                params.push(this.#isoPath);
                params.push("--cout");
                params.push("--batch");
                params.push("--hide-seekbar");

                this.#isBusy = true;
                const slpProcess = child_process.spawn(this.#dolphinPath, params);
                slpProcess.on("exit", () => {
                    this.#isBusy = false;
                    resolve();
                }, this);
            });
        }
    }

    async _createJSONSettings (combos) {

        let queue = [];
        const numCombos = combos.length;
        let i = 0;

        while (i < numCombos) {
            const combo = combos[i];
            queue.push({
                path: combo.filePath,
                startFrame: combo.startFrame,
                endFrame: combo.endFrame
            });
            i++;
        }

        const outerJSON = {
            mode: "queue",
            replay: "",
            isRealTimeMode: false,
            outputOverlayFiles: true,
            queue: queue
        };

        try {
            await fs.writeFile(join(this.#appDataPath, "queue.json"), JSON.stringify(outerJSON, null, 2));
        } catch (error) {
            console.error("Cannot write to file: " + error.message);
        }
    }
}

module.exports = SlippiPlayer;