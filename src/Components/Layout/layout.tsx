import * as React from 'react';
import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar'; // Import your Sidebar component
// import Header from './Header';   // Import your Header component
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

const defaultTheme = createTheme();

const DashboardLayout = () => {
  // console.log(children);
    const {user} = useAuth();
    if (!user) {
      // user is not authenticated
      return <Navigate to="/" />;
    }
  return (
    <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
            >
            <Toolbar />
            <Container maxWidth="xl" sx={{pt:4, pb:4, mb: 4, mt: 1, background:'#ffffff' }}>
                <Outlet />
            </Container>
        </Box>
        </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;