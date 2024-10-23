import * as React from "react";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { BrandImage } from "../../Components/Ui/BrandLogo";
import { Link as MainLink } from "react-router-dom";

import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem"; // Import the ListItem component from Material-UI
import ListItemText from "@mui/material/ListItemText";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { CustomeListItemIcon, mainListItems, secondaryListItems } from "./listItems";
import Logout from "@mui/icons-material/Logout";
import { clearTokens } from "../../utils/utilTokens";
import CircularProgress from "../../Components/loading2";
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';
// const mainListItems = [
//   { text: 'KYC User List', link: '/kycusers' },
//   { text: 'Item 2', link: '/item2' },
//   { text: 'Item 3', link: '/item3' },
// ];
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [openDashBoardMenu, setOpenDashBoardMenu] = React.useState(false);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    setOpenDashBoardMenu(!openDashBoardMenu);
  };

  const openLink = (url: string) => {
    navigate(url, { replace: true });
  };
  const userLogout = async () => {
    const result = await clearTokens();
    navigate("/");
  };
  return (
    <>
      <AppBar
        position="absolute"
        open={open}
        style={{ backgroundColor: "#bc4a50" }}
      >
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            <BrandImage />
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={userLogout} color="inherit">
            <Logout />
          </IconButton>
          {isLoading && <CircularProgress />}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <List component="nav">
          {mainListItems}
          {/* {secondaryListItems} */}

          <ListItemButton onClick={handleClick}>
            <CustomeListItemIcon>
              <DashboardCustomizeIcon />
            </CustomeListItemIcon>
            <ListItemText primary="Manage Dashboard Post" />
            {openDashBoardMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDashBoardMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItemButton sx={{ pl: 4 }} component={MainLink} to="/dashboard/post">
                <CustomeListItemIcon>
                  <ApartmentIcon />
                </CustomeListItemIcon>
                <ListItemText primary="Dashboard Post" />
              </ListItemButton>

              
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
}
