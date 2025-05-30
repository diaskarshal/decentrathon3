const { Drone } = require("../models/models");
const ApiError = require("../error/ApiError");

class DroneController {
  async create(req, res, next) {
    try {
      const { name, model, serial } = req.body;
      const owner_id = req.user.id;
      
      if (!name || !model || !serial) {
        return next(ApiError.badRequest("Please fill in all fields"));
      }

      const drone = await Drone.create({ name, model, serial, owner_id });
      return res.json(drone);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(ApiError.badRequest("Drone with this serial already exists"));
      }
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const drones = await Drone.findAll();
      return res.json(drones);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getMyDrones(req, res, next) {
    try {
      const drones = await Drone.findAll({
        where: { owner_id: req.user.id }
      });
      return res.json(drones);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const drone = await Drone.findOne({ where: { id } });
      
      if (!drone) {
        return next(ApiError.notFound("Drone not found"));
      }
      
      return res.json(drone);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, model, serial } = req.body;

      const drone = await Drone.findOne({ where: { id } });
      if (!drone) {
        return next(ApiError.notFound("Drone not found"));
      }

      await drone.update({ name, model, serial });
      return res.json(drone);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(ApiError.badRequest("Drone with this serial already exists"));
      }
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const drone = await Drone.findOne({ where: { id } });
      
      if (!drone) {
        return next(ApiError.notFound("Drone not found"));
      }

      await drone.destroy();
      return res.json({ message: "Drone deleted successfully" });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new DroneController();
