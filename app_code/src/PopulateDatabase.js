import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import Navbar from './Navbar';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {Container , Paper} from '@mui/material';

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

const FormBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
});

const PopulateDatabasePage = ({ selectedRole, setSelectedRole, setToken,token }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [githubLink, setGithubLink] = useState('');
    const [fileContents, setFileContents] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) 
            {
                setIsAuthenticated(true);
                const token1 = await user.getIdToken();
                setToken(token1);
                console.log(token1);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setSelectedRole(userData.role);
                } else {
                    console.error("No user data found!");
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [setSelectedRole, setToken]);

    const handleFetchFile = async () => {
        console.log(githubLink);
        try {
            const proxyUrl = `https://vlabs-question-bank.el.r.appspot.com/fetch-github-file?url=${encodeURIComponent(githubLink)}`;
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFileContents(data);
            // console.log(data);
            
            // Send the fetched file contents to your backend
            // console.log(token);
            // const apiUrl = 'http://localhost:3001/api/questions'; // Update with your backend API URL
            // const requestOptions = {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`,
            //     },
            //     body: JSON.stringify(data),
            // };
            // const postResponse = await fetch(apiUrl, requestOptions);
            // if (!postResponse.ok) {
            //     throw new Error('Error sending data to backend');
            // }
            // const postData = await postResponse.json();
            // console.log('Data sent to backend:', postData);
        } catch (error) {
            console.error('Error fetching the GitHub file or sending data to backend:', error);
        }
    };

    if (!selectedRole.includes("Administrator") ) {
        return (
          <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
              <Typography variant="h6" align="center">Access Restricted</Typography>
              <Typography variant="body1" align="center">You do not have the necessary permissions to submit a question.</Typography>
            </Paper>
          </Container>
        );
      }


    return (
        <>
            <Navbar selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            <RootBox>
                <Typography variant="h4" gutterBottom>
                    Populate Database
                </Typography>
                <Typography variant="h6">
                    Enter the GitHub repository link to fetch and populate the database with questions.
                </Typography>
                <FormBox>
                    <TextField
                        label="GitHub Repository Link"
                        variant="outlined"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleFetchFile}>
                        Fetch File
                    </Button>
                </FormBox>
                {fileContents && (
                    <Box mt={4}>
                        <Typography variant="body1">
                            File Contents: {JSON.stringify(fileContents)}
                        </Typography>
                    </Box>
                )}
            </RootBox>
        </>
    );
};

export default PopulateDatabasePage;
