// server/src/controllers/endpoints/geoController.js
import { CountFakeulaService } from "../../services/countFakeula.js";

export const geoController = {
  /**
   * Get GeoIP information for an IP address
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   */
  getGeoIP: async (req, res) => {
    try {
      const ip = req.params.ip || req.query.ip;
      
      if (!ip) {
        return res.status(400).json({ error: "IP address is required" });
      }

      const geoData = await CountFakeulaService.geoLookup(ip);
      
      if (geoData && geoData.length > 0) {
        res.json({ data: geoData });
      } else {
        res.status(404).json({ data: [] });
      }
    } catch (error) {
      console.error("Error in geoIP controller:", error);
      res.status(500).json({ error: "GeoIP lookup failed" });
    }
  }
};
