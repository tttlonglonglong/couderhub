const connection = require('../app/database')
const { NAME_OR_PASSWORD_IS_REQUIRED } = require('../constants/error-types')

class CommentService {
    async create(momentId, content, userId) {
        const statement = `INSERT INTO comment (content, moment_id, user_id) VALUES (?,?,?);`
        // const statement = `INSERT INTO comment content=?, moment_id=?;`
        const [result] = await connection.execute(statement, [content, momentId, userId])
        return result
    }
    async reply(momentId, content, userId, commentId) {
        const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) VALUES (?,?,?,?);`
        const [result] = await connection.execute(statement, [content, momentId, userId, commentId])
        return result
    }
    async update(commentId, content) {
        const statement = `UPDATE comment SET content = ? WHERE id = ?`
        const [result] = await connection.execute(statement, [content, commentId])
        return result
    }
    async remove(commentId) {
        const statement = `DELETE FROM comment WHERE id = ?`
        const [result] = await connection.execute(statement, [commentId])
        return result
    }
}

module.exports = new CommentService()