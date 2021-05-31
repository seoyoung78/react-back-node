//---------------------------------------------------------------------------------------------
//모듈 가져오기
const express = require("express");
const router = express.Router();
const jwtAuth = require("../security/jwtAuth");
const usersService = require("../services/sequelize/users-service");

//---------------------------------------------------------------------------------------------
//회원가입
router.post("/join", async (req, res, next) => {
  try {
    const user = req.body;
    const dbUser = await usersService.create(user);
    res.json(dbUser);
  } catch (error) {
    next(error);
  }
});

//---------------------------------------------------------------------------------------------
//로그인
router.post("/login", async (req, res, next) => {
  try {
    const user = req.body;
    const result = await usersService.login(user);
    if(result.id) {
      const error = new Error(result.message);
      error.status = 401;
      throw error;
    } else {
      res.json({
        userid: user.userid,
        authToken: jwtAuth.createJwt(user.userid)
      });
    }
  } catch (error) {
    next(error);
  }
});

//---------------------------------------------------------------------------------------------
//라우터 내보내기
module.exports = router;