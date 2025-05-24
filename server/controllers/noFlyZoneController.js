const { NoFlyZone } = require("../models/models");
const ApiError = require("../error/ApiError");

class NoFlyZoneController {
  async create(req, res, next) {
    try {
      const { geojson, description } = req.body;
      
      if (!geojson) {
        return next(ApiError.badRequest("GeoJSON is required"));
      }

      const noFlyZone = await NoFlyZone.create({ geojson, description });
      return res.json(noFlyZone);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const noFlyZones = await NoFlyZone.findAll();
      return res.json(noFlyZones);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const noFlyZone = await NoFlyZone.findOne({ where: { id } });
      
      if (!noFlyZone) {
        return next(ApiError.notFound("NoFlyZone not found"));
      }
      
      return res.json(noFlyZone);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { geojson, description } = req.body;

      const noFlyZone = await NoFlyZone.findOne({ where: { id } });
      if (!noFlyZone) {
        return next(ApiError.notFound("NoFlyZone not found"));
      }

      await noFlyZone.update({ geojson, description });
      return res.json(noFlyZone);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const noFlyZone = await NoFlyZone.findOne({ where: { id } });
      
      if (!noFlyZone) {
        return next(ApiError.notFound("NoFlyZone not found"));
      }

      await noFlyZone.destroy();
      return res.json({ message: "NoFlyZone deleted successfully" });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new NoFlyZoneController();
