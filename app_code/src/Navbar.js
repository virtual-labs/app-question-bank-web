import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { useNavigate } from 'react-router-dom';
import { alignProperty } from '@mui/material/styles/cssUtils';
import "./App.css";

const SciFiAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0a192f', // Dark blue
  boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.2)', // Shadow effect
}));

const Navbar = (
  {setQuestions}
) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async() => {
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

  function giveNameBasedOnScreenWidth(name){
    
    if(window.innerWidth < 500){
      return '';
    }
    else{
      return 
    }
  }

  const jumpToProfile = () => {
    navigate('/profile');
  }
  const jumpToAPIDocumentation = () => {
    navigate('/api_documentation');
  }

  return (
    <SciFiAppBar position="static">
      <Toolbar>
      <Avatar alt="Logo" src="favicon.png" sx={{ mr: 1 }}/>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Arial' }}>
        Virtual Labs
      </Typography>
        <Button color="inherit" startIcon={<SearchIcon />} component={Link}  to="/search" id="search_button_navbar" className='search-button'>
        <span className="search-button-text-navbar">Search</span>
        </Button>
        <Button color="inherit" startIcon={<CloudDownloadIcon />} component={Link} to="/downloadlist" id="downloadlist_button_navbar">
        <span className="download-button-text-navbar">Download List</span>
        </Button>
        <Button color="inherit" startIcon={<AddIcon />} component={Link} to="/add" id="add_button_navbar">
        <span className="add-button-text-navbar">Add Question</span>
        </Button>
        <IconButton id="mini_bar" color="inherit" onClick={handleMenuOpen}>
          <Avatar alt="Profile" src="https://i.pinimg.com/736x/8e/05/80/8e058090929d8adac87c6dbd5c0947e2.jpg" />
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
          <MenuItem id="profile_option" onClick={jumpToProfile}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem id="api_button" onClick={jumpToAPIDocumentation}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>API Docs</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem id="logout" onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </SciFiAppBar>
  );
};

export default Navbar;
