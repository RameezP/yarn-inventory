const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Material = sequelize.define(
  "Material",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "materials",
    timestamps: false,
  }
);

module.exports = Material;
