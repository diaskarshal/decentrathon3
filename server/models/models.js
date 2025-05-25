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
  name: { type: DataTypes.STRING, allowNull: false },
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
  },
  rtmp_url: { type: DataTypes.STRING },
  rtsp_url: { type: DataTypes.STRING },
  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },
  altitude: { type: DataTypes.FLOAT, allowNull: false },
  purpose: { type: DataTypes.STRING },
});

const NoFlyZone = sequelize.define("no_fly_zone", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.STRING },
  geojson: { type: DataTypes.JSONB, allowNull: false },
  zone_type: {
    type: DataTypes.ENUM("polygon", "circle"),
    allowNull: false,
    defaultValue: "polygon",
  },
  zone_data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

const Notification = sequelize.define("notification", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
});

// Fixed associations
User.hasMany(Drone, { foreignKey: "owner_id", as: "ownedDrones" });
Drone.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

User.hasMany(Flight, { foreignKey: "pilot_id", as: "flights" });
Flight.belongsTo(User, { foreignKey: "pilot_id", as: "user" }); //сhanged alias to from 'pilot' to 'user'

Drone.hasMany(Flight, { foreignKey: "drone_id", as: "flights" });
Flight.belongsTo(Drone, { foreignKey: "drone_id", as: "drone" });

User.hasMany(NoFlyZone, { foreignKey: "created_by", as: "createdZones" });
NoFlyZone.belongsTo(User, { foreignKey: "created_by", as: "creator" });

User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = {
  User,
  Drone,
  Flight,
  NoFlyZone,
  Notification
};
