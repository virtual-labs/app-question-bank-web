import React, { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from '@mui/material';
import { useState } from 'react';
import Navbar from './Navbar';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Link } from 'react-router-dom';
import { Box, CircularProgress, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { initialTags } from './tagsColors';
import {firebaseConfig} from "./firebaseConfig.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

// Firestore
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
const app = initializeApp(firebaseConfig);

const EASY_DIFFICULTY = 10;
const MEDIUM_DIFFICULTY = 20;
const HARD_DIFFICULTY = 30;

function Form() {
  const [comboBoxCount, setComboBoxCount] = React.useState(1);
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [selectedtags, setselectedtags] = React.useState([]);
  const [tags, setTags] = React.useState(initialTags);

  const [question, setQuestion] = React.useState('');
  const [optionA, setOptionA] = React.useState('');
  const [optionB, setOptionB] = React.useState('');
  const [optionC, setOptionC] = React.useState('');
  const [optionD, setOptionD] = React.useState('');
  const [explanationA, setExplanationA] = React.useState('');
  const [explanationB, setExplanationB] = React.useState('');
  const [explanationC, setExplanationC] = React.useState('');
  const [explanationD, setExplanationD] = React.useState('');

  const [Difficulty, setDifficulty] = React.useState('');
  const [CorrectOption, setCorrectOption] = React.useState('');

  const [errorMessage, setErrorMessage] = React.useState('');

  const handleComboBoxChange = (event, value, comboBoxId) => {
    setSelectedTags((prevSelectedTags) => {
      const updatedTags = [...prevSelectedTags];
      updatedTags[comboBoxId] = value;
      return updatedTags;
    });
  };

  const handleLogButtonClick = () => {
    if (selectedTags.length === 0) {
      setErrorMessage('Please select a tag from the list.');
      return;
    }

    const isAllTagsValid = selectedTags.every(tag => tags.includes(tag));

    if (!isAllTagsValid) {
      setErrorMessage('Please select tags only from the list.');
      return;
    }

    const newselectedtags = [...selectedtags, [...selectedTags]];
    setselectedtags(newselectedtags);

    // Remove selected tags from the available tags
    const updatedTags = tags.filter(tag => !selectedTags.includes(tag));
    setTags(updatedTags);

    setSelectedTags([]);
  };

  const removeTagFromHistory = (indexToRemove) => {
    const updatedselectedtags = selectedtags.filter((_, index) => index !== indexToRemove);
    setselectedtags(updatedselectedtags);
    setTags([...tags, ...selectedtags[indexToRemove]]);
  };

  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };
  const handleChange2 = (event) => {
    setCorrectOption(event.target.value);
  }

  const displayselectedtags = () => {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {selectedtags.map((tags, historyIndex) => (
            <div key={historyIndex} style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
              {tags.map((tag, tagIndex) => (
                <div
                  key={tagIndex}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: tag.color,
                    color: '#fff',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    borderRadius: '15px',
                    marginBottom: '5px',
                  }}
                >
                  {tag.label}
                  <IconButton
                    size="small"
                    onClick={() => removeTagFromHistory(historyIndex, tagIndex)}
                    style={{ marginLeft: '8px', color: '#fff' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleClearSubmit = () => {
    const questionField = document.getElementById('Question');
    if (questionField && !questionField.value.trim()) {
      // Display an alert if the required field is not filled
      setErrorMessage('Please fill in the required fields');
      return;
    }
    if (selectedtags.length === 0) {
      setErrorMessage('Please select a tag from the tag list.');
      return;
    }

    const formData = constructFormData(CorrectOption, Difficulty, selectedtags);
    
    console.log(formData);
    // CODE TO SUBMIT THE FORM DATA TO THE SERVER

    const uploadToFirestore = async() => {
      try {
        const db = getFirestore(app);
        const myCollection = collection(db, 'questions'); 
        const docRef = await addDoc(myCollection, formData);

        console.log('Document written with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    };

    uploadToFirestore();

    setselectedtags([]);
    setTags(initialTags);
    setSelectedTags([]);
    setDifficulty('');
    setCorrectOption('');
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanationA('');
    setExplanationB('');
    setExplanationC('');
    setExplanationD('');
    setErrorMessage('');
    alert('Question submitted successfully');
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <div>
        <h3>Enter Question</h3>
        <h5>press Tab to generate Preview</h5>
        <TextField
          id="Question"
          label="Enter Question"
          placeholder="Enter Question"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <Stack spacing={2}>
        <div>
          <h4>Option A</h4>
          <TextField
          id="OptionA"
          label="Option A"
          placeholder="Enter Option A"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
        />
        </div>
        <div>
          <h4>Explanation for Option A</h4>
          <TextField
          id="ExplanationA"
          label="Explanation for Option A"
          placeholder="Enter Explanation for Option A"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={explanationA}
          onChange={(e) => setExplanationA(e.target.value)}
        />
        </div>
      </Stack>
      <Stack spacing={2}>
        <div>
          <h4>Option B</h4>
          <TextField
          id="OptionB"
          label="Option B"
          placeholder="Enter Option B"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
        />
        </div>
        <div>
          <h4>Explanation for Option B</h4>
          <TextField
          id="ExplanationB"
          label="Explanation for Option B"
          placeholder="Enter Explanation for Option B"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={explanationB}
          onChange={(e) => setExplanationB(e.target.value)}
        />
        </div>
      </Stack>
      <Stack spacing={2}>
        <div>
          <h4>Option C</h4>
          <TextField
          id="OptionC"
          label="Option C"
          placeholder="Enter Option C"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
        />
        </div>
        <div>
          <h4>Explanation for Option C</h4>
          <TextField
          id="ExplanationC"
          label="Explanation for Option C"
          placeholder="Enter Explanation for Option C"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={explanationC}
          onChange={(e) => setExplanationC(e.target.value)}
        />
        </div>
      </Stack>
      <Stack spacing={2}>
        <div>
          <h4>Option D</h4>
          <TextField
          id="OptionD"
          label="Option D"
          placeholder="Enter Option D"
          multiline
          rows={2}
          fullWidth
          sx={{ width: 600}}
          required
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
        />
        </div>
        <div>
          <h4>Explanation for Option D</h4>
          <TextField
          id="ExplanationD"
          label="Explanation for Option D"
          placeholder="Enter Explanation for Option D"
          multiline
          rows={2}
          fullWidth
          required
          value={explanationD}
          onChange={(e) => setExplanationD(e.target.value)}
        />
        </div>
      </Stack>
      <Stack spacing={2}>
        <FormControl fullWidt="true" required>
          <InputLabel id="demo-simple-select-label-2">Correct option</InputLabel>
          <Select
            labelId="demo-simple-select-label-2"
            id="demo-simple-select-2"
            value={CorrectOption}
            label="Correct option"
            onChange={handleChange2}
            sx={{ width: 300 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 2.5 + 8,
                  width: 'ch',
                },
              }
            }}
          >
            <MenuItem value={1}>Option A</MenuItem>
            <MenuItem value={2}>Option B</MenuItem>
            <MenuItem value={3}>Option C</MenuItem>
            <MenuItem value={2}>Option D</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={2}>
        <FormControl fullWidt="true" required>
          <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Difficulty}
            label="Difficulty"
            onChange={handleChange}
            sx={{ width: 300 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 2.5 + 8,
                  width: 'ch',
                },
              }
            }}
          >
            <MenuItem value={10}>Easy</MenuItem>
            <MenuItem value={20}>Medium</MenuItem>
            <MenuItem value={30}>Hard</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={2}>
        {[...Array(comboBoxCount)].map((_, index) => (
          <Autocomplete
            key={index}
            disablePortal
            id={`tags-outlined-${index}`}
            options={tags}
            sx={{ width: 300 }}
            onChange={(event, value) => handleComboBoxChange(event, value, index)}
            renderInput={(params) => <TextField {...params} label="enter tags" />}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleLogButtonClick}>
          Add Tag
        </Button>
      </Stack>
      <Stack direction="row" spacing={2}>
        <h3>Selected Tags</h3>
      </Stack>
      <Stack direction="row" spacing={2}>
        {displayselectedtags()}
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleClearSubmit}>
          Submit
        </Button>
      </Stack>
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
}

function Answer() {
  return (
    <div>
      <h1>Answer</h1>
    </div>
  );
}
const constructFormData = (CorrectOption, Difficulty, selectedtags) => {
  const question = document.getElementById('Question').value;
  const optionA = document.getElementById('OptionA').value;
  const optionB = document.getElementById('OptionB').value;
  const optionC = document.getElementById('OptionC').value;
  const optionD = document.getElementById('OptionD').value;
  const correctOption = CorrectOption;
  const difficulty = Difficulty;
  const explanationA = document.getElementById('ExplanationA').value;
  const explanationB = document.getElementById('ExplanationB').value;
  const explanationC = document.getElementById('ExplanationC').value;
  const explanationD = document.getElementById('ExplanationD').value;

  var newDif;
  if (difficulty === EASY_DIFFICULTY) {
      newDif = 'easy'
  } else if (difficulty === MEDIUM_DIFFICULTY) {
      newDif = 'medium'
  } else {
      newDif = 'hard'
  }

  const formData = {
    question: question,
    answers: {
      a: optionA,
      b: optionB,
      c: optionC,
      d: optionD
    },
    correctAnswer: correctOption,
    difficulty: newDif,
    explanations: {
      a: explanationA,
      b: explanationB,
      c: explanationC,
      d: explanationD
    },
    selectedTags: selectedtags.flat().map(tag => tag.label)
  };

  return formData;
};

function AddToQueueSharption(setquestions , setDownloadList) {
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
      <CardContent>
        <Typography
          variant="h4"
          noWrap
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Submit a question
        </Typography>
        <Form />
      </CardContent>
    </Card>
    </div>
  );
}

export default AddToQueueSharption;
