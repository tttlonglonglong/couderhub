const connection = require('../app/database')
const { NAME_OR_PASSWORD_IS_REQUIRED } = require('../constants/error-types')

class LabelService {
    async create(name) {
        const statement = `INSERT INTO label (name) VALUES (?);`;
        const [result] = await connection.execute(statement, [name]);
        return result;
    }

    // label是否已存在
    async getLabelByName(name) {
        const statement = `SELECT * FROM label WHERE name = ?;`;
        const [result] = await connection.execute(statement, [name]);
        return result[0];
    }

    async getLabels(offset, limit) {
        const statement = `SELECT * FROM label LIMIT ?, ?;`;
        const [result] = await connection.execute(statement, [offset, limit]);
        return result;
    }
}

module.exports = new LabelService()