const { Pilot } = require("../models/models");
const ApiError = require("../error/ApiError");

class PilotController {
  async create(req, res, next) {
    try {
      const { name, contacts } = req.body;
      
      if (!name || !contacts) {
        return next(ApiError.badRequest("Name and contacts are required"));
      }

      const pilot = await Pilot.create({ name, contacts });
      return res.json(pilot);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const pilots = await Pilot.findAll();
      return res.json(pilots);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const pilot = await Pilot.findOne({ where: { id } });
      
      if (!pilot) {
        return next(ApiError.notFound("Pilot not found"));
      }
      
      return res.json(pilot);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, contacts } = req.body;

      const pilot = await Pilot.findOne({ where: { id } });
      if (!pilot) {
        return next(ApiError.notFound("Pilot not found"));
      }

      await pilot.update({ name, contacts });
      return res.json(pilot);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const pilot = await Pilot.findOne({ where: { id } });
      
      if (!pilot) {
        return next(ApiError.notFound("Pilot not found"));
      }

      await pilot.destroy();
      return res.json({ message: "Pilot deleted successfully" });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new PilotController();
