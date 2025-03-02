// server/src/controllers/endpoints/extractController.js
import { CountFakeulaService } from "../../services/countFakeula.js";
import { database } from "../../db/database.js";

export const extractController = {
  /**
   * Extract IOCs from plain text
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   */
  extract: async (req, res) => {
    try {
      // Validate request
      if (req.headers["content-type"] !== "text/plain") {
        return res.status(400).json({ error: "Content-type must be text/plain" });
      }

      const text = req.body.toString();
      const defang = req.query.defang === "1";

      // Call the Count Fakeula service
      const extractedIOCs = await CountFakeulaService.extractIOCs(text, defang);

      // Optionally store in database
      for (const ioc of extractedIOCs) {
        try {
          await database.addIOC({
            type: ioc.threat.indicator.type,
            value: ioc.threat.indicator.description,
            severity: 3, // Default severity
            status: "new",
            source: "extractor",
            notes: `Extracted at ${new Date().toISOString()}`
          });
        } catch (dbError) {
          console.error("Error storing IOC in database:", dbError);
          // Continue processing even if database storage fails
        }
      }

      res.json({ data: extractedIOCs });
    } catch (error) {
      console.error("Error in extract controller:", error);
      res.status(500).json({ error: "IOC extraction failed" });
    }
  }
};
