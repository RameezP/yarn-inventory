const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // ✅ NEW FIELD: Phone Number
    phone: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for old users, required for new ones via Controller
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user"
    }
}, {
    tableName: "users",
    timestamps: false
});

module.exports = User;