import React from "react";
import VideoInput from "../Components/UploadVideo";
import ThumbnailGenerator from "../Components/VideoThumnail";

function UploadPodcast() {
  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",

        width: "100%",
      }}
    >
      <h1> Upload Podcast</h1>
      {/* <VideoInput width={400} height={300} /> */}
      <ThumbnailGenerator />
    </div>
  );
}

export default UploadPodcast;
