import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import MarkdownRenderer from './MarkdownRenderer';
import { Margin, Padding } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {CircularProgress, Container, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { doc, getDoc} from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function API_Documentation({selectedRole, setSelectedRole, setToken}) {
    const [documentation, setDocumentation] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
    useEffect(() => {
        // Function to fetch documentation file
        const fetchDocumentation = async () => {
            try {
                const response = await fetch('api_documentation.md');
                const text = await response.text();
                setDocumentation(text);
            } catch (error) {
                console.error('Error fetching documentation:', error);
            }
        };

        fetchDocumentation();

        return () => {
            // Future developers can add cleanup logic if needed
        };
    }, []);

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

    if (!isAuthenticated) {
        return (
          <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', background: '#ffffff', color: '#333' }}>
              <Typography variant="h6" align="center">Access Restricted</Typography>
              <Typography variant="body1" align="center">Please log in to access this page.</Typography>
              <Box display="flex" justifyContent="center" marginTop="20px">
                <Button variant="contained" color="primary" component={Link} to="/login">
                  Go to Login
                </Button>
              </Box>
            </Paper>
          </Container>
        );
      }

    return (
        <div>
            <Navbar selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
            <div style={{ margin: '20px' }}>
                <MarkdownRenderer source={documentation} />
            </div>
        </div>
    );
}

export default API_Documentation;
