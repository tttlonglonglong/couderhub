const connection = require('../app/database')
const { NAME_OR_PASSWORD_IS_REQUIRED } = require('../constants/error-types')

const sqlFragment = `SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, JSON_OBJECT('id', u.id, 'name', u.name) user FROM moment m LEFT JOIN user u ON m.user_id = u.id`

class MomentService {
    async create(userId, content) {
        const statement = `INSERT INTO moment (content, user_id) VALUES (?,?);`
        const [result] = await connection.execute(statement, [content, userId])
        return result[0]
    }
    async getMomentById(id) {
        console.log('getMomentById', id)
        // const statement = `SELECT * from moment where id = ?;`;
        // 只获取动态详情
        // const statement = `SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, JSON_OBJECT('id', u.id, 'name', u.name) user FROM moment m LEFT JOIN user u ON m.user_id = u.id WHERE m.id = ?;`
        // 获取动态详情包括评论列表和评论用户信息
        const statement = `
        SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, 
        JSON_OBJECT('id', u.id, 'name', u.name) author,
        IF( COUNT(l.id),	
            JSON_ARRAYAGG(
                JSON_OBJECT('id', l.id, 'name', l.name)
            ),
            NULL ) labels,
        (SELECT 
            IF(
            COUNT(c.id),	
            JSON_ARRAYAGG(
            JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                                    'user', JSON_OBJECT('id', cu.id, 'name', cu.name ))
            ),
            NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id WHERE m.id = c.moment_id
        ) comments
     FROM moment m 
     LEFT JOIN user u ON m.user_id = u.id 
     LEFT JOIN moment_label ml ON m.id = ml.moment_id
     LEFT JOIN label l ON ml.label_id = l.id
    WHERE m.id= 1
    GROUP BY m.id; # 使用JSON_ARRAYAGG 必须分组
        `;
        const [result] = await connection.execute(statement, [id])
        return result[0]
    }
    async getMomentList(offset, size) {
        // const statement = `SELECT 
        //     m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, 
        //     JSON_OBJECT('id', u.id, 'name', u.name) author,
        //     (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount
        //  FROM moment m 
        //  LEFT JOIN user u ON m.user_id = u.id 
        //  LIMIT ?, ?;`
        const statement = `SELECT 
            m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, 
            JSON_OBJECT('id', u.id, 'name', u.name) author,
            (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
            (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount
         FROM moment m 
         LEFT JOIN user u ON m.user_id = u.id 
         LIMIT ?, ?;`
        const [result] = await connection.execute(statement, [offset, size])
        return result
    }
    async update(content, momentId) {
        const statement = `UPDATE moment SET content = ? WHERE id = ?;`
        const result = await connection.execute(statement, [content, momentId])
        return result
    }
    async remove(momentId) {
        const statement = `DELETE FROM moment WHERE id = ?;`
        const result = await connection.execute(statement, [momentId])
        return result
    }
    async hasLabel(momentId, labelId) {
        const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result[0] ? true : false;
    }
    async addLabel(momentId, labelId) {
        const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result;
    }

}

module.exports = new MomentService()