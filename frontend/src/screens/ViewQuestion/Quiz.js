import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Typography, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Link } from 'react-router-dom';
// import { initialTags } from '../../components/TagsColors'; // Import initialTags
import { Box, CircularProgress, Container, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import MarkdownRenderer from '../Search/MarkdownRenderer';
// import { auth } from '../../authentication/FirebaseConfig';

const DEFAULT_IMAGE_WIDTH = '200px';
const ENLARGED_IMAGE_WIDTH = '580px';

const tagColors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC733',
  '#33FFF7', '#FF5733', '#A833FF', '#FF5733', '#33FF57',
  '#3357FF', '#FF33A8', '#FFC733', '#33FFF7', '#A833FF'
];

const getRandomColor = () => {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
};

function Quiz({ questionData, setQuestionData, quizData, downloadList, setdownloadlist, setquestions, token, setToken, selectedRole, setSelectedRole }) {
  const navigate = useNavigate();
  const { index } = useParams();
  const parsedIndex = parseInt(index);
  const selectedQuestion = quizData[parsedIndex]; // Parse index to ensure it's a number

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setQuestionData(selectedQuestion);
    setSelectedOption(null); // Reset selected option when index changes
  }, [index, setQuestionData, selectedQuestion]);

  const handleOptionSelect = (event) => {
    setSelectedOption(event.target.value);
  };

  const buttonStyle = {
    background: '#f0f0f0', // Greyish background color
    color: '#555' // Greyish text color
  };

  const handlePreviousQuestion = () => {
    const previousIndex = parsedIndex - 1;
    if (previousIndex >= 0) {
      navigate(`/quiz/${previousIndex}`);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = parsedIndex + 1;
    if (nextIndex < quizData.length) {
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
    } else if (selectedQuestion.difficulty === "medium") {
      tagColor = "Orange";
      index = 1;
    } else if (selectedQuestion.difficulty === "hard") {
      tagColor = "Grey";
      index = 2;
    } // Default to black if not found
    return (
      <Chip key={index} label={selectedQuestion.difficulty} style={{ backgroundColor: tagColor }} />
    );
  }

  const handleAddToDownloadList = () => {
    const updatedDownloadList = new Set([...downloadList, selectedQuestion]);
    setdownloadlist(Array.from(updatedDownloadList));
  }

  function CorrectAnswerPrint() {
    var answer_option;
    if (selectedQuestion.correctAnswer === 1 || selectedQuestion.correctAnswer === 'a') {
      answer_option = selectedQuestion.answers.a;
    } else if (selectedQuestion.correctAnswer === 2 || selectedQuestion.correctAnswer === 'b') {
      answer_option = selectedQuestion.answers.b;
    } else if (selectedQuestion.correctAnswer === 3 || selectedQuestion.correctAnswer === 'c') {
      answer_option = selectedQuestion.answers.c;
    } else if (selectedQuestion.correctAnswer === 4 || selectedQuestion.correctAnswer === 'd') {
      answer_option = selectedQuestion.answers.d;
    }
    return (
      <MarkdownRenderer source={answer_option} />
    );
  }

  const handleRemoveFromDownloadList = () => {
    const updatedDownloadList = downloadList.filter((question) => {
      return (
        question.question !== selectedQuestion.question ||
        question.difficulty !== selectedQuestion.difficulty
      );
    });
    setdownloadlist(updatedDownloadList);
  }

  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        user.getIdToken().then((token1) => {
          setToken(token1);
        });
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Set loading to false once the check is complete
    });

    return () => unsubscribe();
  }, [navigate,setToken]);

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

  const keyvalarray = ['a', 'b', 'c', 'd', 'e', 'f'];

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

  if (!selectedRole.includes("Administrator") && !selectedRole.includes("Question User") && !selectedRole.includes("Quiz Participant")) {
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
      <Navbar setquestions={setquestions} setdownloadlist={setdownloadlist} selectedRole={selectedRole || []} setSelectedRole={setSelectedRole} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {selectedQuestion && (
        <Card sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'left', width: '80%', position: 'relative' }}>
          {selectedRole.includes("Administrator") && (
            <Button
              variant="contained"
              color="primary"
              style={{ position: 'absolute', top: '10px', right: '10px' }}
              onClick={() => navigate(`/update`)}
            >
              Update Question
            </Button>
          )}
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              Question {`${(parsedIndex + 1).toString().padStart(2, '0')}`}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold" style={{ display: 'flex', justifyContent: 'left' }}>Tags:</Typography>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              {selectedQuestion.selectedTags && selectedQuestion.selectedTags.map((tag, index) => {
                const tagColor = getRandomColor();
                return (
                  <Chip key={index} label={tag} style={{ backgroundColor: tagColor }} />
                );
              })}
            </div>
            <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold" style={{ display: 'flex', justifyContent: 'left' }}>Difficulty:</Typography>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <DifficultyPrint />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                alt=""
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
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ marginTop: 2 }} fontWeight="bold">
                Correct Answer:
              </Typography>
              <div style={{ display: 'inline-block' }}>
                <CorrectAnswerPrint />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div style={{ marginTop: '1rem' }}>
        <IconButton id="bwd" onClick={handlePreviousQuestion} disabled={parsedIndex === 0} sx={{ backgroundColor: 'lightgreen', color: 'gray', marginRight: '25px' }}>
          <ArrowBack />
        </IconButton>
        <IconButton id="fwd" onClick={handleNextQuestion} disabled={parsedIndex === quizData.length - 1} sx={{ backgroundColor: 'lightgreen', color: 'gray', marginLeft: '25px' }}>
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
    </>
  );
};

export default Quiz;
