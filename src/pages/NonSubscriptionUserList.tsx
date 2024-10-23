import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Toastify } from "../Components/Ui/taostify";
import {
  getNonSubscriptionUserList,
  ActivateSubscriptionUser,
} from "../AppCore/services/Subscription";
import { imagesBucketPath } from "../AppCore/services/RecommendedBrokers";
import ModalPopUp from "../Components/Ui/Modalpopup";
import TablePaginationActions from "../Components/TableAction";
import { ButtonStyles } from "../theme/colors";
import ActivateSubscription from "../Components/ActivateSubscrition";

export const NonSubscriptionUserList = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [userList, setUserList] = useState<any>([]);
  const [filteredUserList, setFilteredUserList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const clearModal = () => {
    setOpen(false);
  };

  const handleOpen = (value: boolean, row: any) => {
    setOpen(value);
    const selectedRow = (
      <ActivateSubscription
        onSubmit={handleSubmitForm}
        selectedRow={row}
        clearModal={clearModal}
      />
    );

    setModalContent(selectedRow);
  };

  const fetchUserList = async () => {
    const result = await getNonSubscriptionUserList({
      loggedInUserId: user.userId,
      pageNo: 1, // Fetch the first page
      pageSize: 10000, // Set a large page size to fetch all data
    });

    setUserList(result.data?.records);
    setFilteredUserList(result.data?.records);
    setTotalPages(result.data?.totalPages || 0);
    setCount(result.data?.recordCount || 0);
  };
  useEffect(() => {
    fetchUserList();
  }, [user.userId]);

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
      fetchUserList(); // Reload data after form submission
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredData = userList.filter((user: any) =>
        user.fullName.toLowerCase().includes(query)
      );
      setFilteredUserList(filteredData);
    } else {
      setFilteredUserList(userList);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <TextField
        label="Search..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
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
            {filteredUserList
              .slice(page * pageSize, page * pageSize + pageSize)
              .map((row: any) => (
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
                      style={ButtonStyles}
                      onClick={() => handleOpen(true, row)}
                    >
                      Activate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {!searchQuery && (
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
          )}
        </Table>
      </TableContainer>

      {showMessage && (
        <Toastify
          isOpen={showMessage}
          text={"Activate Successfully"}
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
