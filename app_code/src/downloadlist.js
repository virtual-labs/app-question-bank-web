import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { saveAs } from 'file-saver';
import Navbar from './Navbar';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Link } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {auth} from './firebaseConfig'

function DownloadList({ downloadList, setDownloadList, setquestions ,token,setToken}) {

  useEffect(()=>{
    setquestions([]);
  },[setquestions]);
  // setquestions([]);
  // useEffect(()=>{
  //   auth.onAuthStateChanged((userCred)=>{
  //     if(userCred)
  //     {
  //       // setAuthDone(true);
  //       userCred.getIdToken().then((token1)=>{
  //         // console.log(token);
  //         setToken(token1);
  //       })
  //     }
  //   })
  // })


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
    saveAs(blob, 'questions.json');
    console.log('Downloading questions:', questions);
  };

  // const onQuestionSelect = ({ index }) => {
  //   navigate(`/quiz/${index}`);
  // };


  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update state accordingly
        setIsAuthenticated(true);

              user.getIdToken().then((token1)=>{
          // console.log(token);
          setToken(token1);
        })

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
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar setQuestions={setquestions} setDownloadList={setDownloadList} />
      <Card sx={{ margin: 'auto', maxWidth: 600, padding: 2, background: '#ffffff', color: '#333' }}>
        <CardContent style={{ textAlign: 'center' }}>
          <Typography variant="h5">Download List</Typography>
        </CardContent>
        {downloadList.map((item, index) => (
          <Card key={index} style={{ marginBottom: 10, background: '#f0f0f0' }} id={`Card-${index}`}>
            <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
              <Typography variant="body1">{item.question}</Typography>
              <button
                onClick={() => removeItem(index)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  borderRadius: '50%',
                  color: '#333',
                  id:`Card-Remove-${index}`
                }}
              >
                <ClearIcon />
              </button>
            </CardContent>
          </Card>
        ))}
        <CardActions style={{ justifyContent: 'center' }}>
          <button onClick={downloadQuestions} style={{ background: '#3f51b5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} id="download-button">Download Now</button>
        </CardActions>
      </Card>
    </div>
  );
}

export default DownloadList;
