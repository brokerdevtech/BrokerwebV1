import React, { useEffect } from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";

import { Toastify } from "../Components/Ui/taostify";

import AddRecommended from "../Components/AddRecommendedBroker";
import {
  imagesBucketPath,
  updateBrokerList,
} from "../AppCore/services/RecommendedBrokers";

import ModalPopUp from "../Components/Ui/Modalpopup";
import { getPodcastList } from "../AppCore/services/GetPodcastList";
import { GetAWSSignedURL } from "../AppCore/services/awsServices";
import SinglePodcast from "../Components/singlePodcast";
import TablePaginationActions from "../Components/TableAction";
import VideoPopUp from "../Components/videoPopUp";
import { useNavigate } from "react-router-dom";
import { ButtonStyles } from "../theme/colors";

export const PodcastList = () => {
  const { user } = useAuth();
  const [message, setMessage] = React.useState<string>("");
  const [podcastList, setPodcastList] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(100);
  const [showMessage, setShowMessage] = React.useState<boolean>(false); // Adjusted variable name
  const [totalPages, setTotalPages] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<any>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedPodcastId, setSelectedPodcastId] = React.useState<
    string | null
  >(null);
  const navigate = useNavigate();
  const clearModal = () => {
    setOpen(false);
  };

  const toastClose = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    const getPodcast = async () => {
      setLoading(true);
      try {
        const result = await getPodcastList({
          userId: user.userId,
          pageNo: page + 1,
          pageSize: pageSize,
        });

        setPodcastList(result.data?.records || []);
        setTotalPages(result.data?.totalPages || 0);
        setCount(result.data?.recordCount || 0);
      } catch (error) {
        console.error("Error fetching podcast list:", error);
      } finally {
        setLoading(false);
      }
    };
    getPodcast();
  }, [page, pageSize, user.userId]);

  const handleOpen = (value: boolean, video: any) => {
    setOpen(value);
    const selectedRow = <VideoPopUp video={video} clearModal={clearModal} />;

    setModalContent(selectedRow);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNavigate = (url: string) => {
    navigate(url, { replace: true });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="outlined"
          style={ButtonStyles}
          onClick={() => handleNavigate("/upload-podcast")}
        >
          Add a new Procast
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TableContainer>
          {podcastList.length === 0 ? (
            <div>No podcasts available. Add some from the button above.</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Podcast Image
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {podcastList?.map((row: any) => (
                  <SinglePodcast
                    key={row.podcastId}
                    row={row}
                    handleOpen={handleOpen}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    colSpan={5}
                    count={count}
                    rowsPerPage={pageSize}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </TableContainer>
      )}

      {showMessage && (
        <Toastify
          isOpen={showMessage}
          text={"Marked as Recommended"}
          type="success"
          close={toastClose}
        />
      )}
      {open && (
        <ModalPopUp
          content={modalContent}
          isOpen={open}
          handlePopup={handleOpen}
        />
      )}
    </div>
  );
};

export default PodcastList;
