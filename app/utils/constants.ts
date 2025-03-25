export interface CountryDetails {
  population: string;
  worldPercentage: string;
  system: string;
  algorithm: string;
  flag: string;
}
export const COLORS = {
  DEFAULT: "#cccccc", // Default gray for unknown population
  LIGHT_GREEN: "#81C784", // Light green for mid-range population
  MEDIUM_GREEN: "#4CAF50", // Medium green for high population
  DARK_GREEN: "#2E7D32", // Dark green for very high population
  NO_CERT: "#FFCA28", // Yellow for "Issuing but no certificates"
  HOVER: "#4d7332",
  PRESSED: "#507f3a",
};
