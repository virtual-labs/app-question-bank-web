import React, { useState, useEffect } from 'react';
import { Container, Paper, CardContent, Typography, Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import Navbar from './Navbar';
import { doc, getDoc} from 'firebase/firestore';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// const tags = [
//     { label: 'mathematics', color: '#FFCDD2' },
//     { label: 'biology', color: '#C8E6C9' },
//     { label: 'physics', color: '#BBDEFB' },
//     // Add more tags as needed
// ];


const colorList = [
    '#26c6da', '#ff7043', '#9575cd', '#4db6ac', '#ffca28',
    '#ab47bc', '#29b6f6', '#66bb6a', '#ef5350', '#ffa726',
    '#8d6e63', '#d4e157', '#5c6bc0', '#ec407a', '#78909c'
  ];
  
  function getRandomColor() {
    return colorList[Math.floor(Math.random() * colorList.length)];
  }

const QuizInit = ({ selectedRole, setSelectedRole,quizQuestions ,setquizQuestions,token,setToken}) => {
    const [quizDuration, setQuizDuration] = useState(10);
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const navigate = useNavigate();
    const [selectedTag, setSelectedTag] = useState([]);
    // const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [isStartEnabled, setIsStartEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingquestions, setLoadingQuestions] = useState(false);
  const [tags,setTags] = useState([]);

    

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


useEffect(() => {
    const fetchTags = async () => {
      try {
        // console.log("iefbe");
        const response = await fetch('http://localhost:3001/api/tags', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });


        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }

        const data = await response.json();
        console.log(data);
        const tagsWithColors = data.tags.map(tag => ({
          label: tag,
          color: getRandomColor()
        }));

        setTags(tagsWithColors);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [token]);





    useEffect(() => {
        setIsStartEnabled(selectedTag.length > 0 );
    }, [selectedTag]);

    const handleStartQuiz = () => 
    {
        searchDB();
        navigate('/exam/0');
    };

    // const handleDifficultyChange = (event) => {
    //     // setSelectedDifficulty(event.target.value);
    // };


    async function fetch_requests(url) {

        // console.log(token);
        const dat = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header with the Bearer token
          },
        })
          .then((response) => {
            return response.json(); // Parse the JSON response
          })
          .then((data) => {
            // console.log(data);
            return data; // Process the data received from the server
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
    
        return dat;
      }
    
      const handleDelete = (chipToDelete) => () => {
        setSelectedTag((chips) => chips.filter((chip) => chip !== chipToDelete));
      };




      const searchDB = async () => {
        // console.log(selectedTag, selectedDifficulty);
        // setDisplayFlag(false)
        setLoadingQuestions(true);
        // setques([]); // Clear previous questions
        setquizQuestions([]); // Clear previous questions
        // console.log(selectedTag);
        // console.log(selectedDifficulty);
        // console.log(qemail);
        
    
        const fetchQuestions = async () => {
          try {
            // Make a GET request using fetch
            let questionList = [];
            const tagArray = selectedTag.map(tag => tag.label);
          const passing = tagArray.join(",")
          // if ((questionData.selectedTags.includes(String(selectedTag.label)) && questionData.difficulty == selectedDifficulty))
          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?tags=${passing}`)
           console.log(data);
          questionList = data.data.questions;

        setquizQuestions(questionList.slice(0, 10));
    } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };

    await fetchQuestions();
    console.log(quizQuestions);
    
    // setDisplayFlag(true);
    // console.log(questions);

  };



    return (
        <>
            <Navbar selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            <Container maxWidth="md" sx={{ mt: 5, bgcolor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h3" gutterBottom textAlign="center">
                            Quiz Details
                        </Typography>
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center">
                                    <AccessTimeIcon fontSize="large" sx={{ mr: 2 }} />
                                    <Typography variant="h5">
                                        Duration: {quizDuration} minutes
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center">
                                    <QuizIcon fontSize="large" sx={{ mr: 2 }} />
                                    <Typography variant="h5">
                                        Number of Questions: {numberOfQuestions}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <Autocomplete
                                id="tags"
                                multiple
                                filterSelectedOptions
                                limitTags={3}
                                options={tags}
                                getOptionLabel={(option) => option.label}
                                value={selectedTag}
                                onChange={(event, newValue) => setSelectedTag(newValue)}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                        <Chip
                                            key={index}
                                            label={option.label}
                                            {...getTagProps({ index })}
                                            style={{ margin: 2, backgroundColor: option.color }}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Tags"
                                        placeholder="Tags"
                                    />
                                )}
                                sx={{ width: '45%' }}
                            />
                            {/* <FormControl sx={{ width: '45%' }}>
                                <InputLabel id="difficultyLabel">Difficulty</InputLabel>
                                <Select
                                    labelId="difficultyLabel"
                                    id="difficulty"
                                    value={selectedDifficulty}
                                    onChange={handleDifficultyChange}
                                    label="Difficulty"
                                >
                                    {['Easy', 'Medium', 'Hard'].map((option, index) => (
                                        <MenuItem key={index} value={option.toLowerCase()}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                        </Box>
                        <Box textAlign="center" mt={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleStartQuiz}
                                disabled={!isStartEnabled}
                                sx={{
                                    padding: '10px 50px',
                                    fontSize: '1.2rem',
                                }}
                            >
                                Start Quiz
                            </Button>
                        </Box>
                    </CardContent>
                </Paper>
            </Container>
        </>
    );
};

export default QuizInit;
