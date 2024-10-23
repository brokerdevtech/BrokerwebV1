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
import { getBrokerList } from "../AppCore/services/BrokerUserServices";

import AddRecommended from "../Components/AddRecommendedBroker";
import {
  imagesBucketPath,
  updateBrokerList,
} from "../AppCore/services/RecommendedBrokers";

import ModalPopUp from "../Components/Ui/Modalpopup";
import TablePaginationActions from "../Components/TableAction";
import { ButtonStyles } from "../theme/colors";

export const BrokerList = () => {
  const { user } = useAuth();
  const [message, setMessage] = React.useState<string>("");
  const [brokerList, setBrokerList] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(100);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<any>("");
  const [showMessage, setShowMessage] = React.useState<boolean>(false); // Adjusted variable name
  const [totalPages, setTotalPages] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const clearModal = () => {
    setOpen(false);
  };

  const handleOpen = (value: boolean, row: any) => {
    setOpen(value);
    const selectedRow = (
      <AddRecommended
        onSubmit={handleSubmitForm}
        selectedRow={row}
        clearModal={clearModal}
      />
    );

    setModalContent(selectedRow);
  };

  useEffect(() => {
    const getBroker = async () => {
      const result = await getBrokerList({
        loggedInUserId: user.userId,
        pageNo: page + 1,
        pageSize: pageSize,
      });

      setBrokerList(result.data?.records);
      setTotalPages(result.data?.totalPages || 0);

      setCount(result.data?.recordCount || 0);
    };
    getBroker();
  }, [page, pageSize, user.userId]);

  const handleSubmitForm = async (formData: any) => {
    console.log("Form submitted with data:", formData);
    const result = await updateBrokerList({...formData});

    if (result.status === "error") {
      setMessage(result.error);
    } else {
      setShowMessage(true);
      setMessage(result.statusMessage);
      setOpen(false);
    }
  };

  const toastClose = () => {
    setShowMessage(false);
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
  console.log(brokerList);
  return (
    <div style={{ width: "100%" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Broker Name</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brokerList?.map((row: any) => (
              <TableRow key={row.userId}>
                <TableCell>
                  {row.profileImage ? (
                    <img
                      src={`${imagesBucketPath}${row.profileImage}`}
                      alt="Profile"
                      style={{
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                      }}
                    />
                  ) : (
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFtmCCXQ1CRqhrCgqONuYChTz9lsJL5Ru1brHzqdoFixY_cUOxIAl9n40FCdtWS_zPSFc&usqp=CAU"
                      alt="Default Profile"
                      style={{
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{row.brokerName}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    style={ButtonStyles}
                    onClick={() => handleOpen(true, row)}
                  >
                    Marked As Recommended
                  </Button>
                </TableCell>
              </TableRow>
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
      </TableContainer>

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

export default BrokerList;
