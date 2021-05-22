const connection = require('../app/database')


class UserService {
  async create(user){
    const { name, password } = user;
    const statement = `INSERT INTO user (name, password) VALUES (?, ?);`;
    const result = await connection.execute(statement, [name, password]);

    // 将user存储到数据库中
    console.log('将用户数据保存到数据库中:', user)
    return result[0];
    // return "创建用户成功！"
  }

  async getUserByName(name){
    const statament = `SELECT * FROM user WHERE name = ?;`
    const result = await connection.execute(statament, [name])

    return result[0];
  }

  async updateAvatarUrlById(avatarUrl, userId){
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [avatarUrl, userId]);
    return result; 
   }
}

module.exports  = new UserService()