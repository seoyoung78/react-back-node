const express = require("express");
const productsService = require("../services/sequelize/products-service");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await productsService.list();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const product = await productsService.read(pid);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = req.body;
    product.description = product.description? product.description : null;
    const dbProduct = await productsService.create(product);
    res.json(dbProduct);
  } catch(error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const product = req.body;
    await productsService.update(product);
    res.json({result:"success"});
  } catch(error) {
    next(error);
  }
});

router.delete("/:pid", async (req, res, next) => {
  try {
    const pid = req.params.pid;
    await productsService.delete(pid);
    res.json({result:"success"});
  } catch(error) {
    next(error);
  }
});

module.exports = router;
