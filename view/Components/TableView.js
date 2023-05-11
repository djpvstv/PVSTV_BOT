const TableTypes = Object.freeze({
    FILE:   0,
    TIME:   1
});

class TableView {

    #tableDiv = null;

    constructor (type) {
        switch (type) {
            case TableTypes.FILE:
                this.createFileTable();
                break;
            case TableTypes.TIME:
                this.createTimeTable();
                break;
        }
    }

    getTableDiv () {
        return this.#tableDiv;
    }

    createFileTable () {
        const tableDiv = document.createElement("table");
        tableDiv.classList.add("table", "table-bordered");
        tableDiv.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Valid Files</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        `;
        this.#tableDiv = tableDiv;
        return tableDiv;
    }

    createTimeTable () {
        const tableDiv = document.createElement("table");
        tableDiv.classList.add("table","table-bordered");
        tableDiv.innerHTML = `
        <thead>
            <tr>
                <th scope="col">First Date</th>
                <th scope="col">Last Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
            </tr>
        </tbody>
        `;
        this.#tableDiv = tableDiv;
        return tableDiv;
    }

    updateFilesTable (files) {
        const tableDiv = this.#tableDiv;
        const tableBody = tableDiv.querySelector("tbody");

        tableBody.textContent = '';

        files.forEach((file) => {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.textContent = `${file}`;
            row.appendChild(cell);
            tableBody.appendChild(row);
        });
    }
}

module.exports = {TableView, TableTypes};