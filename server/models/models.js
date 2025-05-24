const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "PILOT" },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
});

const Drone = sequelize.define("drone", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  serial: { type: DataTypes.STRING, allowNull: false, unique: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Flight = sequelize.define("flight", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pilot_id: { type: DataTypes.INTEGER, allowNull: false },
  drone_id: { type: DataTypes.INTEGER, allowNull: false },
  route: { type: DataTypes.JSONB, allowNull: false },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  }, //pending, approved, active, completed, cancelled
  rtmp_url: { type: DataTypes.STRING },
  rtsp_url: { type: DataTypes.STRING },
  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },
  altitude: { type: DataTypes.FLOAT, allowNull: false },
  purpose: { type: DataTypes.STRING },
});

const NoFlyZone = sequelize.define("no_fly_zone", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  geojson: { type: DataTypes.JSONB, allowNull: false },
});

User.hasMany(Drone, { foreignKey: "owner_id", as: "ownedDrones" });
Drone.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

User.hasMany(Flight, { foreignKey: "pilot_id", as: "flights" });
Flight.belongsTo(User, { foreignKey: "pilot_id", as: "pilot" });

Drone.hasMany(Flight, { foreignKey: "drone_id" });
Flight.belongsTo(Drone, { foreignKey: "drone_id" });

User.hasMany(NoFlyZone, { foreignKey: "created_by", as: "createdZones" });
NoFlyZone.belongsTo(User, { foreignKey: "created_by", as: "creator" });

module.exports = {
  User,
  Drone,
  Flight,
  NoFlyZone,
};
