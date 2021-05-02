//权限查询service 动态、评论、头像、标签的时候是否具备权限
const connection = require('../app/database')
const { NAME_OR_PASSWORD_IS_REQUIRED } = require('../constants/error-types')

class AuthService {
    async checkResource(tableName, id, userId) {
        try {
            // const statement = 'SELECT * FROM moment WHERE id = ?  AND user_id = ?;'
            console.log('checkResource',  'momentId', id, "userId", userId)
            const statement = `SELECT * FROM ${tableName} WHERE id = ?  AND user_id = ?;`
            const [result] = await connection.execute(statement, [id, userId])
            console.log('checkResource-result', result.length)
            return result.length === 0 ? false : true;
        } catch (error) {
            console.log('checkResource-error', error)
        }
    }
}

module.exports = new AuthService()