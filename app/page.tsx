"use client";
import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

const geoUrl = "countries-110m.json";

const COLORS = {
  DEFAULT: "#cccccc",
  HOVER: "#4d7332",
  PRESSED: "#507f3a",
};

interface CountryDetails {
  population: number;
  worldPercentage: string;
  system: string;
  algorithm: string;
  flag: string;
}

export default function Home() {
  const [countryData, setCountryData] = useState<
    Record<string, CountryDetails>
  >({});
  const [clientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    setClientRendered(true);
    fetch("/national-id.json")
      .then((response) => response.json())
      .then((data) => setCountryData(data))
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  if (!clientRendered) return null;

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
        <Geographies geography={geoUrl}>
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
                  TransitionComponent={Zoom}
                >
                  <Geography
                    geography={geo}
                    className="cursor-pointer"
                    style={{
                      default: {
                        fill: countryDetails ? "#70ac48" : COLORS.DEFAULT,
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
    </div>
  );
}
