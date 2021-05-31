const db = require("../../database/sequelize/models/index");
const Op = db.Sequelize.Op;

module.exports = {
  list: async function() {
    try {
      const products = await db.Product.findAll();
      return products;
    } catch (error) {
      throw error;
    }
  },
  read: async function(pid) {
    try {
      const product = await db.Product.findOne({
        where: { pid }
      });
      return product;
    } catch (error) {
      throw error;
    }
  },
  create: async function(product) {
    try {
      const dbProduct = await db.Product.create(product);
      return dbProduct;
    } catch (error) {
      throw error;
    }
  },
  update: async function(product) {
    try {
      const rows = await db.Product.update({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price
      }, {
        where: {pid:product.pid}
      });
      return rows;
    } catch (error) {
      throw error;
    }
  },
  delete: async function(pid) {
    try {
      const rows = await db.Product.destroy({
        where: {pid}
      });
      return rows;
    } catch (error) {
      throw error;
    }
  }
};
