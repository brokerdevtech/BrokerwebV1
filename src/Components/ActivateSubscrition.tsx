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
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";

function ActivateSubscription(props: any) {
  const [errorMsg, seterrorMsg] = useState("");
  const [formData, setFormData] = useState({
    userId: props?.selectedRow?.userId,
    fromDate: "",
    toDate: "",
    amount: "",
  });

  const handleDateChange = (dateType: string, date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [dateType]: date,
    }));
  };

  const handleAmountChange = (amount: string) => {
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center ",
          justifyContent: "space-between",
        }}
      >
        <label>
          <strong>Activate Subscription </strong>
        </label>
        <ClearIcon style={{ cursor: "pointer" }} onClick={handleClear} />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <div>
            <label>
              <strong>From:</strong>
            </label>
          </div>
          <TextField
            style={{ padding: 10, borderRadius: "5px" }}
            type="date"
            onChange={(e) => handleDateChange("fromDate", e.target.value)}
            required
          />
          <div>
            <label>
              <strong>To:</strong>
            </label>
          </div>
          <TextField
            style={{ padding: 10, borderRadius: "5px" }}
            type="date"
            onChange={(e) => handleDateChange("toDate", e.target.value)}
            required
          />
          <div>
            <label>
              <strong>Amount:</strong>
            </label>
          </div>
          <TextField
            style={{ padding: 10, borderRadius: "5px" }}
            type="number"
            onChange={(e) => handleAmountChange(e.target.value)}
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

export default ActivateSubscription;
