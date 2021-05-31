const jwt = require("jsonwebtoken");

const jwtAuth = {
  createJwt: function(userid) {
    const authToken = jwt.sign({userid}, process.env.JWT_SECRET, {expiresIn:"12h"});
    return authToken;
  },

  setAuth: function(req, res) {
    let authToken = null;
    if(req.signedCookies.authToken) {           //쿠키로 전송된 경우
      authToken = req.signedCookies.authToken;
    } else if(req.headers.authtoken) {          //헤드로 전송된 경우(주의:헤드의 이름은 모두 소문자로 추가됨)
      authToken = req.headers.authtoken;
    } else if(req.query.authToken) {            //쿼리스트링으로 전송된 경우(xxx?authToken=...)
      authToken = req.query.authToken;
    }
    if(authToken) {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);   
      const expires = decoded.exp;
      const now = Math.floor(Date.now()/1000);
      if((expires - now) > 0) {             //만료기간이 남았을 경우
        if(decoded.userid) {                //userid가 있을 경우
          req.userid = decoded.userid;
          res.locals.userid = decoded.userid;
        }
      }
    } 
  },

  checkAuth: function(req, res, next) {
    if(req.userid) {
      next();
    } else {
      const error = new Error("인증 필요");
      error.status = 403;
      next(error);
    }
  }
}

module.exports = jwtAuth;