import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button, IconButton, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Link } from 'react-router-dom';
import { Box, CircularProgress, Paper } from '@mui/material';
import { Container } from '@mui/material';
import { initialTags } from './tagsColors';
// Firebase config
import {firebaseConfig} from "./firebaseConfig.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
// Firestore
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
const app = initializeApp(firebaseConfig);

const tags = [
  { label: 'biology', color: '#26c6da' },
  { label: 'chemistry', color: '#ff7043' },
  { label: 'physics', color: '#9575cd' },
  { label: 'mathematics', color: '#4db6ac' }
];

function QuestionList({ questions, setquestions, downloadList, setDownloadList }) {
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // New state for error message
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const navigate = useNavigate();
  const [ques, setQues] = useState([]);
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



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleQuestionsPerPageChange = (event) => {
    setQuestionsPerPage(event.target.value);
  };


  const onQuestionSelect = ({ questions, index }) => {
    navigate(`/quiz/${index + currentPage * questionsPerPage - questionsPerPage}`);
  }

  const navigateToDownloadList = () => {
    navigate('/downloadlist');
    console.log(downloadList)
  }

  const handleAddToDownloadList = (question) => {
    const updatedDownloadList = new Set([...downloadList, question]);
    setDownloadList(Array.from(updatedDownloadList));
    console.log('Updated Download List:', updatedDownloadList);
  };

  const handleTagChange = (event, newValue) => {
    setSelectedTag(newValue);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];



  const searchDB = () => {
    if (selectedTag === null && selectedDifficulty === null) {
       setErrorMessage('Please select a tag or difficulty to search'); // Set error message
       return;
    }
    // Clear any previous error message
    setErrorMessage(null);
   
    // Clear the current questions list
    setquestions([]);
   
    const fetchQuestions = async () => {
      try {
         const db = getFirestore();
         const questionsRef = collection(db, 'questions'); // Replace with your collection name
     
         // Retrieve data from Firestore
         const querySnapshot = await getDocs(questionsRef);
         
         // Process the data and update state
         const questionList = [];
         querySnapshot.forEach((doc) => {
           const questionData = doc.data();
           // Check if the question matches both the selected criteria
           // Correctly using an AND condition
           const matchesTag = selectedTag ? questionData.selectedTags.includes(selectedTag.label) : true;
           const matchesDifficulty = selectedDifficulty ? questionData.difficulty === selectedDifficulty : true;
     
           if (matchesTag && matchesDifficulty) {
            console.log(questionData);
             const questionEntry = {
               question: questionData.question,
               answers: questionData.answers,
               correctAnswer: questionData.correctAnswer,
               difficulty: questionData.difficulty,
               explanations: questionData.explanations,
               selectedTags: questionData.selectedTags
             };
             questionList.push(questionEntry);
           }
         });
     
         // Update the questions state with the fetched questions
         setquestions(questionList);
      } catch (error) {
         console.error('Error fetching questions: ', error);
         // Optionally, set an error message if the fetch fails
         setErrorMessage('Failed to fetch questions. Please try again.');
      }
     };
     
   
    // Call the fetchQuestions function
    fetchQuestions();
   };

  return (
    <div>
      < Navbar setquestions={setquestions} setDownloadlist={setDownloadList} />

      <Card sx={{ margin: 'auto', maxWidth: 600, padding: 2 }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <Autocomplete
              id="combo-box-initialTags"
              options={initialTags} // Define the list of initialTags here
              getOptionLabel={(option) => option.label}
              value={selectedTag}
              onChange={handleTagChange}
              renderInput={(params) => <TextField {...params} label="Search by Tag" />}
              sx={{ width: '49%' }}
            />
            <FormControl sx={{ width: '40%' }}>
              <InputLabel id="difficultyLabel">Difficulty</InputLabel>
              <Select
                labelId="difficultyLabel"
                id="difficulty"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                label="Difficulty"
              >
                {difficultyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}

              </Select>
            </FormControl>
            <IconButton onClick={searchDB}>
              <SearchIcon />
            </IconButton>

          </div>
          {errorMessage && (
            <Typography variant="body2" color="error" gutterBottom sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <FormControl sx={{ marginBottom: 2, width: '40%', display: 'flex', justifyContent: 'center' }}>
            <InputLabel id="questionsPerPageLabel">Questions per Page</InputLabel>
            <Select
              labelId="questionsPerPageLabel"
              id="questionsPerPage"
              value={questionsPerPage}
              onChange={handleQuestionsPerPageChange}
              label="Questions per Page"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
          {currentQuestions.length === 0 && (selectedTag != null || selectedDifficulty != null) && (
            <Typography variant="h6" align="center" gutterBottom>
              No results that match your search history
            </Typography>
          )}

          {currentQuestions.length > 0 && currentQuestions.map((question, index) => (
            <Card key={index} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }} onClick={() => onQuestionSelect({ questions, index })}>
              <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant="h6">Question {indexOfFirstQuestion + index + 1}</Typography>
                  <Typography variant="body1">{question.question}</Typography>
                </div>
                <IconButton onClick={(e) => { e.stopPropagation(); handleAddToDownloadList(question); }}>
                  <Add />
                </IconButton>
              </CardContent>
            </Card>
          ))}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)} style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: currentPage === i + 1 ? 'green' : 'white', color: currentPage === i + 1 ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                {i + 1}
              </button>
            ))}
          </div>
          <Button onClick={navigateToDownloadList}>Go to Download List</Button>

        </CardContent>
      </Card>
    </div>
  );
}


export default QuestionList;



