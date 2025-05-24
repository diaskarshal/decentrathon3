const { Flight, Drone, User } = require("../models/models");
const ApiError = require("../error/ApiError");
const axios = require("axios");

const createStreamPath = async (flightId) => {
  try {
    await axios.put(`${process.env.MEDIAMTX_API_URL || 'http://mediamtx:9997'}/v1/paths/live/${flightId}`, {
      publish: true,
      rtmpEnable: true,
      read: true,
      rtspEnable: true
    });
    return `rtsp://${process.env.MEDIAMTX_HOST || 'localhost'}:8554/live/${flightId}`;
  } catch (error) {
    throw new Error('Failed to create stream path');
  }
};

const deleteStreamPath = async (flightId) => {
  try {
    await axios.delete(`${process.env.MEDIAMTX_API_URL || 'http://mediamtx:9997'}/v1/paths/live/${flightId}`);
  } catch (error) {
    console.warn('Failed to delete stream path:', error.message);
  }
};

class FlightController {
  async create(req, res, next) {
    try {
      const { drone_id, pilot_id, route, rtmp_url } = req.body;
      
      if (!drone_id || !pilot_id || !route) {
        return next(ApiError.badRequest("Please fill in all fields"));
      }

      const drone = await Drone.findByPk(drone_id);
      const pilot = await User.findByPk(pilot_id);
      
      if (!drone) {
        return next(ApiError.notFound("Drone not found"));
      }
      if (!pilot) {
        return next(ApiError.notFound("User not found"));
      }

      const flight = await Flight.create({
        drone_id,
        pilot_id,
        route,
        rtmp_url,
        status: "pending",
        altitude,
        purpose,
      });

      return res.json(flight);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const flights = await Flight.findAll({
        include: [
          { model: Drone, attributes: ['id', 'brand', 'model', 'serial'] },
          { model: User, attributes: ['id', 'name', 'phone'] }
        ]
      });
      return res.json(flights);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const flight = await Flight.findOne({
        where: { id },
        include: [
          { model: Drone },
          { model: User }
        ]
      });
      
      if (!flight) {
        return next(ApiError.notFound("Flight not found"));
      }
      
      return res.json(flight);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async approve(req, res, next) {
    try {
      const { id } = req.params;
      
      const flight = await Flight.findOne({ where: { id } });
      if (!flight) {
        return next(ApiError.notFound("Flight not found"));
      }

      let rtsp_url = null;
      if (flight.rtmp_url) {
        try {
          rtsp_url = await createStreamPath(id);
        } catch (error) {
          return next(ApiError.internal("Failed to create video stream"));
        }
      }

      await flight.update({
        status: "approved",
        rtsp_url,
        start_time: new Date()
      });

      return res.json(flight);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async finish(req, res, next) {
    try {
      const { id } = req.params;
      
      const flight = await Flight.findOne({ where: { id } });
      if (!flight) {
        return next(ApiError.notFound("Flight not found"));
      }

      if (flight.rtsp_url) {
        await deleteStreamPath(id);
      }

      await flight.update({
        status: "completed",
        end_time: new Date(),
        rtsp_url: null
      });

      return res.json(flight);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { drone_id, pilot_id, route, status, rtmp_url } = req.body;

      const flight = await Flight.findOne({ where: { id } });
      if (!flight) {
        return next(ApiError.notFound("Flight not found"));
      }

      await flight.update({ drone_id, pilot_id, route, status, rtmp_url, altitude, purpose });
      return res.json(flight);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const flight = await Flight.findOne({ where: { id } });
      
      if (!flight) {
        return next(ApiError.notFound("Flight not found"));
      }

      if (flight.rtsp_url) {
        await deleteStreamPath(id);
      }

      await flight.destroy();
      return res.json({ message: "Flight deleted successfully" });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new FlightController();
