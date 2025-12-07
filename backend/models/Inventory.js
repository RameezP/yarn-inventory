const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Material = require("./Material");

const Inventory = sequelize.define(
  "Inventory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    material_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Material,
        key: "id",
      },
    },

    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "inventory",
    timestamps: false,
  }
);

// Relationship

module.exports = Inventory;
