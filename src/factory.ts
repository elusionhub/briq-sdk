import { Briq } from "./client/BriqClient";
import { getDefaultsFromEnv } from "./config/defaults";
import { validateApiKey } from "./utils/validators";

/**
 * Factory function to create a Briq client instance
 *
 * @returns {Briq} An instance of the Briq client
 * @throws {ConfigurationError} If the API key is not set
 */
export function briq(): Briq {
  const apiKey = getDefaultsFromEnv().apiKey;
  validateApiKey(apiKey);
  return new Briq({
    apiKey,
  });
}
