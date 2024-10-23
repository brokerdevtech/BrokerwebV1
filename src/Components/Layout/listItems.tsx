import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  CurrencyRupeeOutlined,
  PeopleAltOutlined,
  Podcasts,
  UploadOutlined,
} from "@mui/icons-material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { styled } from '@mui/system';

export const CustomeListItemIcon = styled(ListItemIcon)({
  minWidth: 32
});

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard">
      <CustomeListItemIcon>
        <DashboardIcon />
      </CustomeListItemIcon>
      <ListItemText primary="KYC User Lists" />
    </ListItemButton>
    <ListItemButton component={Link} to="/brokerlist">
      <CustomeListItemIcon>
        <PeopleAltOutlined />
      </CustomeListItemIcon>
      <ListItemText primary="Broker Lists" />
    </ListItemButton>
    <ListItemButton component={Link} to="/podcastlist">
      <CustomeListItemIcon>
        <Podcasts />
      </CustomeListItemIcon>
      <ListItemText primary="Podcast Lists" />
    </ListItemButton>
    <ListItemButton component={Link} to="/recommended">
      <CustomeListItemIcon>
        <SupervisorAccountIcon />
      </CustomeListItemIcon>
      <ListItemText primary=" Recommended Broker Lists" />
    </ListItemButton>
    <ListItemButton component={Link} to="/upload-podcast">
      <CustomeListItemIcon>
        <UploadOutlined />
      </CustomeListItemIcon>
      <ListItemText primary="Upload Podcast" />
    </ListItemButton>
    <ListItemButton component={Link} to="/non-subcription">
      <CustomeListItemIcon>
        <CurrencyRupeeOutlined />
      </CustomeListItemIcon>
      <ListItemText primary="Non-Subscription Users" />
    </ListItemButton>
    <ListItemButton component={Link} to="subcription">
      <CustomeListItemIcon>
        <CurrencyRupeeOutlined />
      </CustomeListItemIcon>
      <ListItemText primary="Subscription Users" />
    </ListItemButton>
    {/* <ListItemButton component={Link} to="/kycusers">
      <CustomeListItemIcon>
        <PeopleIcon />
      </CustomeListItemIcon>
      <ListItemText primary="KYC User Lists" />
    </ListItemButton> */}
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <CustomeListItemIcon>
        <AssignmentIcon />
      </CustomeListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <CustomeListItemIcon>
        <AssignmentIcon />
      </CustomeListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <CustomeListItemIcon>
        <AssignmentIcon />
      </CustomeListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
