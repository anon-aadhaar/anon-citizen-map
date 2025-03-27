"use client";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import { COLORS, CountryDetails } from "./utils/constants";

const geoUrl = "countries-110m.json";

const getCountryColor = (
  countryDetails: CountryDetails | undefined
): string => {
  if (!countryDetails) return COLORS.DEFAULT;

  if (countryDetails.algorithm === "Not publicly specified") {
    return COLORS.YELLOW;
  }

  const population = countryDetails.population;
  if (!population) return COLORS.LIGHT_GREEN;

  let populationNum = parseFloat(population.replace(/[^0-9.]/g, ""));
  if (population.includes("billion")) populationNum *= 1000;
  if (populationNum >= 1000) return COLORS.DARK_GREEN;
  if (populationNum >= 200) return COLORS.MEDIUM_GREEN;
  return COLORS.LIGHT_GREEN;
};

export default function Home() {
  const [countryData, setCountryData] = useState<
    Record<string, CountryDetails>
  >({});
  const [currentCountry, setCurrentCountry] = useState<CountryDetails | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch("/national-id.json")
      .then((response) => response.json())
      .then((data) => setCountryData(data))
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center bg-gray-100">
      <ComposableMap
        projectionConfig={{ center: [14, 6] }}
        width={880}
        height={500}
      >
        <Graticule stroke="#999" strokeWidth={0.2} />
        <Sphere stroke="#fff" strokeWidth={0.1} fill="#ffffff00" id="sphere" />
        <Geographies
          fill="#e1e1e1"
          stroke="#fff"
          strokeWidth={0.3}
          geography={geoUrl}
        >
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const countryDetails = countryData[countryName];

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="cursor-pointer"
                  onMouseEnter={() => setCurrentCountry(countryDetails || null)}
                  onMouseLeave={() => setCurrentCountry(null)}
                  style={{
                    default: {
                      fill: getCountryColor(countryDetails),
                      outline: "none",
                    },
                    hover: { fill: COLORS.HOVER },
                    pressed: { fill: COLORS.PRESSED },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {currentCountry && (
        <div className="absolute bottom-10 right-10 bg-white shadow-lg rounded-md p-3 text-sm text-gray-700">
          {currentCountry.flag && (
            <img
              alt="Country flag"
              src={currentCountry.flag}
              className="w-10 h-6 mb-2 rounded-sm"
            />
          )}
          <div>
            <strong>{currentCountry.system}</strong>
          </div>
          <div>Population: {currentCountry.population}</div>
          <div>World Share: {currentCountry.worldPercentage}</div>
          <div>
            <strong>Algorithm:</strong> {currentCountry.algorithm}
          </div>
        </div>
      )}

      <Grid
        container
        spacing={1}
        className="absolute bottom-2 left-1 bg-opacity-60 p-4 max-w-sm"
      >
        <Grid item xs={12}>
          <h2 className="text-lg font-semibold text-black">
            National Digital ID Systems
          </h2>
        </Grid>
        <Grid item xs={12}>
          <div className="flex items-center">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.DARK_GREEN }}
            ></div>
            <span className="text-sm text-black">
              Very High Population (1B+)
            </span>
          </div>
          <div className="flex items-center mt-2">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.MEDIUM_GREEN }}
            ></div>
            <span className="text-sm text-black">High Population (200M+)</span>
          </div>
          <div className="flex items-center mt-2">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.LIGHT_GREEN }}
            ></div>
            <span className="text-sm text-black">Population below 200M</span>
          </div>
          <div className="flex items-center mt-2">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.YELLOW }}
            ></div>
            <span className="text-sm text-black">
              Algorithm Not Publicly Specified
            </span>
          </div>
          <div className="flex items-center mt-2">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.DEFAULT }}
            ></div>
            <span className="text-sm text-black">No Data Available</span>
          </div>
        </Grid>
      </Grid>

      <div className="absolute bottom-1 right-1 bg-gray-200 bg-opacity-80 rounded-md p-2 text-xs text-gray-700">
        <strong>Note:</strong>{" "}
        <a
          href="https://github.com/anon-aadhaar/anon-citizen-map/blob/main/public/national-id.json"
          target="_blank"
          className="underline text-blue-600"
        >
          Data
        </a>{" "}
        presented is based on available public sources and might not be fully
        complete or verified. If you have updated information or corrections
        about digital ID algorithms in your country, please consider{" "}
        <a
          href="https://github.com/anon-aadhaar/anon-citizen-map/issues/new?template=add-new-country-digital-id-info.md"
          target="_blank"
          className="underline text-blue-600"
        >
          creating a GitHub issue
        </a>
        .
      </div>
    </div>
  );
}
