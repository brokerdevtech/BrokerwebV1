import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Box,
} from "@mui/material";
import Button from "@mui/material/Button";
import { imagesBucketPath } from "../AppCore/services/RecommendedBrokers";

import { Toastify } from "../Components/Ui/taostify";
import ModalPopUp from "../Components/Ui/Modalpopup";
import TablePaginationActions from "../Components/TableAction";
import { ButtonStyles } from "../theme/colors";
import {
  DeActivateSubscriptionUser,
  getSubscriptionUserList,
  ActivateSubscriptionUser,
} from "../AppCore/services/Subscription";

export const SubscriptionUserList = () => {
  const { user } = useAuth();
  const [message, setMessage] = React.useState<string>("");
  const [userList, setUserList] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(100);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<any>("");
  const [showMessage, setShowMessage] = React.useState<boolean>(false);
  const [totalPages, setTotalPages] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const clearModal = () => {
    setOpen(false);
  };

  const handleOpen = (value: boolean, row: any) => {
    setOpen(value);
    const selectedRow = (
      <div>
        <p>Are you sure you want to deactivate {row?.fullName}?</p>
        <Button
          variant="outlined"
          style={ButtonStyles}
          onClick={() => handleDeactivate(row.userId)}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          style={{ ...ButtonStyles, marginLeft: 10 }}
          onClick={() => clearModal()}
        >
          Cancel
        </Button>
      </div>
    );
    setModalContent(selectedRow);
  };

  const handleDeactivate = async (userId: string) => {
    console.log(`User with ID ${userId} has been deactivated.`);

    const result = await DeActivateSubscriptionUser({ userId });

    if (result.status === "error") {
      setMessage(result.error);
    } else {
      setShowMessage(true);
      setMessage(result.statusMessage);
      setOpen(false);
      getUserList(); // Reload data after deactivation
    }
  };

  const getUserList = async () => {
    setLoading(true);
    const result = await getSubscriptionUserList({
      loggedInUserId: user.userId,
      pageNo: page + 1,
      pageSize: pageSize,
    });

    setUserList(result.data?.records);
    setTotalPages(result.data?.totalPages || 0);
    setCount(result.data?.recordCount || 0);
    setLoading(false);
  };

  useEffect(() => {
    getUserList();
  }, [page, pageSize, user.userId]);

  const handleSubmitForm = async (formData: any) => {
    console.log("Form submitted with data:", formData);
    const result = await ActivateSubscriptionUser({
      userId: formData.userId,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      amount: Number(formData.brokerageAmount),
    });

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

  return (
    <div style={{ width: "100%" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Subscription</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList?.map((row: any) => (
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
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      style={{ ...ButtonStyles, marginLeft: "10px" }}
                      onClick={() => handleOpen(true, row)}
                    >
                      Deactivate
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
      )}

      {showMessage && (
        <Toastify
          isOpen={showMessage}
          text={"Deactivate Successfully"}
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
