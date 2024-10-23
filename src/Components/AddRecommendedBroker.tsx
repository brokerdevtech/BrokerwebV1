import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
// import GetCountryData from "./GetCountryData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleMaps from "./GoogleMaps";
import { useAuth } from "../context/AuthContext";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IOption } from "../AppCore/types/DashboardPost";
import { CATEGORY } from "../pages/Dashboard/constant";

function AddRecommended(props: any) {
  const { user } = useAuth();
  const [errorMsg, seterrorMsg] = useState("");
  const [category, setCategory] = React.useState<IOption | null>(null);

  const [formData, setFormData] = useState({
    userId: props?.selectedRow?.recommendedBrokerId,
    loggedInUserId: user.userId,
    country: "",
    state: "",
    city: "",
    categoryId: 0,
    placeId: "",
    placeName: "",
    geoLocationLatitude: 0,
    geoLocationLongitude: 0,
    viewportNorthEastLat: 0,
    viewportNorthEastLng: 0,
    viewportSouthWestLat: 0,
    viewportSouthWestLng: 0,
    fromDate: "",
    toDate: "",
    brokerageAmount: "",
  });
  const handleCategoryChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "") {
      const data = CATEGORY.filter(
        (item) => item.id === Number(event.target.value)
      );
      console.log('data[0] ====> ', data[0])
      setCategory(data[0]);
      const updateFormData = formData;
      updateFormData.categoryId = Number(data[0].id)
      setFormData({...updateFormData})
    }
  };
  const handleLocationChange = (city: string, state: string, country: string, placeId: string, placeName: string) => {
    const updateFormData = formData;
    updateFormData.country = country
    updateFormData.state = state
    updateFormData.city = city
    updateFormData.placeId = placeId
    updateFormData.placeName = placeName
    setFormData({...updateFormData})
  }

  const handleDateChange = (dateType: string, date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [dateType]: date,
    }));
  };

  const handleBrokerageAmountChange = (amount: string) => {
    setFormData((prevData) => ({
      ...prevData,
      brokerageAmount: amount,
    }));
  };

  const handleClear = () => {
    props.clearModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.country === "" ||
      formData.state === "" ||
      formData.city === ""
    ) {
      seterrorMsg("Please fill all the mandatory fields");
      return;
    }
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);

    if (fromDate < new Date()) {
      if (fromDate.toDateString() === new Date().toDateString()) {
        props.onSubmit(formData);
      } else {
        toast.error("From date should not be less than the present date");
      }
      return;
    }

    if (fromDate > toDate) {
      toast.error("To date should not be less than the from date");
      return;
    }
    toast.success(" Added successfully!");
    props.onSubmit(formData);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <label>
          <strong>Add Recommended Broker</strong>
        </label>
        <ClearIcon style={{ cursor: "pointer" }} onClick={handleClear} />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <FormControl sx={{ minWidth: 435, marginBottom: 1 }} >
            <InputLabel id="Category-label">Select Category</InputLabel>
            <Select
              labelId="Category"
              id="Category"
              value={category !== null ? `${category?.id}` : ""}
              label="Category"
              onChange={handleCategoryChange}
            >
              {CATEGORY.map((item) => (
                <MenuItem value={item.id} disabled={!item.isActive}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <GoogleMaps onLocationChange={handleLocationChange} />
          {/* <GetCountryData
            onCountryChange={handleCountryChange}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
          /> */}
          <div>
            <label>
              <strong>From:</strong>
            </label>
          </div>
          <TextField
            type="date"
            onChange={(e) => handleDateChange("fromDate", e.target.value)}
            required
            fullWidth
          />
          <div>
            <label>
              <strong>To:</strong>
            </label>
          </div>
          <TextField
            type="date"
            onChange={(e) => handleDateChange("toDate", e.target.value)}
            required
            fullWidth
          />
          <div>
            <label>
              <strong>Brokerage Amount:</strong>
            </label>
          </div>
          <TextField
            type="number"
            onChange={(e) => handleBrokerageAmountChange(e.target.value)}
            required
            fullWidth
          />
        </div>

        <div>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </div>
      </form>
      {errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default AddRecommended;
