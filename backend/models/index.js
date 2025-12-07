const Material = require("./Material");
const Inventory = require("./Inventory");
const Transaction = require("./Transaction");

// Material → Inventory (one-to-one)
Material.hasOne(Inventory, { foreignKey: "material_id" });
Inventory.belongsTo(Material, { foreignKey: "material_id" });

// Material → Transaction (one-to-many)
Material.hasMany(Transaction, { foreignKey: "material_id" });
Transaction.belongsTo(Material, { foreignKey: "material_id" });

module.exports = {
  Material,
  Inventory,
  Transaction
};
