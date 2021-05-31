const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  //클래스 선언
  class Board extends Model {
    static associate(models) {
      models.Board.belongsTo(models.User, {foreignKey:"bwriter", targetKey:"userid"});
    }
  };
  //정적 init() 메소드 선언
  Board.init(
    {
      bno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      btitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bcontent: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bwriter: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      bhitcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      battachoname: DataTypes.STRING,
      battachsname: DataTypes.STRING,
      battachtype: DataTypes.STRING,
    }, 
    {
      sequelize,
      modelName: "Board",
      tableName: "boards",
      timestamps: false,  //createdAt과 updatedAt 컬럼을 사용 안함
    }
  );
  //클래스 리턴
  return Board;
};

