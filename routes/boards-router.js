const express = require("express");
const boardsService = require("../services/sequelize/boards-service");
const paging = require("../utils/paging");
const multipartFormData = require("../utils/multipart-form-data");

const router = express.Router();

router.get("", async (req, res, next) => {
  try {
    // for(var i = 1; i <= 100; i++) {
    //   const board = {
    //     btitle: "제목" + i,
    //     bcontent: "내용" + i,
    //     bwriter: "user1"
    //   };
    //   await boardsService.create(board);
    // };
    
    let pageNo = req.query.pageNo? parseInt(req.query.pageNo) : 1;
    const totalRows = await boardsService.totalRows();
    const pager = paging.init(5, 5, pageNo, totalRows);
    const boards = await boardsService.list(pager);
    res.json({boards, pager});
  } catch(error) {
    next(error);
  }
});

router.get("/:bno", async (req, res, next) => {
  try {
    const bno = req.params.bno;
    await boardsService.addBhitcount(bno);
    const board = await boardsService.read(bno);
    res.json(board);
  } catch (error) {
    next(error);
  }
});

router.get("/battach/:bno", async (req, res, next) => {
  try {
    const bno = req.params.bno;
    const board = await boardsService.read(bno);
    const filePath = process.env.UPLOAD_PATH + board.battachsname;
    res.download(filePath, board.battachoname);
  } catch (error) {
    next(error);
  }
}); 

//post 방식으로 보낸 것은 모두 처리(꼭 multipart/form-data가 아니어도됨)
router.post("/", multipartFormData.single('battach'), async (req, res, next) => {
  try {
    const board = req.body;
    if(req.file) {
      board.battachoname = req.file.originalname;
      board.battachsname = req.file.filename;
      board.battachtype = req.file.mimetype;
    } else {
      board.battachoname = null;
      board.battachsname = null;
      board.battachtype = null;
    }
    const dbBoard = await boardsService.create(board);
    res.json(dbBoard);
  } catch(error) {
    next(error);
  }
});

router.put("/", multipartFormData.single('battach'), async (req, res, next) => {
  try {
    const board = req.body;
    if(req.file) {
      board.battachoname = req.file.originalname;
      board.battachsname = req.file.filename;
      board.battachtype = req.file.mimetype;
    } else {
      board.battachoname = null;
      board.battachsname = null;
      board.battachtype = null;
    }
    await boardsService.update(board);
    res.json({result:"success"});
  } catch(error) {
    next(error);
  }
});

router.delete("/:bno", async (req, res, next) => {
  try {
    const bno = req.params.bno;
    await boardsService.delete(bno);
    res.json({result:"success"});
  } catch(error) {
    next(error);
  }
});

module.exports = router;