import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { useNavigate } from 'react-router-dom';

const Navbar = (setquestions, setDownloadList) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async() => {
    // Add code to handle logout (e.g., clearing user data from local storage, redirecting to the login page, etc.)
    // setquestions([]);
    console.log('Logout clicked');
      try {
        const auth = getAuth();
        await signOut(auth);
        console.log('User signed out');
        navigate('/login'); // Redirect to login page after logout
      } catch (error) {
        console.error('Error signing out:', error);
      }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" component={Link} to="/search">
          Search
        </Button>
        <Button color="inherit" component={Link} to="/downloadlist">
          Download List
        </Button>
        <Button color="inherit" component={Link} to="/add">
          Add Question
        </Button>
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar alt="Profile" src="/path/to/profile/image.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem component={Link} to="/login" onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
