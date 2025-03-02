// server/src/services/countFakeula.js
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create pre-configured axios instance for Count Fakeula API
export const theCount = axios.create({
  baseURL: process.env.COUNT_FAKEULA_URL || "http://localhost:7000",
  auth: {
    username: process.env.COUNT_FAKEULA_USERNAME || "user",
    password: process.env.COUNT_FAKEULA_PASSWORD || "pass",
  },
  timeout: 5000, // 5 second timeout
});

// Service methods for accessing Count Fakeula endpoints
export class CountFakeulaService {
  /**
   * Extract IOCs from plain text
   * @param {string} text - The text to extract IOCs from
   * @param {boolean} defang - Whether to defang the IOCs
   * @returns {Promise<Array>} - Array of extracted IOCs
   */
  static async extractIOCs(text, defang = false) {
    try {
      const url = defang ? "/extract?defang=1" : "/extract";
      const { data } = await theCount.post(url, text, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      return data.data || [];
    } catch (error) {
      console.error("Error extracting IOCs:", error);
      throw error;
    }
  }

  /**
   * Get GeoIP information for an IP address
   * @param {string} ip - The IP address to look up
   * @returns {Promise<Array>} - Array of GeoIP data
   */
  static async geoLookup(ip) {
    try {
      const { data } = await theCount.get(`/geo/${ip}`);
      return data.data || [];
    } catch (error) {
      console.error(`Error looking up GeoIP for ${ip}:`, error);
      throw error;
    }
  }

  /**
   * Get PDNS information for an IP or domain
   * @param {string} query - The IP or domain to look up
   * @param {boolean} summary - Whether to get summary data
   * @returns {Promise<Array>} - Array of PDNS data
   */
  static async pdnsLookup(query, summary = false) {
    try {
      const url = summary ? `/pdns/${query}/_summary` : `/pdns/${query}`;
      const { data } = await theCount.get(url);
      return data.data || [];
    } catch (error) {
      console.error(`Error looking up PDNS for ${query}:`, error);
      throw error;
    }
  }

  /**
   * Get VPN/proxy detection information for an IP
   * @param {string} ip - The IP address to check
   * @returns {Promise<Array>} - Array of VPN data
   */
  static async vpnCheck(ip) {
    try {
      const { data } = await theCount.get(`/vpn/${ip}`);
      return data.data || [];
    } catch (error) {
      console.error(`Error checking VPN status for ${ip}:`, error);
      throw error;
    }
  }

  /**
   * Get Shodan information for an IP
   * @param {string} ip - The IP address to look up
   * @returns {Promise<Array>} - Array of Shodan data
   */
  static async shodanLookup(ip) {
    try {
      const { data } = await theCount.get(`/shodan/${ip}`);
      return data.data || [];
    } catch (error) {
      console.error(`Error looking up Shodan data for ${ip}:`, error);
      throw error;
    }
  }
}