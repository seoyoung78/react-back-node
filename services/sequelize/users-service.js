const db = require("../../database/sequelize/models/index");
const bcrypt = require("bcrypt");
const Op = db.Sequelize.Op;

module.exports = {
  create: async function(user) {
    try {
      user.userpassword = await bcrypt.hash(user.userpassword, 12);
      user.userauthority = "ROLE_USER";
      user.userenabled = 1;
      const dbUser = await db.User.create(user);
      return dbUser;
    } catch (error) {
      throw error;
    }
  },  
  read: async function(userid) {
    try {
      const user = await db.User.findOne({
        attributes: ["userid", "username", "userpassword", "userauthority", "userenabled"],
        where: { userid }
      });
      return user;
    } catch (error) {
      throw error;
    }
  },
  login: async function(user) {
    const dbUser = await this.read(user.userid);
    let result = {};
    if(dbUser) {
      const match = await bcrypt.compare(user.userpassword, dbUser.userpassword);
      if(!match) {
        result = {id:"wrongpassword", message:"비밀번호가 일치하지 않음"};
      }
    } else {
      result = {id:"wrongid", message:"아이디가 존재하지 않음"}
    }
    return result;
  }
};
