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
  drone_id: { type: DataTypes.INTEGER, allowNull: false },

  zone_type: { 
    type: DataTypes.ENUM("polygon", "circle"),
    allowNull: false,
    defaultValue: "polygon",
  },

  zone_data: { // Содержит координаты, центр и радиус — в зависимости от типа
    type: DataTypes.JSONB,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending", // e.g., pending, approved, rejected, in_progress, completed
  },

  rtmp_url: { type: DataTypes.STRING },
  rtsp_url: { type: DataTypes.STRING },
  telemetry_url: { type: DataTypes.STRING },

  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },

}, {
  tableName: "flights",
  timestamps: true,
});

const NoFlyZone = sequelize.define("no_fly_zone", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  geojson: { type: DataTypes.JSONB, allowNull: false },
  description: { type: DataTypes.STRING },
});

const Notification = sequelize.define("notification", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  type: {type: DataTypes.STRING},
  description: {type: DataTypes.STRING},
  title: {type: DataTypes.STRING},
})

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
