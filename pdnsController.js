// server/src/controllers/endpoints/pdnsController.js
import { CountFakeulaService } from "../../services/countFakeula.js";

export const pdnsController = {
  /**
   * Get PDNS information for an IP or domain
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   */
  getPDNS: async (req, res) => {
    try {
      const ipOrHost = req.params.ipOrHost;
      const function_ = req.params.function;
      
      if (!ipOrHost) {
        return res.status(400).json({ error: "IP address or hostname is required" });
      }

      if (function_ && function_ !== "summary") {
        return res.status(400).json({ error: `Invalid URI path /_${function_}` });
      }

      const pdnsData = await CountFakeulaService.pdnsLookup(
        ipOrHost, 
        function_ === "summary"
      );
      
      if (pdnsData && pdnsData.length > 0) {
        res.json({ data: pdnsData });
      } else {
        res.status(404).json({ data: [] });
      }
    } catch (error) {
      console.error("Error in PDNS controller:", error);
      res.status(500).json({ error: "PDNS lookup failed" });
    }
  }
};
