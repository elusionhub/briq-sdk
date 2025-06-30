import "dotenv/config";

export function getDefaultsFromEnv() {
  return {
    apiKey: process.env["BRIQ_API_KEY"] || "",
    senderId: process.env["BRIQ_SENDER_ID"] || "",
    baseUrl: process.env["BRIQ_BASE_URL"] || "https://karibu.briq.tz",
    version: process.env["BRIQ_API_VERSION"] || "v1",
    timeout: parseInt(process.env["BRIQ_TIMEOUT"] || "5000", 10),
  };
}
