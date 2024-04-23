import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth } from './firebaseConfig';
import Alert from '@mui/material/Alert';
import GoogleButton from 'react-google-button'
import { 
  getAuth,GoogleAuthProvider,signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { firebaseConfig,app } from './firebaseConfig';





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
  backgroundImage: "https://img.pikbest.com/background/20220119/vector-flat-night-sky-stars-scene-advertising-background_6232470.jpg",
  padding: '20px',
});

const NightSky = styled(Box)({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: '0.8',
});

const RocketImage = styled('img')({
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  zIndex: '1',
  // animation: 'propellant 1s infinite alternate',
  // '@keyframes propellant': {
  //   from: { transform: 'translateY(0px)' },
  //   to: { transform: 'translateY(-10px)' }
  // }
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

function LoginPage({email,setEmail,password,setPassword,token,setToken}) 
{
  const navigate = useNavigate();
 
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [authDone,setAuthDone]=useState(false);
  // const [token,setToken]=useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/search');
      }
      setLoggingIn(false);
      setSigningUp(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    console.log(formData);
    setEmail(formData.email);
    setPassword(formData.password);
    // console.log(email);
    if (isSignUp) {
      setSigningUp(true);
      createUserWithEmailAndPassword(auth, email, password)
        .catch((error) => {
          if(error.code === 'auth/email-already-in-use'){
            setErrorMessage('This email already in use. 👀 (error/200)');
          }
          else{
            setErrorMessage('Password must be of minimum 6 characters!');
          }
          console.log("Error signing up:", error.message);
          setSigningUp(false);
        });
    } else {
      setLoggingIn(true);      
      signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
          setErrorMessage('Wrong Credentials');
          console.log("Error signing in:", error.message);
          setLoggingIn(false);
        });
    }
  };


  useEffect(()=>{
    auth.onAuthStateChanged((userCred)=>{
      if(userCred)
      {
        setAuthDone(true);
        userCred.getIdToken().then((token1)=>{
          // console.log(token);
          setToken(token1);
        })
      }
    })
  })





  const googleSignIn=()=>{
    
  const provider=new GoogleAuthProvider();
  const auth1=getAuth(app);
  auth1.languageCode='en';
  signInWithPopup(auth, provider)
  .then((result) => {
    if(result)
    {
    setAuthDone(true);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token1 = credential.accessToken;
    setToken(token1);
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    }
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });


  }


  return (
    <RootBox>
      <ImageContainer>
        <RocketImage src="https://img.pikbest.com/background/20220119/vector-flat-night-sky-stars-scene-advertising-background_6232470.jpg!sw800" alt="nightsky" />
        <TextOverlay>
          <Typography variant="h4" gutterBottom style={{fontWeight: 'bold' }}>
            Supercharge your learning with the Virtual Labs Question Bank
          </Typography>
        </TextOverlay>
      </ImageContainer>
      <FormContainer>
        <div id="modal-login" className="modal">
          <div className="modal-content">
            <Typography variant="h4" gutterBottom>{isSignUp ? 'Sign Up' : 'Login'}</Typography>
            <StyledForm id="login-form" onSubmit={handleFormSubmit}>
              <StyledInput
                type="email"
                id="login-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
              <StyledInput
                type="password"
                id="login-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
              {errorMessage && <Alert severity='error' id="error_box_login_signup">{errorMessage}</Alert>}
              <StyledButton variant="contained" color="primary" type="submit" disabled={loggingIn || signingUp}>
                {loggingIn ? 'Logging in...' : (signingUp ? 'Signing up...' : (isSignUp ? 'Sign Up' : 'Login'))}
              </StyledButton>
            </StyledForm>
            <Button onClick={() => setIsSignUp(!isSignUp)} disabled={loggingIn || signingUp} id="toggle_login_signup">
              {isSignUp ? 'I already have an account' : 'I don\'t have an account'}
            </Button> 
            <GoogleButton id="google" onClick={()=>googleSignIn()}/>
          </div>
        </div>
      </FormContainer>
    </RootBox>
  );
}

// export {email};
export default LoginPage;