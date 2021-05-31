//모듈 로딩
const path = require("path");
const bcrypt = require("bcrypt");
const mybatisMapper = require("mybatis-mapper");

//데이터베이스 관련 모듈 로딩
const dbPath = path.join(__dirname, "..", "database/mybatis/mysql/");
const connPool = require(dbPath + "connPool");
mybatisMapper.createMapper([dbPath + "users.xml"]);

exports.saveUser = async (user) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("users", "insert", user);
    await conn.execute(sql);
  } catch(error) {
    throw error;
  } finally {
    if (conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.getUser = async (uid) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("users", "selectByUid", {uid});
    const [rows] = await conn.execute(sql);
    return rows[0];
  } catch(error) {
    throw error;
  } finally {
    if (conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.login = async (user) => {
  try {
    const dbuser = await exports.getUser(user.uid);
    if(!dbuser) { return "wrongUid"; }
    const result = await bcrypt.compare(user.upassword, dbuser.userpassword);
    if(result) {
      return "success";
    } else {
      return "wrongPassword";
    }
  } catch(error) {
    throw error;
  }
};




