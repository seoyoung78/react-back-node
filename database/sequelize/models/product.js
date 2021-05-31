const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  //클래스 선언
  class Product extends Model {
    static associate(models) {
      models.Product.hasMany(models.OrderItem, {foreignKey:"pid", sourceKey:"pid"});
    }
  };
  //정적 init() 메소드 선언
  Product.init(
    {
      pid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: DataTypes.STRING,
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, 
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: false,  //createdAt과 updatedAt 컬럼을 사용 안함
    }
  );
  //클래스 리턴
  return Product;
};

