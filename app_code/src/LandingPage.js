import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { doc, getDoc} from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box',
  textAlign: 'center',
});

const ImageContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '20px',
});

const Image = styled('img')({
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
});





const LandingPage = ({ selectedRole, setSelectedRole ,setToken}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
	const auth = getAuth();
	const unsubscribe = onAuthStateChanged(auth, async(user) => {
	if (user) {
		// User is signed in, update state accordingly
		setIsAuthenticated(true);
		user.getIdToken().then((token1)=>{
			// console.log(token);
			setToken(token1);
		  });
		  const userDoc = await getDoc(doc(db, 'users', user.uid));
		  if (userDoc.exists()) {
			const userData = userDoc.data();
			setSelectedRole(userData.role);
		  }
		  else {
			console.error("No user data found!");
			setIsAuthenticated(false);
		  }

	} else {
		// No user is signed in, update state accordingly
		setIsAuthenticated(false);
	}
	setIsLoading(false); // Set loading to false once the check is complete
	});

	return () => unsubscribe();
}, [selectedRole,setSelectedRole,setToken]);






  return (
    <>
      <Navbar selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
      <RootBox>
        <Typography variant="h3" gutterBottom>
          Welcome to the Virtual Labs Question Bank
        </Typography>
        <Typography variant="h6">
          Enhance your learning experience with a comprehensive collection of questions and resources from various experiments.
        </Typography>
        <ImageContainer>
          <Image src="https://thumbs.dreamstime.com/z/tiny-male-female-characters-stand-huge-info-desk-symbol-people-need-information-service-supermarket-bank-exhibition-224118016.jpg?ct=jpeg" alt="Experiments" />
        </ImageContainer>
      </RootBox>
    </>
  );
};

export default LandingPage;
