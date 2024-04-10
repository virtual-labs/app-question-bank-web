import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { auth } from './firebaseConfig';
import Avatar from '@mui/material/Avatar';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword,updateEmail,updatePassword} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import Navbar from './Navbar';



const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '50px', // Add margin from the top
  backgroundColor: '#f0f0f0', // Greyish background color
});

const ImageContainer = styled(Box)({
  width: '50%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end', // Align image to the right
  backgroundImage: "url('https://img.pikbest.com/background/20220119/vector-flat-night-sky-stars-scene-advertising-background_6232470.jpg')",
  padding: '20px',
});

const RocketImage = styled('img')({
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  zIndex: '1',
});

const TextOverlay = styled(Box)({
  position: 'absolute',
  top: '10%',
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
  zIndex: '2',
  color: '#fff',
  animation: 'fadeInUp 1s forwards',
});

const FormContainer = styled(Box)({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start', // Align profile info to the left
  padding: '20px',
});

function UserProfilePage({ email, setEmail, password, setPassword }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    showPassword: false,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdateMode(!updateMode); // Toggle update mode
  };

  // const handleChangeEmail = async () => {
  //   console.log(formData.newEmail);
  //   try {
  //     await updateEmail(auth.currentUser, formData.newEmail);
  //     console.log('Email updated successfully');
  //   } catch (error) {
  //     console.log("Error updating email:", error.message);
  //   }
  // };

  const handleInputChange = prop => event => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleChangePassword = async () => {
    try {
      await verifyCredentials(user.email, formData.oldPassword);
      await updatePassword(user, formData.newPassword);
      console.log('Password updated successfully');
      setUpdateMode(false);
      navigate('/login') // Switch back to view mode after updating password
    } catch (error) {
      console.log("Error updating password:", error.message);
    }
  };

  const verifyCredentials = async (email, password) => {
    try {
      // Sign in with the user's email and old password to verify
      await signInWithEmailAndPassword(auth, email, password);
      // If signInWithEmailAndPassword succeeds, credentials are verified
      return Promise.resolve();
    } catch (error) {
      // If signInWithEmailAndPassword fails, throw an error indicating invalid credentials
      alert('Invalid old password');
      throw new Error('Invalid old password');
    }
  };
  

  const changeProfile = async () => {
    // await handleChangeEmail();
    await handleChangePassword();
    navigate('/login');
  };


  return (
    <>
      <Navbar />
      <RootBox>
        <FormContainer>
          {updateMode ? (
            <>
              <Typography variant="h5" gutterBottom>Update Profile</Typography>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="outlined-adornment-old-password">Old Password</InputLabel>
                <Input
                  id="outlined-adornment-old-password"
                  type={formData.showPassword ? 'text' : 'password'}
                  value={formData.oldPassword}
                  onChange={handleInputChange('oldPassword')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="outlined-adornment-new-password">New Password</InputLabel>
                <Input
                  id="outlined-adornment-new-password"
                  type={formData.showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleChangePassword}>
                Save Changes
              </Button>
              <Button variant="outlined" color="primary" onClick={() => setUpdateMode(false)} style={{ marginTop: '10px', color: 'grey' }}>Cancel</Button>
            </>
          ) : (
            <>
            {user && (
  <Avatar
    alt="Profile Photo"
    src={user.photoURL ? user.photoURL : 'default-profile-image-url'}
    sx={{ width: 150, height: 150, marginBottom: 10 }}
  />
)}
              <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                <Box display="flex" alignItems="center" marginBottom={1}>
                  <EmailIcon fontSize="large" style={{ marginRight: 8 } } />
                  {user && (
  <Typography variant="h4" gutterBottom>{user.email}</Typography>
)}
                </Box>
                <Box display="flex" alignItems="center">
                  <MonetizationOnIcon fontSize="large" style={{ marginRight: 8 }} />
                  <Typography variant="h4" gutterBottom>100</Typography>
                </Box>
              </Box>
              <Button variant="contained" color="primary" onClick={() => setUpdateMode(true)}>
                Change Password
              </Button>
            </>
          )}
        </FormContainer>
        <ImageContainer>
          <RocketImage src="https://img.pikbest.com/background/20220119/vector-flat-night-sky-stars-scene-advertising-background_6232470.jpg!sw800" alt="nightsky" />
          <TextOverlay>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>
              Hey User, What's Up?
            </Typography>
          </TextOverlay>
        </ImageContainer>
      </RootBox>
    </>
  );
};

export default UserProfilePage;