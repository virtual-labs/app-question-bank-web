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
import { CheckCircle } from '@mui/icons-material';
import MarkdownRenderer from './MarkdownRenderer';
import { auth } from './firebaseConfig'


const DEFAULT_IMAGE_WIDTH = '200px';
const ENLARGED_IMAGE_WIDTH = '580px';

function Quiz({ quizData, downloadList, setdownloadlist, setquestions, token, setToken }) {
  const navigate = useNavigate();
  const { index } = useParams();
  const selectedQuestion = quizData[parseInt(index)]; // Parse index to ensure it's a number
  console.log(selectedQuestion);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (event) => {
    setSelectedOption(event.target.value);
  };
  // console.log(selectedQuestion.correctAnswer);


  const buttonStyle = {
    background: '#f0f0f0', // Greyish background color
    color: '#555' // Greyish text color
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

  const check_ques_present_in_download_list = (question) => {
    for (const downloadQuestion of downloadList) {
      if (
        downloadQuestion.question === question.question &&
        downloadQuestion.difficulty === question.difficulty
      ) {
        return true;
      }
    }
    return false;
  }

  function DifficultyPrint() {
    var tagColor, index;
    if (selectedQuestion.difficulty === "easy") {
      tagColor = "Blue";
      index = 0;
    }
    else if (selectedQuestion.difficulty === "medium") {
      tagColor = "Orange";
      index = 1;
    }
    else if (selectedQuestion.difficulty === "hard") {
      tagColor = "Grey";
      index = 2;
    }              // Default to black if not found
    return (
      <Chip key={index} label={selectedQuestion.difficulty} style={{ backgroundColor: tagColor }} />
    );
  }

  // const handleAddToDownloadList = () => {


  const handleAddToDownloadList = () => {
    const updatedDownloadList = new Set([...downloadList, selectedQuestion]);
    setdownloadlist(Array.from(updatedDownloadList));
    console.log('Updated Download List:', updatedDownloadList);
  }


  function CorrectAnswerPrint() {
    var answer_option;
    if (selectedQuestion.correctAnswer === 1) {
      answer_option = selectedQuestion.answers.a;
    }
    else if (selectedQuestion.correctAnswer === 2) {
      answer_option = selectedQuestion.answers.b;
    }
    else if (selectedQuestion.correctAnswer === 3) {
      answer_option = selectedQuestion.answers.c;
    }
    else if (selectedQuestion.correctAnswer === 4) {
      answer_option = selectedQuestion.answers.d;
    }
    return (
      <>
      <MarkdownRenderer source={answer_option} />
        
      </>

    )
  }


  function ContributorEmailPrint() {
    return (
      <>
        <div>{selectedQuestion.user}</div>
      </>
    )
  }

  const handleRemoveFromDownloadList = () => {
    const updatedDownloadList = downloadList.filter((question) => {
      return (
        question.question !== selectedQuestion.question ||
        question.difficulty !== selectedQuestion.difficulty
      );
    });
    setdownloadlist(updatedDownloadList);
    // console.log('Updated Download List:', updatedDownloadList);
  }
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update state accordingly
        setIsAuthenticated(true);
        user.getIdToken().then((token1) => {
          // console.log(token);
          setToken(token1);
        });
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
  if (quizData.length === 0) {
    return (
      <div>
        <Navbar setquestions={setquestions} setdownloadlist={setdownloadlist} />
        <Card sx={{ margin: 'auto', maxWidth: 600, padding: 2 }}>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography variant="h5">No Query Selected</Typography>
            <a href="/search">Enter a query</a>
          </CardContent>
        </Card>
      </div>
    );

  }
  const keyvalarray = ['a', 'b', 'c', 'd'];

  function handleMouseOver(event) {
    const currentWidth = event.target.style.width;
    event.target.style.cursor = currentWidth === DEFAULT_IMAGE_WIDTH ? 'zoom-in' : 'zoom-out';
  }

  function handleMouseOut(event) {
    event.target.style.cursor = 'pointer';
  }

  function handleImageClick(event) {
    const currentWidth = event.target.style.width;
    event.target.style.width = currentWidth === DEFAULT_IMAGE_WIDTH ? ENLARGED_IMAGE_WIDTH : DEFAULT_IMAGE_WIDTH;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Navbar setquestions={setquestions} setdownloadlist={setdownloadlist} />
      {selectedQuestion
        && (
          <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'left', width: '80%' }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                Question {`${(parseInt(index) + 1).toString().padStart(2, '0')}`}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold" style={{ display: 'flex', justifyContent: 'left' }}>Tags:</Typography>
              <div style={{ display: 'flex', justifyContent: 'left' }}>
                {selectedQuestion.selectedTags && selectedQuestion.selectedTags.map((tag, index) => {
                  // Find the color for the current tag
                  const tagColor = initialTags.find(t => t.label === tag)?.color || '#000000'; // Default to black if not found
                  return (
                    <Chip key={index} label={tag} style={{ backgroundColor: tagColor }} />
                  );
                })}
              </div>
              <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold" style={{ display: 'flex', justifyContent: 'left' }}>Difficulty:</Typography>
              <div style={{ display: 'flex', justifyContent: 'left' }}>
                <DifficultyPrint />
              </div>


              <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Center the image */}
                <img
                  src={selectedQuestion.image}
                  style={{ width: DEFAULT_IMAGE_WIDTH, cursor: 'pointer' }}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={handleImageClick}
                />
              </div>
              <MarkdownRenderer source={selectedQuestion.question} sx={{ fontWeight: 'bold', justifyContent: 'center' }} style={{ display: 'flex', justifyContent: 'center' }} />
              <FormControl component="fieldset" sx={{ marginTop: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
                <FormLabel component="legend" style={{ display: 'flex', justifyContent: 'center' }}>Answers:</FormLabel>
                <RadioGroup aria-label="answers" name={`question${index}`} value={selectedOption} onChange={handleOptionSelect} style={{ display: 'flex', justifyContent: 'center' }}>
                  {Object.entries(selectedQuestion.answers).map(([key, value]) => (
                    <FormControlLabel
                      key={keyvalarray[key - 1]}
                      value={key}
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <MarkdownRenderer source={value} />
                            {key === keyvalarray[selectedQuestion.correctAnswer - 1] && (
                              <CheckCircle sx={{ color: 'green', marginLeft: '8px' }} />
                            )}
                          </div>
                          {selectedQuestion.explanations && (
                            <MarkdownRenderer source={selectedQuestion.explanations[key]} />
                          )}
                        </div>
                      }
                      sx={{
                        marginTop: 1,
                        padding: 1,
                        backgroundColor: key === selectedOption ? (key === keyvalarray[selectedQuestion.correctAnswer - 1] ? 'green' : 'red') : 'white',
                        color: key === selectedOption ? 'white' : 'black',
                        borderRadius: '4px',
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              {/* Display Tags */}
              <div style={{ textAlign: 'center' }}> {/* Center align the content within this div */}
                <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold">
                   Correct Answer:
                </Typography>
                <div style={{ display: 'inline-block' }}> {/* Center align content inside this div */}
                  <CorrectAnswerPrint />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}> {/* Center align the content within this div */}
                <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold">
                  Contributor's Email:
                </Typography>
                <div style={{ display: 'inline-block' }}> {/* Center align content inside this div */}
                  <ContributorEmailPrint />
                </div>
              </div>

            </CardContent>
          </Card>
        )}
      <div style={{ marginTop: '1rem' }}>
        <IconButton id="bwd" onClick={handlePreviousQuestion} disabled={parseInt(index) === 0} sx={{ backgroundColor: 'lightgreen', color: 'gray', marginRight: '25px' }}>
          <ArrowBack />
        </IconButton>
        <IconButton id="fwd" onClick={handleNextQuestion} disabled={parseInt(index) === quizData.length - 1} sx={{ backgroundColor: 'lightgreen', color: 'gray', marginLeft: '25px' }}>
          <ArrowForward />
        </IconButton>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {!check_ques_present_in_download_list(selectedQuestion) ? (
          <Button id="download_button_quiz" variant="contained" onClick={handleAddToDownloadList}>
            Add to Download List
          </Button>) : (
          <Button variant="contained" style={buttonStyle} onClick={handleRemoveFromDownloadList}>Remove From Download List</Button>
        )}
      </div>
    </div>
  );

};


export default Quiz;