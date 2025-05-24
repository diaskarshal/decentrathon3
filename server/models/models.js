const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Drone = sequelize.define("drone", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  serial: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Pilot = sequelize.define("pilot", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  contacts: { type: DataTypes.STRING, allowNull: false },
});

const Flight = sequelize.define("flight", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  route: { type: DataTypes.JSONB, allowNull: false }, // Можно хранить маршрут как GeoJSON или массив точек
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
  rtmp_url: { type: DataTypes.STRING },
  rtsp_url: { type: DataTypes.STRING },
  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },
});

const NoFlyZone = sequelize.define("no_fly_zone", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  geojson: { type: DataTypes.JSONB, allowNull: false },
  description: { type: DataTypes.STRING },
});

Drone.hasMany(Flight, { foreignKey: "drone_id" });
Flight.belongsTo(Drone, { foreignKey: "drone_id" });

Pilot.hasMany(Flight, { foreignKey: "pilot_id" });
Flight.belongsTo(Pilot, { foreignKey: "pilot_id" });

module.exports = {
  Drone,
  Pilot,
  Flight,
  NoFlyZone,
};
