// server/src/controllers/endpoints/shodanController.js
import { CountFakeulaService } from "../../services/countFakeula.js";

export const shodanController = {
  /**
   * Get Shodan information for an IP
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   */
  getShodan: async (req, res) => {
    try {
      const ip = req.params.ip || req.query.ip;
      
      if (!ip) {
        return res.status(400).json({ error: "IP address is required" });
      }

      const shodanData = await CountFakeulaService.shodanLookup(ip);
      
      if (shodanData && shodanData.length > 0) {
        res.json({ data: shodanData });
      } else {
        res.status(404).json({ data: [] });
      }
    } catch (error) {
      console.error("Error in Shodan controller:", error);
      res.status(500).json({ error: "Shodan lookup failed" });
    }
  }
};