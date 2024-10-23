import ClearIcon from "@mui/icons-material/Clear";
import { imagesBucketPath } from "../AppCore/services/RecommendedBrokers";

const VideoPopUp = ({ video, clearModal }: any) => {
  const handleClear = () => {
    clearModal();
  };

  const title = video?.title;
  const capitalTitle = title.charAt(0).toUpperCase() + title.slice(1);

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
          <strong>{capitalTitle}</strong>
        </label>
        <ClearIcon
          onClick={handleClear}
          style={{ cursor: "pointer", margin: "10px 0" }}
        />
      </div>
      <video
        src={`${imagesBucketPath}${video?.mediaBlob?.split("?")[0]}`}
        style={{ width: "100%" }}
        controls
        autoPlay
      ></video>
    </div>
  );
};

export default VideoPopUp;
