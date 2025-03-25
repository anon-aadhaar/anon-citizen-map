"use client";
import React, { useEffect, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import { COLORS, CountryDetails } from "./utils/constants";

const geoUrl = "countries-110m.json";

const getColorByPopulation = (population: string | undefined): string => {
  if (!population) return COLORS.DEFAULT;

  let populationNum = parseFloat(population.replace(/[^0-9.]/g, ""));

  if (population.includes("billion")) populationNum *= 1000;

  if (populationNum >= 1000) return COLORS.DARK_GREEN;
  if (populationNum >= 200) return COLORS.MEDIUM_GREEN;
  if (populationNum >= 50) return COLORS.LIGHT_GREEN;
  return COLORS.NO_CERT;
};

export default function Home() {
  const [countryData, setCountryData] = useState<
    Record<string, CountryDetails>
  >({});
  const [isClient, setIsClient] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState("");

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
        <Sphere
          stroke="#fff"
          strokeWidth={0.1}
          id="sphereline"
          fill="#ffffff00"
        />
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
                <Tooltip
                  key={geo.rsmKey}
                  title={
                    countryDetails ? (
                      <div className="p-2">
                        <h3 className="font-bold">{countryName}</h3>
                        <p>Population: {countryDetails.population}</p>
                        <p>World Share: {countryDetails.worldPercentage}</p>
                        <p>ID System: {countryDetails.system}</p>
                        <p>Signature Algorithm: {countryDetails.algorithm}</p>
                        <img
                          src={countryDetails.flag}
                          alt={`${countryName} flag`}
                          className="w-10 h-6 mt-1"
                        />
                      </div>
                    ) : (
                      <span>{countryName} (Data Unavailable)</span>
                    )
                  }
                  arrow
                >
                  <Geography
                    geography={geo}
                    className="cursor-pointer"
                    // onClick={() => setSelectedCountry(countryName)}
                    style={{
                      default: {
                        fill: getColorByPopulation(countryDetails?.population),
                        outline: "none",
                      },
                      hover: { fill: COLORS.HOVER },
                      pressed: { fill: COLORS.PRESSED },
                    }}
                  />
                </Tooltip>
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Grid
        container
        spacing={1}
        className="absolute bottom-2 left-1  bg-opacity-60 p-4 max-w-sm"
      >
        <Grid item xs={12}>
          <h2 className="text-lg font-semibold text-black">Country Coverage</h2>
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
            <span className="text-sm text-black">
              Moderate Population (50M+)
            </span>
          </div>
          <div className="flex items-center mt-2">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.NO_CERT }}
            ></div>
            <span className="text-sm text-black">
              Issuing but No Certificates
            </span>
          </div>
          <div className="flex items-center mt-2">
            <div
              className="w-8 h-4 mr-2"
              style={{ backgroundColor: COLORS.DEFAULT }}
            ></div>
            <span className="text-sm text-black">No Issuance</span>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
