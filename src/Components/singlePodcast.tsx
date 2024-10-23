import { Button, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useEffect } from "react";
import { GetAWSSignedURL } from "../AppCore/services/awsServices";
import ModalPopUp from "./Ui/Modalpopup";
import { useAuth } from "../context/AuthContext";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { Toastify } from "./Ui/taostify";
import { deletePodcast } from "../AppCore/services/posdcast";
import { imagesBucketPath } from "../AppCore/services/RecommendedBrokers";
import { commonColor } from "../theme/colors";

const SinglePodcast = ({ row, handleOpen }: any) => {
  const title = row.title;
  const { user } = useAuth();
  const capitalTitle = title.charAt(0).toUpperCase() + title.slice(1);
  const [open, setOpen] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState<boolean>(false);
  const [selectedPodcastId, setSelectedPodcastId] = React.useState<
    string | null
  >(null);

  const handleDelete = async () => {
    try {
      if (selectedPodcastId) {
        const deleted = await deletePodcast({
          userId: user.userId,
          podcastId: selectedPodcastId,
        });
        console.log("Podcast deleted successfully");
        window.location.reload();
      }

      setSelectedPodcastId(null);
      setShowMessage(true);
      setOpen(false); 
    } catch (error) {
      console.error("Error deleting podcast", error);
      // Handle the error, you may want to show an error message to the user
    }
  };

  const handleDeleteIconClick = (podcastId: string) => {
    setSelectedPodcastId(podcastId);
    setOpen(true);
  };
  const toastClose = () => {
    setShowMessage(false);
  };
  return (
    <>
      <TableRow className="tableRowHover" style={{ cursor: "pointer" }}>
        <TableCell>
          <img
            src={`${imagesBucketPath}${row?.mediaThumbnail?.split("?")[0]}`}
            style={{ width: "200px", height: "150px" }}
            onClick={() => handleOpen(true, row)}
          />
        </TableCell>
        <TableCell>{capitalTitle}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          <IconButton onClick={() => handleDeleteIconClick(row.podcastId)}>
            <GridDeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {open && (
        <ModalPopUp
          content={
            <div>
              <div>Are you sure you want to delete this podcast?</div>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Button variant="contained" onClick={() => handleDelete()}>
                  Yes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  style={{ marginLeft: 8 }}
                >
                  No
                </Button>
              </div>
            </div>
          }
          isOpen={open}
          handlePopup={() => setOpen(false)}
        />
      )}
      {showMessage && (
        <Toastify
          isOpen={showMessage}
          text={"Podcast Deleted"}
          type="success"
          close={toastClose}
        />
      )}
    </>
  );
};

export default SinglePodcast;
