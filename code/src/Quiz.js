import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Typography, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Link } from 'react-router-dom';
import { initialTags } from './tagsColors'; // Import initialTags
import { Box, CircularProgress, Container, Paper } from '@mui/material';


function Quiz({ quizData, downloadList, setDownloadList, setquestions}) {
 const navigate = useNavigate();
 const { index } = useParams();
 const selectedQuestion = quizData[parseInt(index)]; // Parse index to ensure it's a number

 const [selectedOption, setSelectedOption] = useState(null);

 const handleOptionSelect = (event) => {
    setSelectedOption(event.target.value);
 };

 const handlePreviousQuestion = () => {
    const previousIndex = parseInt(index) - 1;
    if (previousIndex >= 0) {
      setSelectedOption(null);
      navigate(`/quiz/${previousIndex}`);
    }
 };

 const handleNextQuestion = () => {
    const nextIndex = parseInt(index) + 1;
    if (nextIndex < quizData.length) {
      setSelectedOption(null);
      navigate(`/quiz/${nextIndex}`);
    }
 };

 const handleAddToDownloadList = () => {
    const updatedDownloadList = new Set([...downloadList, selectedQuestion]);
    setDownloadList(Array.from(updatedDownloadList));
    console.log('Updated Download List:', updatedDownloadList);
 }
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
  if(quizData.length === 0){
    return (
      <div>
        < Navbar setquestions  = {setquestions}  setDownloadlist = {setDownloadList}/>
        <Card sx={{ margin: 'auto', maxWidth: 600, padding: 2 }}>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography variant="h5">No Query Selected</Typography>
            <a href="/search">Enter a query</a>
          </CardContent>
        </Card>
      </div>
    );
  
  }
  console.log(selectedQuestion);
 return (
    <div>
      < Navbar setquestions  = {setquestions}  setDownloadlist = {setDownloadList}/>
      {selectedQuestion && (
        <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <CardContent>
            <Typography variant="h6" sx={{fontWeight : 'bold' }} >Question {`${(parseInt(index) + 1).toString().padStart(2, '0')}`}</Typography>
            <Typography variant="body1" sx={{fontWeight : 'bold'}}>{selectedQuestion.question}</Typography>
            <FormControl component="fieldset" sx={{ marginTop: 2 }}>
              <FormLabel component="legend">Answers:</FormLabel>
              <RadioGroup aria-label="answers" name={`question${index}`} value={selectedOption} onChange={handleOptionSelect}>
                {Object.entries(selectedQuestion.answers).map(([key, value]) => (
                 <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <div>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{value}</Typography>
                        {selectedQuestion.explanations && (
                          <Typography variant="body2">Explanation: {selectedQuestion.explanations[key]}</Typography>
                        )}
                      </div>
                    }
                    sx={{
                      marginTop: 1,
                      padding: 1,
                      backgroundColor: key === selectedOption ? (key === selectedQuestion.correctAnswer ? '#58e21c' : 'red') : 'white',
                      color: key === selectedOption ? 'white' : 'black',
                      borderRadius: '4px',
                    }}
                 />
                ))}
              </RadioGroup>
            </FormControl>
            {/* Display Tags */}

            <Typography variant="body1" sx={{ marginTop: 2 }}>Tags:</Typography>
            <div>
              {selectedQuestion.selectedTags && selectedQuestion.selectedTags.map((tag, index) => {
                // Find the color for the current tag
                const tagColor = initialTags.find(t => t.label === tag)?.color || '#000000'; // Default to black if not found
                return (
                 <Chip key={index} label={tag} style={{ backgroundColor: tagColor }} />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <IconButton onClick={handlePreviousQuestion} disabled={parseInt(index) === 0} sx={{ backgroundColor: 'lightgreen', color: 'gray', marginRight: '25px' }}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={handleNextQuestion} disabled={parseInt(index) === quizData.length - 1} sx={{ backgroundColor: 'lightgreen', color: 'gray', marginLeft: '25px' }}>
          <ArrowForward />  
        </IconButton>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Button variant="contained" onClick={handleAddToDownloadList}>
          Add to Download List
        </Button>
      </div>
    </div>
 );
}

export default Quiz;
