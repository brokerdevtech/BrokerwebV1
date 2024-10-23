import React, { useEffect, useRef } from "react";
import {
  searchPost,
  listDashboardPost,
  getPostByID,

  addDashboardRealEstate,
  deleteDashboardPost,
} from "../../AppCore/services/DashboardPostServices";
import { useAuth } from "../../context/AuthContext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import CircularProgress from "@mui/material/CircularProgress";
import {
  Properties,
  AddDashboardPostRequest,
  IOption,
  PostData,
  Car,
  Generic,
  ListDashboardPostRequest,
} from "../../AppCore/types/DashboardPost";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Pagination from '@mui/material/Pagination';

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-date-picker";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { format, compareAsc, toDate, parseISO } from "date-fns";
import { CATEGORY, SECTION, DISPLAY_ORDER } from "./constant";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface Pagination {
  totalPage: number
  totalRecord: number
  currentPage: number
}

export const DashboardPost = () => {
  const { user } = useAuth();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [isGlobal, setIsGlobal] = React.useState(false);
  const [postList, setPostList] = React.useState<Properties[]>([]); // AddDashboardPostRequest Later Set
  const [postData, setPostData] = React.useState<PostData[]>([]);
  const [postSearchKeyword, setPostSearchKeyword] = React.useState<string>('');
  const [pagination, setPagination] = React.useState<Pagination>({totalPage: 0, totalRecord: 0, currentPage: 1});
  
  const [dashboardPost, setDashboardPost] = React.useState<
    AddDashboardPostRequest[]
  >([]);
  const [checkedOption, setCheckedOption] = React.useState([0]);
  const [section, setSection] = React.useState<IOption | null>(null);
  const [category, setCategory] = React.useState<IOption | null>(null);
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const locationRef = useRef<HTMLInputElement>(null);

  const [fromDate, onChangeFromDate] = React.useState<Value>(new Date());
  const [toDate, onChangeToDate] = React.useState<Value>(new Date());
  const [selectedOption, setSelectedOption] = React.useState<number>(0);
  const [order, setOrder] = React.useState<number>(0);
  const [marqueue, setMarqueue] = React.useState<string>("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");

  const handleSectionChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "") {
      const data = SECTION.filter(
        (item) => item.id === Number(event.target.value)
      );
      setLocation("");
      if (locationRef.current) {
        locationRef.current.value = "";
      }

      setSection(data[0]);
      setCategory(null);
    }
  };


  const handleClose = () => {
    setSelectedOption(0);
    onChangeFromDate(new Date());
    onChangeToDate(new Date());
    setError("")
    setOpen(false);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "") {
      const data = CATEGORY.filter(
        (item) => item.id === Number(event.target.value)
      );
      setLocation("");
      if (locationRef.current) {
        locationRef.current.value = "";
      }
      setCategory(data[0]);
    }
  };

  const selectSave = (postId: number) => {
    setSelectedOption(postId);
    setOpen(true);
  };

  const handleAdd = async () => {
    setLoading(true);
    let getFromDate = "";
    let getToDate = "";
    if (fromDate instanceof Date) {
      getFromDate = fromDate.toISOString().split("T")[0];
    }
    if (toDate instanceof Date) {
      getToDate = toDate.toISOString().split("T")[0];
    }
    if (selectedOption > 0) {
      const getRealEstate = postData.filter(
        (prop: any) => prop.postId === selectedOption
      );

      let request: AddDashboardPostRequest = {
        postId: 0,
        displayOrder: 0,
        categoryId: 0,
        price: 0,
        title: "",
        isBrokerAppVerified: true,
        cityName: "",
        stateName: "",
        countryName: "",
        placeName: "",
        placeID: "",
        userId: 0,
        email: "",
        contactNo: "",
        postMedias: [
          {
            mediaBlobId: "",
          },
        ],
      };

      request.postId = selectedOption;
      request.displayOrder = order;
      request.fromDate = getFromDate;
      request.toDate = getToDate;
      request.categoryId = category?.id ?? 0;

      request.email = email;
      request.contactNo = mobile;
      
      if (section?.id === 1) {
        request.marqueueText = marqueue;
      } else if (section?.id === 3) {
        request.searchText = getRealEstate[0].title;
      } else {
        request.price = getRealEstate[0].price ?? 0;
        request.title = getRealEstate[0].title;
        request.isBrokerAppVerified = getRealEstate[0].isBrokerAppVerified;
        if (getRealEstate[0].postMedias !== undefined) {
          request.postMedias = getRealEstate[0].postMedias;
        }
      }

      request.cityName = getRealEstate[0].cityName;
      request.stateName = getRealEstate[0].stateName;
      request.countryName = getRealEstate[0].countryName;

      request.placeName = getRealEstate[0].placeName;
      request.placeID = getRealEstate[0].placeID;
      request.userId = user.userId;
      request.geoLocationLatitude = 0;
      request.geoLocationLongitude = 0;
      request.viewportNorthEastLat = 0;

      request.viewportNorthEastLng = 0;
      request.viewportSouthWestLat = 0;
      request.viewportSouthWestLng = 0;
      request.isGlobal = isGlobal
      if (section?.endpoint !== undefined) {
        let response = await addDashboardRealEstate(section?.endpoint, request);
         
        if(response?.status === "error") {
          console.log("Response ===> ", response?.status)
          setError(response?.error)
        } else {
          setEmail("");
          setMobile("");
          setIsGlobal(false);
          await searchDashboardPostByCity(request.cityName);
          setOpen(false);
        }
        setLoading(false);
      }
    }
  };

  const deletePost = async (postId: number) => {
    if(section?.endpoint !== undefined &&  category !==null) {
      let deletePost = await deleteDashboardPost(section?.endpoint, user.userId,postId, category.id)
      if(deletePost.status === 'success') {
        let postlist = await searchDashboardPostByCity(location)
      }
    }
  };

  const searchDashboardPostByCity = async (cityName: string) => {
   
    setLoading(true);
    await getPostByID();
    if (section?.endpoint !== undefined) {
      let req: ListDashboardPostRequest = {
        pageNo: 1,
        pageSize: 20,
        cityName: cityName,
      };
      if (section.id === 4 && category !== null) {
        //'New In'
        req = {
          pageNo: 1,
          pageSize: 20,
          cityName: cityName,
          categoryId: category.id,
        };
      }

      let listPost = await listDashboardPost(section?.endpoint, req);
      if (listPost.data.posts.length > 0) {
        const postData = listPost.data.posts.sort((a: AddDashboardPostRequest, b: AddDashboardPostRequest) => a.displayOrder - b.displayOrder);

        setDashboardPost([...postData]);
      }
    }
    setLoading(false);
  };

  const searchPosts = async (cityName: string, pageNumber: number) => {
    const userId = user.userId;
    const keyWord = cityName;
    const pageSize = 20;
    const placeName = "";
    const request = { userId, keyWord, pageNumber, pageSize, placeName };
    if (category !== null) {
      let response = await searchPost(category.endpoint, request);
      setLoading(false);
      if (response.data.posts !== undefined && response.data.posts.length > 0) {
        if(pagination.totalPage === 0 && response.data.totalPages > 1) {
          setPagination({totalPage: response.data.totalPages, totalRecord: response.data.recordCount, currentPage: 1})
        }


        let postDataList: PostData[] = [];

        response.data.posts.forEach((item: any) => {
          let city = "";
          let state = "";
          let country = "";
          let placeName = "";
          if (item.location === undefined) {
            const place = item.placeName.split(",");
            city = place[0].trim();
            state = place[1].trim();
            country = place[2].trim();
            placeName = item.placeName;
          } else {
            city = item.location.cityName;
            state = item.location.stateName;
            country = item.location.countryName;
            placeName = item.location.placeName;
          }

          if (category.id === 1) {
            postDataList.push({
              postId: item.postId,
              heading: `${item.title}`,
              description: `${placeName}`,
              cityName: city,
              stateName: state,
              countryName: country,
              price: item.price !== undefined ? item.price : 0,
              isBrokerAppVerified:
                item.isBrokerAppVerified !== undefined
                  ? item.isBrokerAppVerified
                  : false,
              title: item.title !== undefined ? item.title : "",
              placeName: placeName,
              placeID: item.placeID !== undefined ? item.placeID : "",
              postMedias: item.postMedias !== undefined ? item.postMedias : [],
            });
          } else if (category.id === 2) {
            postDataList.push({
              postId: item.postId,
              heading: `${item.title} | Price : ${item.price} | Fuel Type : ${item.fuelType}`,
              description: `${placeName}`,
              cityName: city,
              stateName: state,
              countryName: country,
              price: item.price !== undefined ? item.price : 0,
              isBrokerAppVerified:
                item.isBrokerAppVerified !== undefined
                  ? item.isBrokerAppVerified
                  : false,
              title: item.title !== undefined ? item.title : "",
              placeName: placeName,
              placeID: item.placeID !== undefined ? item.placeID : "",
              postMedias: item.postMedias !== undefined ? item.postMedias : [],
            });
          } else {
            let title = "";
            if (item.hasOwnProperty("keyWord")) {
              title = item.keyWord;
            } else {
              title = item.title;
            }
            postDataList.push({
              postId: item.postId,
              heading: `${title}`,
              description: `${placeName}`,
              cityName: city,
              stateName: state,
              countryName: country,
              price: item.price !== undefined ? item.price : 0,
              isBrokerAppVerified:
                item.isBrokerAppVerified !== undefined
                  ? item.isBrokerAppVerified
                  : false,
              title: item.title !== undefined ? item.title : "",
              placeName: placeName,
              placeID: item.placeID !== undefined ? item.placeID : "",
              postMedias: item.postMedias !== undefined ? item.postMedias : [],
            });
          }
        });
        setPostList([...response.data.posts]);
        setPostData([...postDataList]);
      }else {
        setPostList([]);
        setPostData([]);
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination({totalPage: pagination.totalPage, totalRecord: pagination.totalRecord, currentPage: value})
    searchPosts(postSearchKeyword, value)
  };

  const handleDashboardPostByCity = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      searchCityKeywords: HTMLInputElement;
    };
    setLocation(formElements.searchCityKeywords.value);
    const responseDashboardPost = await searchDashboardPostByCity(formElements.searchCityKeywords.value);
    const responsePost = await searchPosts(formElements.searchCityKeywords.value, pagination.currentPage);
    setPostSearchKeyword(formElements.searchCityKeywords.value)
    setPagination({totalPage: 0, totalRecord: 0, currentPage: 1})
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      searchKeywords: HTMLInputElement;
    };
    setPostSearchKeyword(formElements.searchKeywords.value)
    const responseDashboardPost = await searchDashboardPostByCity(formElements.searchKeywords.value);
    const responsePost = await searchPosts(formElements.searchKeywords.value, pagination.currentPage);
    setPagination({totalPage: 0, totalRecord: 0, currentPage: 1})
  };

  const handleToggle = (value: number) => () => {
    const currentIndex = checkedOption.indexOf(value);
    const newChecked = [...checkedOption];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedOption(newChecked);
  };

  return (
    <div style={{ width: "100%", height: "85vh" }}>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Manage Dashboard
          </Link>
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/dashboard"
          >
            <ApartmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            New In Real Estate
          </Link>
        </Breadcrumbs>
      </div>

      <div style={{ marginTop: 40, display: "flex" }}>
        <FormControl sx={{ mt: 1, minWidth: 300 }} size="small">
          <InputLabel id="Section-label">Select Section</InputLabel>
          <Select
            labelId="Section"
            id="Section"
            value={section !== null ? `${section?.id}` : ""}
            label="Section"
            onChange={handleSectionChange}
          >
            {SECTION.map((item) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
          <InputLabel id="Category-label">Select Category</InputLabel>
          <Select
            labelId="Category"
            id="Category"
            value={category !== null ? `${category?.id}` : ""}
            label="Category"
            onChange={handleCategoryChange}
          >
            {CATEGORY.map((item) => (
              <MenuItem value={item.id} disabled={!item.isActive}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 300,
            height: 40,
            m: "8px 10px ",
          }}
          onSubmit={handleDashboardPostByCity}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            name="searchCityKeywords"
            placeholder="Search Dashboard Post By City"
            inputProps={{ "aria-label": "search property" }}
            defaultValue={location}
            inputRef={locationRef}
          />
          {!isLoading ? (
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          ) : (
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <CircularProgress size="30px" />
            </IconButton>
          )}
        </Paper>
      </div>

      <div style={{ marginTop: 20, display: location === "" ? "none" : "" }}>
        <div
          style={{
            marginTop: 40,
            height: 600,
            width: "100%",
            display: "flex",
            gap: 40,
          }}
        >
          <div
            style={{
              width: 500,
              background: "#F5F5F5",
              padding: 20,
              borderRadius: 15,
              overflowY: "scroll",
            }}
          >
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 460,
              }}
              onSubmit={onSubmit}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                name="searchKeywords"
                placeholder="Search By Keyword"
                inputProps={{ "aria-label": "Search By Keyword" }}
              />
              {!isLoading ? (
                <Button
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </Button>
              ) : (
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <CircularProgress size="30px" />
                </IconButton>
              )}
            </Paper>
            <List
              sx={{
                width: "100%",
                maxWidth: 500,
                mt: 2,
                bgcolor: "background.paper",
              }}
              component="nav"
            >
              {postData.length === 0 && (
                <ListItem>
                  <ListItemText primary="No Record Found" />
                </ListItem>
              )}
              {postData.map((item, index) => {
                const labelId = `checkbox-list-secondary-label-${item.postId}`;
                return (
                  <ListItem
                    key={`${item.postId}_${index}`}
                    disablePadding
                    divider
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(item.postId)}
                      dense
                    >
                      <ListItemIcon style={{ minWidth: 0 }}>
                        <Checkbox
                          edge="start"
                          checked={checkedOption.indexOf(item.postId) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={item.heading}
                        secondary={`${item.description}`}
                      />
                    </ListItemButton>
                    {checkedOption.indexOf(item.postId) !== -1 && (
                      <ListItemIcon
                        style={{ minWidth: 0, paddingRight: 5, paddingLeft: 5 }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => selectSave(item.postId)}
                          endIcon={<ControlPointIcon />}
                        >
                          Add
                        </Button>
                      </ListItemIcon>
                    )}
                  </ListItem>
                );
              })}
            </List>
            
          </div>
           
          <div
            style={{
              width: 500,
              height: 600,
              background: "#F5F5F5",
              padding: 20,
              borderRadius: 15,
            }}
          >
            <List
              sx={{
                width: "100%",
                maxWidth: 500,
                mt: 2,
                bgcolor: "background.paper",
              }}
              component="nav"
            >
              {dashboardPost.length === 0 && (
                <ListItem>
                  <ListItemText primary="No Record Found" />
                </ListItem>
              )}
              {dashboardPost.map((item, index) => {
                const labelId = `dashboardPost-label-${item.title}`;
                return (
                  <ListItem
                    key={`dashboardPost_${item.postId}_${index}`}
                    disablePadding
                    divider
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => deletePost(item.postId)}
                      dense
                    >
                      <ListItemIcon style={{ minWidth: 0 }}>
                        <IconButton
                          type="button"
                          sx={{ p: "10px" }}
                          aria-label="delete"
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={item.hasOwnProperty("marqueueText") ? item.marqueueText : item.hasOwnProperty("searchText") ? item.searchText : item.title}
                        secondary={`Display Order : ${item.displayOrder} | Place : ${item.stateName} ${item.cityName} | From Date ${format(parseISO(item.fromDate ?? ""), "MM/dd/yyyy")} | To Date ${format(parseISO(item.toDate ?? ""), "MM/dd/yyyy")}`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </div>
          
        </div>
        <div>
          {pagination.totalPage > 1 && (
              <Stack spacing={2} sx={{ mt: 2}}>
                <Pagination count={pagination.totalPage} page={pagination.currentPage} onChange={handlePageChange} color="primary" />
              </Stack>
            )}
          </div>
      </div>

      {/*  Start Dailog Box */}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add {category?.name}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers style={{ height: 400, width: 600 }}>
        {error !== '' && (
              <Stack sx={{ width: '100%', marginBottom: 2}} spacing={2}>
                 <Alert variant="filled" severity="error">{error}</Alert>
              </Stack>

            )}
          <div style={{ display: "flex", gap: 20 }}>
            
            <div>
              <label>Display Order:</label> <br />
              <select
                name="position"
                style={{ height: 30 }}
                onChange={(event) => setOrder(Number(event.target.value))}
              >
                <option value="0">-Select Display Order-</option>
                {DISPLAY_ORDER.map((pos) => (
                  <option value={`${pos}`}>{pos}</option>
                ))}
              </select>
            </div>
            <div>
              <label>From Date:</label> <br />
              <DatePicker onChange={onChangeFromDate} value={fromDate} />
            </div>
            <div>
              <label>To Date:</label> <br />
              <DatePicker onChange={onChangeToDate} value={toDate} />
            </div>
          </div>
          <div
              style={{
                display: "flex",
                flexFlow: "column",
                gap: 20,
                marginTop: 20,

              }}
            >
              <div>
                   <label>Show Global: <input type="checkbox" name="isGlobal" defaultChecked={isGlobal} onChange={() => setIsGlobal((state) => !state)} /></label> 
              </div>
            </div>
            <div style={{ display: "flex", flexFlow: "column", marginTop: 10 }}>
              <div>
                <label>Email Id:</label>
              </div>
              <div>
                <input name="email" style={{ width: 300, height: 30 }} onChange={(event) => setEmail(event.target.value)} />
              </div>
            </div>
            <div style={{ display: "flex", flexFlow: "column", marginTop: 10 }}>
              <div>
                <label>Mobile Number:</label>
              </div>
              <div>
                <input name="mobileNumber" style={{ width: 300, height: 30}} onChange={(event) => setMobile(event.target.value)} />
              </div>
            </div>
            
          {section?.id === 1 && (
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                marginTop: 20,
              }}
            >
              <div>
                <label>Marqueue Text:</label>
              </div>
              <div>
                <textarea
                  name="marqueue"
                  rows={4}
                  cols={80}
                  onChange={(event) => setMarqueue(event.target.value)}
                ></textarea>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {isLoading ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<CircularProgress size="18px" />}
            >
              Loading
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAdd}
            >
              Add {section?.name} {category?.name}
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>

      {/*  End Dailog Box */}
    </div>
  );
};

export default DashboardPost;
