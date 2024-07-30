import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import GoogleButton from 'react-google-button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { auth } from '../authentication/FirebaseConfig';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { firebaseConfig, app } from '../authentication/FirebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
});

const ImageContainer = styled(Box)({
  width: '50%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  justifyContent: 'center',
  padding: '20px',
});

const StyledForm = styled('form')({
  width: '100%',
  maxWidth: '400px',
});

const StyledInput = styled('input')({
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
});

const StyledButton = styled(Button)({
  width: '100%',
  padding: '12px',
  margin: '10px 0',
});

function LoginPage({ email, setEmail, password, setPassword, token, setToken, selectedRole, setSelectedRole }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [step, setStep] = useState(1);
  const [rolesChecked, setRolesChecked] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       console.log("Login_Role:", selectedRole);
  //       navigate('/LandingPage');
  //     }
  //     setLoggingIn(false);
  //     setSigningUp(false);
  //   });

  //   return () => unsubscribe();
  // }, [selectedRole]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && step === 1) {
      setStep(2);
      return;
    }

    if (isSignUp && step === 2) {
      if (selectedRole.length === 0) {
        setErrorMessage('Please select at least one role.');
        return;
      }

      setSigningUp(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // console.log("User signed up:", user);

        await setDoc(doc(db, "users", user.uid), {
          email: email,
          role: selectedRole,
        });

        // console.log("Role saved successfully");
        setSigningUp(false);
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setStep(1);
        navigate('/LandingPage');


      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already in use.');
        } else {
          setErrorMessage('Password must be at least 6 characters long.');
        }
        console.log("Error signing up:", error.message);
        setSigningUp(false);
      }
    } else {
      setLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSelectedRole(userData.role);
        navigate('/LandingPage');
      } else {
        setErrorMessage('User not found in the database.');
        console.log('User not found in the database');
        await auth.signOut();
      }
      setLoggingIn(false);
    } catch (error) {
      setErrorMessage('Wrong credentials.');
      console.log("Error signing in:", error.message);
      setLoggingIn(false);
    }
    }
  };

  const handleRoleChange = (role) => {
    if (selectedRole.includes(role)) {
      setSelectedRole(selectedRole.filter(r => r !== role));
    } else {
      setSelectedRole([...selectedRole, role]);
    }
  };

//   const googleSignIn = () => {
//     const provider = new GoogleAuthProvider();
//     const auth1 = getAuth(app);
//     auth1.languageCode = 'en';
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         if (result) {
//           const credential = GoogleAuthProvider.credentialFromResult(result);
//           const token1 = credential.accessToken;
//           setToken(token1);
//         }
//       }).catch((error) => {
//         const errorMessage = error.message;
//         console.log("Google sign-in error:", errorMessage);
//       });
//   };

  return (
    <RootBox>
      <ImageContainer>
        <RocketImage src="https://img.pikbest.com/background/20220119/vector-flat-night-sky-stars-scene-advertising-background_6232470.jpg!sw800" alt="nightsky" />
        <TextOverlay>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>
            Supercharge your learning with the Virtual Labs Question Bank
          </Typography>
        </TextOverlay>
      </ImageContainer>
      <FormContainer>
        <Card sx={{ minWidth: 500, padding: '80px', bgcolor: 'grey.200' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>{isSignUp ? 'Sign Up' : 'Login'}</Typography>
            <StyledForm id="login-form" onSubmit={handleFormSubmit}>
              <StyledInput
                type="email"
                id="login-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                // disabled={step === 2}
              />
              <StyledInput
                type="password"
                id="login-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                // disabled={step === 2}
              />
              {errorMessage && <Alert severity='error' id="error_box_login_signup">{errorMessage}</Alert>}
              {isSignUp && step === 1 && (
                <StyledButton variant="contained" color="primary" onClick={() => setStep(2)}>
                  Next
                </StyledButton>
              )}
              {isSignUp && step === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>Select Role(s)</Typography>
                  <FormControlLabel
                    control={<Checkbox checked={selectedRole.includes('Administrator')} onChange={() => handleRoleChange('Administrator')} />}
                    label="Administrator"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedRole.includes('Contributor')} onChange={() => handleRoleChange('Contributor')} />}
                    label="Contributor"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedRole.includes('Question User')} onChange={() => handleRoleChange('Question User')} />}
                    label="Question User"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedRole.includes('Quiz Participant')} onChange={() => handleRoleChange('Quiz Participant')} />}
                    label="Quiz Participant"
                  />
                </>
              )}
              <StyledButton variant="contained" color="primary" type="submit" disabled={loggingIn || signingUp || (isSignUp && step === 2 && selectedRole.length === 0)}>
                {loggingIn ? 'Logging in...' : (signingUp ? 'Signing up...' : (isSignUp ? 'Sign Up' : 'Login'))}
              </StyledButton>
            </StyledForm>
            <Button onClick={() => { setIsSignUp(!isSignUp); setStep(1); }} disabled={loggingIn || signingUp} id="toggle_login_signup">
              {isSignUp ? 'I already have an account' : 'I don\'t have an account'}
            </Button>
            {/* <GoogleButton id="google" onClick={googleSignIn} /> */}
          </CardContent>
        </Card>
      </FormContainer>
    </RootBox>
  );
}

export default LoginPage;
