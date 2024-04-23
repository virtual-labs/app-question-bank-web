import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, updatePassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { styled } from '@mui/system';
import Confetti from 'react-confetti';

const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '50px',
  backgroundColor: '#f0f0f0',
});

const ContentContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  padding: '20px',
  border: '1px solid #ccc', // Add border here
});

const FormContainer = styled(Box)({
  flex: '1',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px',
});

const Heading = styled(Typography)({
  marginBottom: '20px',
});

const ImageContainer = styled(Box)({
  width: '50%',
  position: 'relative',
  overflow: 'hidden',
});

const RocketImage = styled('img')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const TextOverlay = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  zIndex: '2',
  color: '#fff',
});

function UserProfilePage({ setquestions, email, setEmail, password, setPassword, token, setToken }) {
  useEffect(() => {
    setquestions([]);
  }, [setquestions]);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    showPassword: false,
  });
  const [confettiActive, setConfettiActive] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        user.getIdToken().then((token1) => {
          setToken(token1);
        })
      }
      else 
      {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = () => {
    setUpdateMode(!updateMode);
  };

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
      navigate('/login')
    } catch (error) {
      console.log("Error updating password:", error.message);
    }
  };

  const verifyCredentials = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return Promise.resolve();
    } catch (error) {
      alert('Invalid old password');
      throw new Error('Invalid old password');
    }
  };

  const handleConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => {
      setConfettiActive(false);
    }, 5000); // Adjust this value based on the confetti animation duration
  };

  const handleGetAccessToken = async () => {
    try {
      const userToken = await user.getIdToken();
      setToken(userToken);
      navigator.clipboard.writeText(userToken); // Copy token to clipboard
      console.log('Access Token:', userToken);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  };

  return (
    <>
      <Navbar />
      <RootBox>
        <ContentContainer>
          <FormContainer>
            {updateMode ? (
              <>
                <Heading variant="h5">Update Profile</Heading>
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
                  <div onClick={handleConfetti}>
                    {confettiActive && (
                      <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={200}
                        gravity={0.1}
                      />
                    )}
                    <Avatar
                      alt="Profile Photo"
                      src={user.photoURL ? user.photoURL : "cool_smiley.png"}
                      sx={{ width: 150, height: 150, marginBottom: 10 }}
                    />
                  </div>
                )}
                <Box display="flex" flexDirection="column" alignItems="left" marginBottom={2}>
                  <Box display="flex" alignItems="left" marginBottom={1}>
                    <EmailIcon fontSize="large" style={{ marginRight: 8 }} />
                    {user && (
                      <Typography variant="h6" gutterBottom>{user.email}</Typography>
                    )}
                  </Box>
                  <Box display="flex" alignItems="center">
                    <MonetizationOnIcon fontSize="large" style={{ marginRight: 8 }} />
                    <Typography variant="h6" gutterBottom>100</Typography>
                  </Box>
                </Box>
                <Button variant="contained" color="primary" onClick={() => setUpdateMode(true)}>
                  Change Password
                </Button>
                <br></br>
                {/* <Box display="flex" alignItems="center" marginTop={1}> */}
                  <Button id="copy_button" variant="contained" color="primary" onClick={handleGetAccessToken} style={{ marginRight: '10px' }}>
                    Get Access Token
                  </Button>
                  {copied && <Typography id="copied"  color="primary" variant="body2">Copied to clipboard!</Typography>}
                {/* </Box> */}
              </>
            )}
          </FormContainer>
          <ImageContainer>
            <RocketImage src="sky-night-mountains-stars-preview.jpg" alt="nightsky" />
            <TextOverlay>
              <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>
                Hey User, What's Up?
              </Typography>
            </TextOverlay>
          </ImageContainer>
        </ContentContainer>
      </RootBox>
    </>
  );
};

export default UserProfilePage;
