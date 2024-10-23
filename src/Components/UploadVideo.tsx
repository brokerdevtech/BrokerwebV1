// import { Button, FormControl, Input } from "@mui/material";
import React, { useRef, ChangeEvent, useState } from "react";
import GetCountryData from "./GetCountryData";
// import { Label } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
interface VideoInputProps {
  width: any;
  height: any;
}

const VideoInput: React.FC<VideoInputProps> = ({ width, height }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<string>("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [formData, setFormData] = useState({
    videoTitle: "",
    videoDescription: "",
    countryId: "",
    stateId: "",
    cityId: "",
    sourceUrl: "", // Add sourceUrl to formData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const handleCountryChange = (countryId: any) => {
    setSelectedCountryId(countryId);
    setFormData((prevData) => ({
      ...prevData,
      countryId: countryId,
    }));
  };

  const handleStateChange = (stateId: any) => {
    setSelectedStateId(stateId);
    setFormData((prevData) => ({
      ...prevData,
      stateId: stateId,
    }));
  };

  const handleCityChange = (cityId: any) => {
    setSelectedCityId(cityId);
    setFormData((prevData) => ({
      ...prevData,
      cityId: cityId,
    }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoTitle(event.target.value);

    setFormData((prevData) => ({
      ...prevData,
      videoTitle: event.target.value,
    }));
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVideoTitle(event.target.value);

    setFormData((prevData) => ({
      ...prevData,
      videoDescription: event.target.value,
    }));
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setSource(url);

      setFormData((prevData) => ({
        ...prevData,
        sourceUrl: url,
      }));
    }
  };

  const handleChoose = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleGenerateThumbnail = () => {
    if (source !== undefined) {
      const video = document.createElement("video");
      video.src = source;

      video.addEventListener("loadedmetadata", () => {
        const canvas = document.getElementById(
          "thumbnailCanvas"
        ) as HTMLCanvasElement;

        const context = canvas.getContext("2d");
        if (context) {
          // Capture the first frame of the video
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert the canvas content to a data URL (base64-encoded image)
          const thumbnailDataUrl = canvas.toDataURL("image/png");

          // Use thumbnailDataUrl as needed (e.g., save to state, display, etc.)
          console.log("Thumbnail Data URL:", thumbnailDataUrl);
        } else {
          console.error("Canvas context is null");
        }
      });

      video.addEventListener("error", (error) => {
        console.error("Error loading video:", error);
      });

      video.load();
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          accept=".mov,.mp4"
          style={{ display: "none" }}
        />
        {!source && (
          <center>
            <Button onClick={handleChoose} variant="contained">
              Choose An Video
            </Button>
          </center>
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        {source && (
          <>
            <video
              width="100%"
              height={300}
              src={source}
              controls
              style={{ marginTop: 16 }}
            />
            <canvas
              id="thumbnailCanvas"
              width="300" // Set the width of the canvas
              height="200" // Set the height of the canvas
              style={{ display: "none" }}
            ></canvas>
            <Button
              onClick={handleGenerateThumbnail}
              variant="contained"
              style={{ marginTop: 16 }}
            >
              Generate Thumbnail
            </Button>
          </>
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        {/* <Card> */}
        <CardContent>
          {source && (
            <>
              <TextField
                label="Video Title"
                fullWidth
                variant="outlined"
                value={videoTitle}
                onChange={handleTitleChange}
                style={{ marginBottom: 16 }}
              />
              <TextField
                label="Video Description"
                fullWidth
                variant="outlined"
                value={videoDescription}
                onChange={handleDescriptionChange}
                style={{ marginBottom: 16 }}
              />
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: 16 }}
              >
                Submit
              </Button>
            </>
          )}
        </CardContent>
        {/* </Card> */}
      </Grid>
    </Grid>
  );
};

export default VideoInput;
