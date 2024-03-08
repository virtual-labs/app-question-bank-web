import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { saveAs } from 'file-saver';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Link } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function DownloadList({ downloadList, setDownloadList, setquestions }) {
  const initialTags = [
    { label: 'biology', color: '#26c6da' },
    { label: 'chemistry', color: '#ff7043' },
    { label: 'physics', color: '#9575cd' },
    { label: 'mathematics', color: '#4db6ac' }
  ];
  const removeItem = (index) => {
    const newList = [...downloadList];
    newList.splice(index, 1);
    setDownloadList(newList);
  };
  const downloadQuestions = () => {
    const questions = downloadList.map(item => JSON.stringify(item, null, 2));
    const blob = new Blob([questions.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'questions.txt');
    console.log('Downloading questions:', questions);
  };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update state accordingly
        setIsAuthenticated(true);
      } else {
        // No user is signed in, update state accordingly
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Set loading to false once the check is complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
 }, [navigate]);

 if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
 }

 if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
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
      < Navbar setquestions  = {setquestions}  setDownloadlist = {setDownloadList}/>
      <Card sx={{ margin: 'auto', maxWidth: 600, padding: 2 }}>
        <CardContent style={{ textAlign: 'center' }}>
          <Typography variant="h5">Download List</Typography>
        </CardContent>
        {downloadList.map((item, index) => (
          <Card key={index} style={{ marginBottom: 10 }}>
            <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1">{item.question}</Typography>
              <button
                onClick={() => removeItem(index)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  borderRadius: '50%',
                }}
              >
                <ClearIcon />
              </button>
            </CardContent>
          </Card>
        ))}
        <CardActions style={{ justifyContent: 'center' }}>
          <button onClick={downloadQuestions}>Download Now</button>
        </CardActions>
      </Card>
    </div>
  );
}

export default DownloadList;
