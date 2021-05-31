//---------------------------------------------------------------------------------------------
//모듈 가져오기
const express = require("express");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const jwtAuth = require("./security/jwtAuth");
const { sequelize } = require("./database/sequelize/models/index");

//---------------------------------------------------------------------------------------------
//라우터 가져오기
const authRouter = require("./routes/auth-router");
const boardsRouter = require("./routes/boards-router");
const productsRouter = require("./routes/products-router");

//---------------------------------------------------------------------------------------------
//.env 파일을 읽어서 process.env에 추가
dotenv.config();

//---------------------------------------------------------------------------------------------
//Express application 객체 생성
const app = express();
app.set("port", process.env.PORT, 8080);

//---------------------------------------------------------------------------------------------
//템플릿 엔진으로 Nunjucks 설정
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch:true
});

//---------------------------------------------------------------------------------------------
//sequelize/models/*.js(index.js 제외)로 선언된 모든 Model을 DB와 동기화
sequelize.sync()
  .then(() => {
    console.log("DB 동기화 성공");
  })
  .catch((err) => {
    console.log("DB 동기화 실패:", err.message);
  });

//---------------------------------------------------------------------------------------------  
//CORS 설정
app.use(cors({
  origin: "*", 
  allowedHeaders: "*",
  methods: "*"
}));

//---------------------------------------------------------------------------------------------
//정적 파일들을 제공하는 미들웨어 적용
app.use(express.static(path.join(__dirname, 'public')));

//---------------------------------------------------------------------------------------------
//로그 출력을 위한 미들웨어 적용
app.use(morgan("dev")); 

//---------------------------------------------------------------------------------------------
//요청 HTTP 헤더에 있는 쿠키를 파싱해서 req.cookies 객체로 생성하는 미들웨어 적용
app.use(cookieParser(process.env.COOKIE_SECRET));

//---------------------------------------------------------------------------------------------
//요청 HTTP 본문에 있는 데이터를 파싱해서 req.body 객체로 만드는 미들웨어 적용
app.use(express.urlencoded({extended:true})); //param1=value1&param2=value2
app.use(express.json()); //{"param1":"value1", "param2":"value2"}

//---------------------------------------------------------------------------------------------
//브라우저 캐싱 금지 미들웨어 적용
//게시물 첨부를 수정하더라도 갱신되지 않는 문제 해결
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//---------------------------------------------------------------------------------------------
//인증 정보 설정(req.userid와 res.locals.userid 설정)
app.use((req, res, next) => {
  jwtAuth.setAuth(req, res);
  next();
});

//---------------------------------------------------------------------------------------------
//요청 경로와 라우터 매핑
app.use("/auth", authRouter);
//app.use("/boards", boardsRouter);
app.use("/boards", jwtAuth.checkAuth, boardsRouter);
app.use("/products", productsRouter);

//---------------------------------------------------------------------------------------------
//404 처리 미들웨어
app.use((req, res, next) => {
  const error = new Error("잘못된 요청");
  error.status = 404;
  next(error);
});

//---------------------------------------------------------------------------------------------
//에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.log(err);
  const error = req.app.get('env') !== 'production' ? err : {};
  error.message = req.method + " " + req.url + ": " + err.message;
  error.status = err.status || 500;
  res.status(error.status);
  res.send(error.message);
});

//---------------------------------------------------------------------------------------------
//서버 실행
app.listen(app.get("port"), () => {
  console.log(`Listening to port ${app.get("port")}`);
});
