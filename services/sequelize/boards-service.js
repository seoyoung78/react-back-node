const db = require("../../database/sequelize/models/index");
const Op = db.Sequelize.Op;

module.exports = {
  totalRows: async function(search) {
    let where = null;
    if(search) {
      if(search.column === "btitle") {
        where = {
          [search.column]: {
            [Op.like]: "%" + search.keyword + "%"
          }
        };
      } else {
        where = {
          [Op.or]: [
            {"btitle": {
              [Op.like]: "%" + search.keyword + "%"
            }},
            {"bcontent": {
              [Op.like]: "%" + search.keyword + "%"
            }}
          ]
        };
      }
    }
    try {
      const result = await db.Board.count({where});
      return result;
    } catch (error) {
      throw error;
    }
  },
  list: async function(pager, search) {
    let where = null;
    if(search) {
      if(search.column === "btitle") {
        where = {
          [search.column]: {
            [Op.like]: "%" + search.keyword + "%"
          }
        };
      } else {
        where = {
          [Op.or]: [
            {"btitle": {
              [Op.like]: "%" + search.keyword + "%"
            }},
            {"bcontent": {
              [Op.like]: "%" + search.keyword + "%"
            }}
          ]
        };
      }
    }
    try {
      const result = await db.Board.findAll({
        attributes: ["bno", "btitle", "bwriter", "bdate", "bhitcount"],
        where,
        order: [["bno", "DESC"]],
        offset: pager.startRowIndex,
        limit: pager.rowsPerPage
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  read: async function(bno) {
    try {
      const board = await db.Board.findOne({
        where: { bno }
      });
      return board;
    } catch (error) {
      throw error;
    }
  },
  create: async function(board) {
    try {
      const dbBoard = await db.Board.create(board);
      return dbBoard;
    } catch (error) {
      throw error;
    }
  },
  update: async function(board) {
    try {
      const rows = await db.Board.update({
        btitle: board.btitle,
        bcontent: board.bcontent
      }, {
        where: {bno:board.bno}
      });
      return rows;
    } catch (error) {
      throw error;
    }
  },
  addBhitcount: async function(bno) {
    try {
      const rows = await db.Board.increment({bhitcount: 1}, {where: {bno}});
      return rows;
    } catch (error) {
      throw error;
    }
  },
  delete: async function(bno) {
    try {
      const rows = await db.Board.destroy({
        where: {bno}
      });
      return rows;
    } catch (error) {
      throw error;
    }
  },  
  getUserAndBoard: async function(userid) {
    try {
      const user = await db.User.findOne({
        attributes: ["userid", "username", "userauthority"],
        where: { userid },
        include: [{
          model: db.Board,
          attributes: ["bno", "btitle", "bcontent", "bdate"],
          where: {
            bno: {[Op.lte]:10}
          }      
        }]
      });
      return user;
    } catch (error) {
      throw error;
    }
  },  
  getBoardAndUser: async function(bno) {
    try {
      const board = await db.Board.findOne({
        attributes: ["bno", "btitle", "bcontent", "bwriter", "bdate", "bhitcount"],
        where: { bno },
        include: [{
          model: db.User,
          attributes: ["userid", "username"]       
        }]
      });
      return board;
    } catch (error) {
      throw error;
    }
  }, 
  getOrderInfo: async function(userid) { 
    try {
      const user = await db.User.findOne({
        attributes: ["userid", "username", "userauthority"],
        where: {userid},
        include: [{
          model: db.Order, include: [{
            model: db.OrderItem, include: [
              {model:db.Product}
            ]
          }]
        }]
      });
      return user;  
    } catch (error) {
      throw error;
    }
  },
};
