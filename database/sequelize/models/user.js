const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  //클래스 선언
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Board, {foreignKey:"bwriter", sourceKey:"userid"});
      models.User.hasMany(models.Order, {foreignKey:"userid", sourceKey:"userid"});
    }
  };
  //정적 init() 메소드 선언
  User.init(
    {
      userid: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userpassword: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userauthority: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userenabled: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, 
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,  //createdAt과 updatedAt 컬럼을 사용 안함
    }
  );
  //클래스 리턴
  return User;
};

