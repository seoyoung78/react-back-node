//모듈 로딩
const path = require("path");
const mybatisMapper = require("mybatis-mapper");

//데이터베이스 관련 모듈 로딩
const dbPath = path.join(__dirname, "..", "database/mybatis/mysql/");
const connPool = require(dbPath + "connPool");
mybatisMapper.createMapper([dbPath + "boards.xml"]);

//비즈니스 메소드
exports.getList = async (pager) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    const sql = mybatisMapper.getStatement("boards", "selectByPage", pager);
    const [rows] = await conn.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.getTotalRows = async () => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    const sql = mybatisMapper.getStatement("boards", "count");
    const [rows] = await conn.execute(sql);
    const totalrows = rows[0].totalrows;
    return totalrows;
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.insert = async (board) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("boards", "insert", board);
    let [rows] = await conn.execute(sql);
    sql = mybatisMapper.getStatement("boards", "selectInsertedBno");
    [rows] = await conn.execute(sql);
    board.bno = rows[0].bno;
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.getBoard = async (bno) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("boards", "selectByBno", {bno});
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

exports.update = async (board) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("boards", "update", board);
    let [rows] = await conn.execute(sql);
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.delete = async (bno) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("boards", "deleteByBno", {bno});
    let [rows] = await conn.execute(sql);
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};

exports.addHitcount = async (bno) => {
  let conn = null;
  try {
    conn = await connPool.getConn();
    let sql = mybatisMapper.getStatement("boards", "updateBhitcount", {bno});
    let [rows] = await conn.execute(sql);
  } catch (error) {
    throw error;
  } finally {
    if(conn) {
      connPool.releaseConn(conn);
    }
  }
};



