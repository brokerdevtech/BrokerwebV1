// ThumbnailGenerator.js
import {
  Button,
  TextField,
  Grid,
  CircularProgress,
  Modal,
} from "@mui/material";
import React, { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import { useNavigate, useNavigation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { uploadPodcast } from "../AppCore/services/posdcast";
import { ToastContainer, toast } from "react-toastify";
import { GetAWSSignedURL, uploadToS3 } from "../AppCore/services/awsServices";
import { v4 as uuidv4 } from "uuid";
import { ButtonStyles } from "../theme/colors";

const ThumbnailGenerator = () => {
  const [video, setVideo] = useState(null);
  const [videoPath, setVideoPath] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const thumbnailInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [videoFileForUpload, setVideoFileForUpload] = useState(null);
  const [thumbnailFileForUpload, setThumbnailFileForUpload] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log(file);
      setVideoPath(file.path);
      setMediaType(file.type);
      setVideoFileForUpload(file);
      setVideo(URL.createObjectURL(file));
      generateThumbnail(file, 3, 5);
    }
  };

  const generateThumbnail = (videoFile, startTime, endTime) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.currentTime = startTime;

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth / 2;
      canvas.height = video.videoHeight / 2;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnailURL = canvas.toDataURL("image/jpeg");

      // Convert base64 string to Blob
      const base64Data = thumbnailURL.split(",")[1];
      const mimeType = thumbnailURL.split(";")[0].slice(5); // extract mime type
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: mimeType });

      const thumbnailFile = new File([blob], "thumbnail.jpeg", {
        type: mimeType,
      });
      setThumbnail(thumbnailURL);
      setThumbnailFileForUpload(thumbnailFile);

      // You can handle the thumbnail file here as needed
    });

    setTimeout(() => {
      video.pause();
      video.currentTime = 0;
    }, (endTime - startTime) * 1000);
  };

  const handleThumbnailInputChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFileForUpload(file);
    console.log(URL.createObjectURL(e.target.files[0]), "Thumbnail");
    if (file) {
      const imagePath = URL.createObjectURL(file);
      console.log(imagePath);
      const reader = new FileReader();
      console.log(reader);
      reader.onloadend = () => {
        console.log(reader.result);
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openThumbnailInput = () => {
    thumbnailInputRef.current.click();
  };
  const handelTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handelDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const timestamp = Date.now();
      const videoFileName = uuidv4() + "_" + timestamp;
      const thumbnailFileName = uuidv4() + "_" + timestamp;

      const podcastVideo = `podcasts/originals/videos/${videoFileName}_video.mp4`;
      const podcastImage = `podcasts/originals/images/${thumbnailFileName}_thumbnail.jpeg`;

      const videoS3URL = await uploadToS3(
        "broker2023",
        podcastVideo,
        videoFileForUpload,
        mediaType
      );
      console.log(videoS3URL, "uploading video...");
      const thumbnailS3URL = await uploadToS3(
        "broker2023",
        podcastImage,
        thumbnailFileForUpload,
        "image/jpeg"
      );

      const res = await uploadPodcast({
        userId: user.userId,
        title,
        description,
        mediaBlob: podcastVideo,
        mediaThumbnail: podcastImage,
        mediaType,
      });

      if (res.status === "success") {
        toast.success(res.statusMessage);
        setVideo(null);
        setThumbnail(null);
        setTitle("");
        setDescription("");
        setMediaType("");
      }

      console.log("Api ResPonse:- ", podcastVideo, "Image", podcastImage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {video && (
        <Grid item xs={6}>
          {video && (
            <div>
              <h3>Video:</h3>
              <video controls width="100%" src={video} />
            </div>
          )}
          {thumbnail && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <h3>Thumbnail:</h3>
              <img
                src={thumbnail}
                alt="Video Thumbnail"
                style={thumbnailStyle}
              />
              <Button
                variant="outlined"
                style={ButtonStyles}
                onClick={openThumbnailInput}
              >
                Select Thumbnail
              </Button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailInputChange}
                ref={thumbnailInputRef}
              />
            </div>
          )}
        </Grid>
      )}

      {video && (
        <Grid item xs={6}>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Title"
              name="title"
              value={title}
              onChange={handelTitleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={description}
              onChange={handelDescriptionChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Video URL"
              name="mediaBlob"
              value={videoPath}
              //   onChange={}
              fullWidth
              margin="normal"
              required
            />

            <Button type="submit" variant="outlined" style={ButtonStyles}>
              upload
            </Button>
          </form>
        </Grid>
      )}

      {/* Video and Thumbnail on the right side */}

      <Grid item xs={12}>
        {!video && (
          <Dropzone
            onDrop={onDrop}
            accept={{
              "video/*": [
                ".mp4",
                ".mov",
                ".wmv",
                ".avi",
                ".mkv",
                ".flv",
                ".webm",
              ],
            }}
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />

                <p>Drag 'n' drop a video file here, or click to select one</p>
              </div>
            )}
          </Dropzone>
        )}
      </Grid>
      <ToastContainer />
      <Modal
        open={loading}
        onClose={() => setLoading(false)}
        aria-labelledby="loading-modal"
        aria-describedby="loading-modal-description"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
          <p style={{ marginTop: 16, color: "white" }}>Uploading...</p>
        </div>
      </Modal>
    </Grid>
  );
};

const dropzoneStyle = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

const thumbnailStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  margin: "10px 0",
};

export default ThumbnailGenerator;
