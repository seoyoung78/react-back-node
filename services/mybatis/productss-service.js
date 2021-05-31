//모듈 로딩
const path = require("path");
const mybatisMapper = require("mybatis-mapper");

//데이터베이스 관련 모듈 로딩
const dbPath = path.join(__dirname, "..", "database/mybatis/mysql/");
const connPool = require(dbPath + "connPool");
mybatisMapper.createMapper([dbPath + "products.xml"]);

//비즈니스 메소드
exports.getProducts = async () => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("products", "selectByPage");
    let [rows] = await conn.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.getProduct = async (pid) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("products", "selectByPid", {pid});
    let [rows] = await conn.execute(sql);
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.saveProduct = async (product) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("products", "insert", product);
    await conn.execute(sql);
    sql = mybatisMapper.getStatement("products", "selectInsertedPid");
    let [rows] = await conn.execute(sql);
    product.pid = rows[0].pid;
    return product;
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.updateProduct = async (product) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("products", "update", product);
    await conn.execute(sql);
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.deleteProduct = async (pid) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("products", "deleteByPid", {pid});
    await conn.execute(sql);
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

