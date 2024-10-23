import React, { useEffect, useState } from "react";
import {
  getCityList,
  getCountryList,
  getStateList,
} from "../AppCore/services/authService";
import { FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";


function GetCountryData({ onCountryChange, onStateChange, onCityChange }: any) {
  const [countryData, setCountryData] = useState([]);
  const [statesData, setstatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cityData, setcityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  //useEffect for CountryData
  useEffect(() => {
    const getCountryListFromApi = async () => {
      try {
        const result = await getCountryList();
        // console.log("response1");
        // console.log(result.data);
        setCountryData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getCountryListFromApi();
  }, []);
  //useEffect for statesData
  useEffect(() => {
    if (selectedCountry) {
      const getStateListFromApi = async () => {
        try {
          const result = await getStateList(selectedCountry);
          // console.log("getStateListFromApi");
          // console.log(result.data);
          setstatesData(result.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      getStateListFromApi();
    }
  }, [selectedCountry]);
  //useEffect for selectedcity
  useEffect(() => {
    if (selectedState) {
      const getCityListFromApi = async () => {
        try {
          const result = await getCityList(selectedState);
          // console.log("getStateListFromApi");
          // console.log(result.data);
          setcityData(result.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      getCityListFromApi();
    }
  }, [selectedState]);
  // console.log(countryData, "countryData");
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="country-label">Select Country</InputLabel>
          <Select
            label="Select Country"
            labelId="country-label"
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              onCountryChange(e.target.value);
            }}
          >
            <MenuItem value="">-- Select Country --</MenuItem>
            {countryData.map((country: any) => (
              <MenuItem key={country?.countryId} value={country?.countryId}>
                {country?.countryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {selectedCountry && (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="state-label">Select State</InputLabel>
            <Select
              label="Select State"
              labelId="state-label"
              id="state"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                onStateChange(e.target.value);
              }}
            >
              <MenuItem value="">-- Select State --</MenuItem>
              {statesData.map((state: any) => (
                <MenuItem key={state.stateId} value={state.stateId}>
                  {state.stateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {selectedState && (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="city-label">Select City</InputLabel>
            <Select
              label="Select City"
              labelId="city-label"
              id="city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                onCityChange(e.target.value);
              }}
            >
              <MenuItem value="">-- Select City --</MenuItem>
              {cityData.map((city: any) => (
                <MenuItem key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}

export default GetCountryData;
