import React, { useState } from "react";
import Button from "@mui/material/Button";
import { commonColor } from "../theme/colors";
import FormHelperText from "@mui/material/FormHelperText";
import { GetAWSSignedURL } from "../AppCore/services/awsServices";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ClearIcon from "@mui/icons-material/Clear";
import GetCountryData from "./GetCountryData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalPopUp from "./Ui/Modalpopup";
import GoogleMaps from "./GoogleMaps";
import { useAuth } from "../context/AuthContext";

export const DeleteConfirmationModal = ({
  isOpen,
  handlePopup,
  handleDelete,
}: any) => {
  return (
    <ModalPopUp isOpen={isOpen} handlePopup={handlePopup}>
      <div>
        <p>Are you sure you want to delete?</p>
        <Button onClick={handleDelete}>OK</Button>
        <Button onClick={handlePopup}>Cancel</Button>
      </div>
    </ModalPopUp>
  );
};

function UpdateRecommended(props: any) {
  const { user } = useAuth();
  const [errorMsg, seterrorMsg] = useState("");
  const [formData, setFormData] = useState({
    userId: props?.selectedRow?.recommendedBrokerId,
    loggedInUserId: user.userId,
    country: "",
    state: "",
    city: "",
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
    toast.success("Updated  successfully!");
    props.onSubmit(formData);
  };
  console.log(formData);
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center ",
          justifyContent: "space-between",
          marginBottom: "20px !important",
        }}
      >
        <label>
          <strong>Update Recommended Broker</strong>
        </label>
        <ClearIcon
          style={{ cursor: "pointer", marginBottom: "20px" }}
          onClick={handleClear}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
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
          <input
            type="date"
            onChange={(e) => handleDateChange("fromDate", e.target.value)}
            required
          />
          <div>
            <label>
              <strong>To:</strong>
            </label>
          </div>
          <input
            type="date"
            onChange={(e) => handleDateChange("toDate", e.target.value)}
            required
          />
          <div>
            <label>
              <strong>Brokerage Amount:</strong>
            </label>
          </div>
          <input
            type="number"
            onChange={(e) => handleBrokerageAmountChange(e.target.value)}
            required
          />
        </div>

        <div>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default UpdateRecommended;
