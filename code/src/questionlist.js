import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button, IconButton, TextField, CircularProgress, Paper, Container } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Autocomplete from '@mui/material/Autocomplete';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { logDOM } from '@testing-library/react';
import ClearIcon from '@mui/icons-material/Clear';
import { ResizableBox } from 'react-resizable';
import MarkdownRenderer from './MarkdownRenderer';

const app = initializeApp(firebaseConfig);

const tags = [
  { label: 'biology', color: '#26c6da' },
  { label: 'chemistry', color: '#ff7043' },
  { label: 'physics', color: '#9575cd' },
  { label: 'mathematics', color: '#4db6ac' }
];

const difficulty_tags = [
  { label: 'Easy', color: 'Blue' },
  { label: 'Medium', color: 'Orange' },
  { label: 'Hard', color: 'Hard' },
]

// function restoreSearchVars()
// {

// }

function QuestionList({ questions, setquestions, downloadList, setDownloadList }) {
  // setquestions([]);
  // console.log("efbejd");
  console.log(downloadList);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const navigate = useNavigate();
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const [ques, setques] = useState([]);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingquestions, setLoadingQuestions] = useState(false);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearDifficulty = () => {
    setSelectedDifficulty(null);
  };

  const handleRemoveFromDownloadList = (selectedQuestion) => {
    const updatedDownloadList = downloadList.filter((question) => {
      return (
        question.question !== selectedQuestion.question ||
        question.difficulty !== selectedQuestion.difficulty
      );
    });
    setDownloadList(updatedDownloadList);
    // console.log('Updated Download List:', updatedDownloadList);
  }

  const handleQuestionsPerPageChange = (event) => {
    setQuestionsPerPage(event.target.value);
  };

  const onQuestionSelect = ({ index }) => {
    navigate(`/quiz/${index + currentPage * questionsPerPage - questionsPerPage}`);
  };

  const navigateToDownloadList = () => {
    navigate('/downloadlist');
  };

  const handleAddToDownloadList = (question) => {

    if (downloadList.some((item) => item.question === question.question)) {
      alert('Question is already in the download list');
    }
    else {
      const updatedDownloadList = new Set([...downloadList, question]);
      setDownloadList(Array.from(updatedDownloadList));
      alert('Question added to download list');
    }
  };

  const handleTagChange = (event, newValue) => {
    setSelectedTag(newValue);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
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
  const searchDB = () => {

    // setDisplayFlag(false)
    setLoadingQuestions(true);
    setques([]); // Clear previous questions
    setquestions([]); // Clear previous questions
    // console.log(selectedTag);
    if (selectedTag === null && selectedDifficulty === null) {
      setErrorMessage('Please select a tag or difficulty to search');
      if (questions.length === 0) {
        setDisplayFlag(true);
      }
      else
        setDisplayFlag(false);
      setLoadingQuestions(false);
      return;
    }

    setErrorMessage(null);

    const fetchQuestions = async () => {
      try {
        const db = getFirestore();
        const questionsRef = collection(db, 'questions');
        const querySnapshot = await getDocs(questionsRef);

        const questionList = [];
        querySnapshot.forEach((doc) => {
          const questionData = doc.data();
          // console.log(questionData.selectedTags);
          if ((selectedTag && selectedDifficulty)) {
            if ((questionData.selectedTags.includes(String(selectedTag.label)) && questionData.difficulty == selectedDifficulty))
              questionList.push(questionData);
          }
          else if (selectedTag && questionData.selectedTags.includes(String(selectedTag.label))) {
            questionList.push(questionData);
          }
          else if (selectedDifficulty && questionData.difficulty === selectedDifficulty) {
            questionList.push(questionData);
            // console.log('hii');
          }
        });
        setquestions(questionList);
        // console.log(questionList);
      } catch (error) {
        console.error('Error fetching questions: ', error);
      }
    };

    // console.log(questions);
    fetchQuestions();
    if (questions.length === 0) {
      setDisplayFlag(true);
    }
    else
      setDisplayFlag(false);
    setLoadingQuestions(false);
    // setDisplayFlag(true);
    // console.log(questions);

  };

  return (
    <div>


      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!isAuthenticated ? (
            <>
              <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
                  <Typography variant="h6" align="center">Access Restricted</Typography>
                  <Typography variant="body1" align="center">Please log in to access this page.</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button variant="contained" color="primary" component={Link} to="/login">Go to Login</Button>
                  </Box>
                </Paper>
              </Container>
            </>
          ) : (

            <div>
              <Navbar setquestions={setquestions} setDownloadlist={setDownloadList} />
              <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
                <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Autocomplete
                      id="combo-box-initialTags"
                      options={tags}
                      getOptionLabel={(option) => option.label}
                      value={selectedTag}
                      onChange={handleTagChange}
                      renderInput={(params) => <TextField {...params} label="Search by Tag" variant="outlined" />}
                      sx={{ width: '45%' }}
                    />
                    <FormControl sx={{ width: '45%' }}>
                      <InputLabel id="difficultyLabel">Difficulty</InputLabel>
                      <Select
                        labelId="difficultyLabel"
                        id="difficulty"
                        value={selectedDifficulty}
                        onChange={handleDifficultyChange}
                        label="Difficulty"
                        renderValue={(selected) => selected}
                      >
                        {['Easy', 'Medium', 'Hard'].map((option, index) => (
                          <MenuItem key={index} value={option.toLowerCase()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{option}</span>
                            {selectedDifficulty === option.toLowerCase() && (

                              <IconButton onClick={clearDifficulty} edge="end" size="small" sx={{ marginLeft: 'auto' }}>
                                <ClearIcon />
                              </IconButton>
                            )}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <IconButton onClick={searchDB} color="primary">
                    <Search />
                  </IconButton> */}
                  </div>
                  {errorMessage && (
                    <Typography variant="body2" color="error" gutterBottom sx={{ marginBottom: 2 }}>
                      {errorMessage}
                    </Typography>
                  )
                  }
                  <FormControl sx={{ marginBottom: 2, width: '40%', display: 'flex', justifyContent: 'center' }}>
                    <InputLabel id="questionsPerPageLabel">Questions per Page</InputLabel>
                    <Select
                      labelId="questionsPerPageLabel"
                      id="questionsPerPage"
                      value={questionsPerPage}
                      onChange={handleQuestionsPerPageChange}
                      label="Questions per Page"
                    >
                      {[5, 10, 15, 20].map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button onClick={searchDB} variant="contained" color="primary">Search</Button>
                  {
                    loadingquestions && (selectedTag || selectedDifficulty) && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                      </Box>
                    )
                  }
                  {questions.length === 0 && (selectedTag || selectedDifficulty) && (displayFlag) && (
                    <Typography variant="h6" align="center" gutterBottom>
                      No results that match your search criteria
                    </Typography>
                  )}
                  {questions.length > 0 && questions.map((question, index) => (
                    <Card key={index} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px', cursor: 'pointer' }} onClick={() => onQuestionSelect({ index })}>
                      <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <Typography variant="h6">Question {indexOfFirstQuestion + index + 1}</Typography>
                          <MarkdownRenderer source={question.question} />
                        </div>
                        {
                          !check_ques_present_in_download_list(question) ?
                            (<IconButton onClick={(e) => { e.stopPropagation(); handleAddToDownloadList(question); }} color="primary">
                              <Add />
                            </IconButton>)
                            :
                            (<IconButton onClick={(e) => { e.stopPropagation(); handleRemoveFromDownloadList(question); }} color="primary">
                              <RemoveIcon />
                            </IconButton>)
                        }
                      </CardContent>
                    </Card>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => (
                      <button key={i} onClick={() => handlePageChange(i + 1)} style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: currentPage === i + 1 ? '#26c6da' : '#f5f5f5', color: currentPage === i + 1 ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                </CardContent>
                </Paper>
              </Container>


            </div>
          )}
        </>
      )}
    </div>
  );

}

export default QuestionList;
