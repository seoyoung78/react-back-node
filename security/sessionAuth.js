const sessionAuth = {
  setAuth: function(req, res, userid) {
    if(userid) {
      req.session.userid = userid;
    }
    req.userid = req.session.userid || null;
    res.locals.userid = req.session.userid || null;
  },

  checkAuth: function(req, res, next) {
    if(req.userid) {
      next();
    } else {
      const error = new Error("인증 필요");
      error.status = 403;
      next(error);
    }
  },

  removeAuth: (req) => {
    delete req.session.userid;
  }
}

module.exports = sessionAuth;