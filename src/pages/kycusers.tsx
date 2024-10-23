import React, { useEffect } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import {
  GetKycUserList,
  updateUserKyc,
} from "../AppCore/services/KycUserService";
import ModalPopUp from "../Components/Ui/Modalpopup";
import Button from "@mui/material/Button";
import { ButtonStyles, commonColor } from "../theme/colors";
import KycStatusForm from "../Components/kycStatusUpdateform";
import { Toastify } from "../Components/Ui/taostify";

//import CircularProgress from "../Components/loading2"

export const KycUsersList = () => {
  const { user } = useAuth();
  const [message, setMessage] = React.useState<string>("");
  //const [isLoading, setLoading]= React.useState<boolean>(false);
  const [kycLists, setKycLists] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setpageSize] = React.useState(100);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<any>("");
  const [showMessage, setshowMessage] = React.useState<boolean>(false);
  const clearModal = () => {
    setOpen(false);
  };
  const handleOpen = (value: boolean, row: any) => {
    setOpen(value);
    console.log(row);
    const selectedRow = (
      <KycStatusForm
        onSubmit={handleSubmitForm}
        selectedRow={row}
        clearModal={clearModal}
      />
    );

    setModalContent(selectedRow);
  };

  useEffect(() => {
    const getKycUsers = async () => {
      const result = await GetKycUserList(user.userId, page + 1, pageSize);
      // console.log(result)
      if (result.status === "error") {
        setMessage(result.error);
      } else {
        setKycLists(result.data?.kycUserList);
        setMessage("");
      }
    };
    getKycUsers();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    { field: "cityName", headerName: "City", width: 130 },
    { field: "countryName", headerName: "Country", width: 130 },
    { field: "stateName", headerName: "State", width: 130 },
    { field: "reraRegistrationBlob", headerName: "Rera", width: 130 },
    { field: "uidNumberBlob", headerName: "UID Number", width: 130 },
    {
      field: "kycStatus",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = params.value.toString().toLowerCase();
        const cellStyle = {
          color: status === "pending approval" ? "red" : "green",
        };
        console.log(params.value);
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "uid",
      headerName: "Action",
      width: 130,
      renderCell: (params) => {
        const status = params.row.kycStatus.toString().toLowerCase();
        return (
          <>
            {status === "pending approval" && (
              <Button
                variant="outlined"
                style={ButtonStyles}
                onClick={() => handleOpen(true, params.row)}
              >
                Update
              </Button>
            )}
          </>
        );
      },
    },
  ];
  const handleSubmitForm = async (formData: any) => {
    // Handle form submission here, e.g., send data to the server
    console.log("Form submitted with data:", formData);
    const result = await updateUserKyc(
      user.userId,
      formData.userId,
      formData.status,
      formData.description
    );
    console.log(result);
    if (result.status === "error") {
      setMessage(result.error);
    } else {
      setshowMessage(true);
      setMessage(result.statusMessage);
      setOpen(false);
      window.location.reload();
    }
    //
  };
  const toastClose = () => {
    setshowMessage(false);
  };
  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={kycLists}
        getRowId={(row) => row.userId}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: page, pageSize: pageSize },
          },
        }}
      />
      {showMessage && (
        <Toastify
          isOpen={showMessage}
          text={message}
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
