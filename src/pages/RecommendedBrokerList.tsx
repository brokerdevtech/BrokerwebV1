import React, { useEffect } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import {
  GetKycUserList,
  updateUserKyc,
} from "../AppCore/services/KycUserService";
import ModalPopUp from "../Components/Ui/Modalpopup";
// import Button from "@mui/material/Button";
import { ButtonStyles, commonColor } from "../theme/colors";
import KycStatusForm from "../Components/kycStatusUpdateform";
import { Toastify } from "../Components/Ui/taostify";
import { getBrokerList } from "../AppCore/services/BrokerUserServices";
import { GetAWSSignedURL } from "../AppCore/services/awsServices";
import AddRecommended from "../Components/AddRecommendedBroker";
import {
  deleteRecomendedBrokerList,
  getRecommendedBrokerList,
  imagesBucketPath,
  updateBrokerList,
} from "../AppCore/services/RecommendedBrokers";
import { Button } from "@mui/material";
import UpdateRecommended from "../Components/UpdateRecomendedBroker";

//import CircularProgress from "../Components/loading2"

export const RecommendedBrokerList = () => {
  const { user } = useAuth();
  const [message, setMessage] = React.useState<string>("");
  //const [isLoading, setLoading]= React.useState<boolean>(false);
  const [brokerList, setBrokerList] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setpageSize] = React.useState(100);
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<any>("");
  const [showMessage, setshowMessage] = React.useState<boolean>(false);
  const [profileImage, setProfileImage] = React.useState("");
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedRowForDeletion, setSelectedRowForDeletion] =
    React.useState<any>(null);

  const openDeleteModal = (row: any) => {
    setSelectedRowForDeletion(row);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedRowForDeletion(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      if (!selectedRowForDeletion || !selectedRowForDeletion.userId) {
        console.error(
          "Error: Recommended broker ID not found in the selected row."
        );
        setMessage("An error occurred while deleting the recommended broker.");
        setshowMessage(true);
        return;
      }
      const result = await deleteRecomendedBrokerList({
        recommendedBrokerId: selectedRowForDeletion.recommendedBrokerId,
        loggedInUserId: user.userId,
        userId: selectedRowForDeletion.userId,
      });

      if (result.status === "error") {
        setMessage(result.error);
      } else {
        setshowMessage(true);
        setMessage(result.statusMessage);
        closeDeleteModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting recommended broker:", error);
      setMessage("An error occurred while deleting the recommended broker.");
      setshowMessage(true);
    }
  };

  const clearModal = () => {
    setOpen(false);
  };
  const handleOpen = (value: boolean, row: any) => {
    setOpen(value);
    console.log(row);
    const selectedRow = (
      <UpdateRecommended
        onSubmit={handleSubmitForm}
        selectedRow={row}
        clearModal={clearModal}
      />
    );

    setModalContent(selectedRow);
  };

  useEffect(() => {
    const getBroker = async () => {
      const result = await getRecommendedBrokerList({
        loggedInUserId: user.userId,
        pageNo: page + 1,
        pageSize: pageSize,
      });
      // console.log(result)
      setBrokerList(result.data?.records);
      const extractedProfileImages = result.data?.records.map(
        (row: any) => row.profileImage || ""
      );
      setProfileImage(extractedProfileImages);
    };
    getBroker();
  }, []);
  //   React.useEffect(() => {
  //     const getSignedurl = async () => {
  //       const profileImageUrl = await GetAWSSignedURL(
  //         "profileImage",

  //       );

  //       if (profileImageUrl) {
  //         setProfileImage(profileImageUrl);
  //       }
  //     };
  //     getSignedurl();
  //   }, []);

  //   console.log("bb");
  const columns: GridColDef[] = [
    {
      field: "profileImage",
      headerName: "Image",
      width: 300,

      renderCell: (params) =>
        params.row.profileImage ? (
          <img
            src={`${imagesBucketPath}${params.row.profileImage}`}
            alt="Profile"
            style={{ borderRadius: "50%", width: "45px", height: "45px" }}
          />
        ) : (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFtmCCXQ1CRqhrCgqONuYChTz9lsJL5Ru1brHzqdoFixY_cUOxIAl9n40FCdtWS_zPSFc&usqp=CAU"
            alt="Default Profile"
            style={{ borderRadius: "50%", width: "45px", height: "45px" }}
          />
        ),
    },
    {
      field: "brokerName",
      headerName: "Broker Name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 300,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.brokerName || ""}`,
    },

    {
      field: "countryName",
      headerName: "Country Name",
      width: 300,
    },
    {
      field: "stateName",
      headerName: "State Name",
      width: 300,
    },
    {
      field: "cityName",
      headerName: "City Name",
      width: 300,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      editable: true,
      renderCell: (params) => (
        <>
          {/* <Button
            variant="outlined"
            style={ButtonStyles}
            onClick={() => handleOpen(true, params.row)}
          >
            Edit
          </Button> */}
          <Button
            variant="outlined"
            style={ButtonStyles}
            onClick={() => handleOpen(true, params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            style={{ ...ButtonStyles, marginLeft: 10 }}
            onClick={() => openDeleteModal(params.row)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const handleSubmitForm = async (formData: any) => {
    // Handle form submission here, e.g., send data to the server
    console.log("Form submitted with data:", formData);
    const result = await updateBrokerList({
      recommendedBrokerId: formData.recommendedBrokerId,
      loggedInUserId: user.userId,
      userId: formData.userId,
      countryId: formData.countryId,
      stateId: formData.stateId,
      cityId: formData.cityId,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      brokerageAmount: formData.borkerageAmount,
    });
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
        rows={brokerList}
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
          text={"Sucess"}
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
      {deleteModalOpen && (
        <ModalPopUp
          content={
            <div>
              <p>Are you sure you want to delete?</p>
              <Button onClick={handleDelete}>OK</Button>
              <Button onClick={closeDeleteModal}>Cancel</Button>
            </div>
          }
          isOpen={deleteModalOpen}
          handlePopup={closeDeleteModal}
        />
      )}
    </div>
  );
};
