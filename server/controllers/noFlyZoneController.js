const { NoFlyZone } = require("../models/models");
const ApiError = require("../error/ApiError");

class NoFlyZoneController {
  async create(req, res, next) {
    try {
      const { geojson, description, zone_type = "polygon", zone_data } = req.body;
      
      if (!geojson || !description) {
        return next(ApiError.badRequest("GeoJSON and description are required"));
      }

      if (!zone_data || !zone_data.coordinates || zone_data.coordinates.length < 3) {
        return next(ApiError.badRequest("Zone must have at least 3 coordinate points"));
      }

      const noFlyZone = await NoFlyZone.create({ 
        geojson, 
        description, 
        zone_type,
        zone_data,
        created_by: req.user?.id 
      });
      
      return res.status(201).json({
        message: "No-fly zone created successfully",
        noFlyZone
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const noFlyZones = await NoFlyZone.findAll({
        order: [["createdAt", "DESC"]]
      });
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
      const { geojson, description, zone_type, zone_data } = req.body;

      const noFlyZone = await NoFlyZone.findOne({ where: { id } });
      if (!noFlyZone) {
        return next(ApiError.notFound("NoFlyZone not found"));
      }

      await noFlyZone.update({ geojson, description, zone_type, zone_data });
      return res.json({
        message: "No-fly zone updated successfully",
        noFlyZone
      });
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
      return res.json({ message: "No-fly zone deleted successfully" });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new NoFlyZoneController();
