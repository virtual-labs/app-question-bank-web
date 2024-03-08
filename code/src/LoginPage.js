import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'; // Update import path for Firebase auth
import { auth } from './firebaseConfig'; // Assuming you have a separate file for Firebase config
import Alert from '@mui/material/Alert';
import DownloadList from './downloadlist';

const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
});

const ImageContainer = styled(Box)({
  width: '66.66%',
  padding: '20px',
});

const ButtonContainer = styled(Box)({
  width: '33.333%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Image = styled('img')({
  width: '100%',
  height: 'auto',
  imageRendering: 'auto', // Ensure image rendering is set to 'auto'
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and sign up

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up successfully
          const user = userCredential.user;
          navigate("/search")
        })
        .catch((error) => {
          const errorMessage = error.message;
          setErrorMessage('Invalid Email / Password');
          console.log("Error signing up:", errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in successfully
          const user = userCredential.user;
          navigate("/search")
        })
        .catch((error) => {
          const errorMessage = error.message;
          setErrorMessage('Wrong Credentials');
          console.log("Error signing up:", errorMessage);
        });
    }
  };

  return (
    <RootBox>
      <ImageContainer>
        <Image
          src="teachers.png"
          alt="placeholder"
        />
      </ImageContainer>
      <ButtonContainer>
        <div id="modal-login" className="modal">
          <div className="modal-content">
            <h4>{isSignUp ? 'Sign Up' : 'Login'}</h4><br />
            <form id="login-form" onSubmit={handleFormSubmit}>
              <div className="input-field">
                <input
                  type="email"
                  id="login-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="login-email">Email address</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="login-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="login-password">Your password</label>
              </div>
              {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
              <Button variant="contained" color="primary" type="submit">
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
            <Button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'I already have an account' : 'I don\'t have an account'}
            </Button>
          </div>
        </div>
      </ButtonContainer>
    </RootBox>
  );
}

export default LoginPage;
