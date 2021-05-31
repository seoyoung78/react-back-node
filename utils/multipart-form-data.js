const multer = require("multer");

const multipartFormData = multer({
  storage: multer.diskStorage({
    destination: function(req, file, done) {
      done(null, process.env.UPLOAD_PATH);
    },
    filename: function(req, file, done) {
      done(null, Date.now() + "-" + file.originalname);
    }
  }),
  limits: {fileSize: 10*1024*1024}
});

module.exports = multipartFormData;