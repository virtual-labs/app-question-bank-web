import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button, IconButton, TextField, CircularProgress, Paper, Container } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.js';
import Autocomplete from '@mui/material/Autocomplete';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import { firebaseConfig } from "../../authentication/FirebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { logDOM } from '@testing-library/react';
import ClearIcon from '@mui/icons-material/Clear.js';
import { ResizableBox } from 'react-resizable';
import MarkdownRenderer from './MarkdownRenderer.js';
import Chip from '@mui/material/Chip';
import { doc, getDoc } from 'firebase/firestore';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const tags = [
//   { label: 'biology', color: '#26c6da' },
//   { label: 'chemistry', color: '#ff7043' },
//   { label: 'physics', color: '#9575cd' },
//   { label: 'mathematics', color: '#4db6ac' }
// ];

const difficulty_tags = [
  { label: 'Easy', color: 'Blue' },
  { label: 'Medium', color: 'Orange' },
  { label: 'Hard', color: 'Hard' },
]



const colorList = [
  '#26c6da', '#ff7043', '#9575cd', '#4db6ac', '#ffca28',
  '#ab47bc', '#29b6f6', '#66bb6a', '#ef5350', '#ffa726',
  '#8d6e63', '#d4e157', '#5c6bc0', '#ec407a', '#78909c'
];

function getRandomColor() {
  return colorList[Math.floor(Math.random() * colorList.length)];
}
// function restoreSearchVars()
// {

// }

function QuestionList({ questions, setquestions, downloadList, setDownloadList, token, setToken, selectedRole, setSelectedRole ,tags,setTags}) {
  
  // useEffect(()=>{
  //   setquestions([]);
  // },[setquestions]);

  // setquestions([]);
  // console.log("efbejd");
  // console.log(downloadList);

  // const [tags, setTags] = useState([
  // ]);


  useEffect(() => {
    const fetchTags = async () => {
      try {
        // console.log("iefbe");
        const response = await fetch('https://vlabs-question-bank.el.r.appspot.com/api/tags', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });


        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }

        const data = await response.json();
        // console.log(data);
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


  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [selectedTag, setselectedTag] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const navigate = useNavigate();
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const [ques, setques] = useState([]);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [loadingquestions, setLoadingQuestions] = useState(false);
  const [qemail, setQemail] = useState('');
  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setIsAuthenticated(!!user);
  //     setIsLoading(false);

  //     if (user) {
  //       user.getIdToken().then((token1) => {
  //         // console.log(token);
  //         setToken(token1);
  //       })
  //     }

  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, update state accordingly
        setIsAuthenticated(true);
        user.getIdToken().then((token1) => {
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
  }, [selectedRole, setSelectedRole, setToken]);


  const handlePageChange = (page) => {
    // console.log(page);
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
    navigate(`/quiz/${index}`);
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
    setselectedTag(newValue);
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
    setselectedTag((chips) => chips.filter((chip) => chip !== chipToDelete));
  };



  const searchDB = async () => {

    // setDisplayFlag(false)
    setLoadingQuestions(true);
    setques([]); // Clear previous questions
    setquestions([]); // Clear previous questions
    // console.log(selectedTag);
    // console.log(selectedDifficulty);
    // console.log(qemail);
    if (selectedTag.length === 0 && selectedDifficulty === null && !qemail) {
      // console.log("iefbiebfeibf");
      setErrorMessage('Please select a tag or difficulty or user to search');
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
        // Make a GET request using fetch
        let questionList = [];
        if ((selectedTag.length !== 0 && selectedDifficulty && qemail)) {
          // console.log('A');
          const tagArray = selectedTag.map(tag => tag.label);
          const passing = tagArray.join(",")
          // if ((questionData.selectedTags.includes(String(selectedTag.label)) && questionData.difficulty == selectedDifficulty))
          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?tags=${passing}&difficulty=${selectedDifficulty}&user=${qemail}`);
          //  console.log(data.data.questions);
          questionList = data.data.questions;
        }
        else if ((selectedTag.length !== 0 && qemail)) {
          // console.log('b');

          const tagArray = selectedTag.map(tag => tag.label);
          const passing = tagArray.join(",")
          // if ((questionData.selectedTags.includes(String(selectedTag.label)) && questionData.difficulty == selectedDifficulty))
          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?tags=${passing}&user=${qemail}`);
          //  console.log(data.data.questions);
          questionList = data.data.questions;
        }
        else if ((selectedTag.length !== 0 && selectedDifficulty)) {
          // console.log('C');

          // console.log(selectedTag, selectedDifficulty);
          const tagArray = selectedTag.map(tag => tag.label);
          const passing = tagArray.join(",")
          // if ((questionData.selectedTags.includes(String(selectedTag.label)) && questionData.difficulty == selectedDifficulty))
          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?tags=${passing}&difficulty=${selectedDifficulty}`)
          //  console.log(data.data.questions);
          questionList = data.data.questions;
        }
        else if (selectedDifficulty && qemail) {
          // console.log('D');

          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?difficulty=${selectedDifficulty}&user=${qemail}`);
          // console.log(data.data.questions);
          questionList = data.data.questions;
        }
        else if (selectedTag.length !== 0) {
          // console.log('E');

          const tagArray = selectedTag.map(tag => tag.label);
          const passing = tagArray.join(",")
          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?tags=${passing}`);
          // console.log(data.data.questions);
          questionList = data.data.questions;

        }
        else if (selectedDifficulty) {
          // console.log('F');

          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?difficulty=${selectedDifficulty}`);
          // console.log(data.data.questions);
          questionList = data.data.questions;
        }
        else {
          // console.log('G');

          const data = await fetch_requests(`https://vlabs-question-bank.el.r.appspot.com/api/questions?user=${qemail}`);
          // console.log(data.data.questions);
          questionList = data.data.questions;
        }


        // console.log(questionList);
        setquestions(questionList);


        // const db = getFirestore();
        // const questionsRef = collection(db, 'questions');
        // const querySnapshot = await getDocs(questionsRef);

        // querySnapshot.forEach((doc) => {
        //   const questionData = doc.data();
        //   console.log(questionData);
        // if ((selectedTag && selectedDifficulty)) {
        //   if ((questionData.selectedTags.includes(String(selectedTag.label)) && questionData.difficulty == selectedDifficulty))
        //     questionList.push(questionData);
        // }
        // else if (selectedTag && questionData.selectedTags.includes(String(selectedTag.label))) {
        //   questionList.push(questionData);
        // }
        // else if (selectedDifficulty && questionData.difficulty === selectedDifficulty) {
        //   questionList.push(questionData);
        //   // console.log('hii');
        // }
        // });

        // console.log(questionList);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };

    // console.log(questions);
    await fetchQuestions();
    if (questions.length === 0) {
      setDisplayFlag(true);
    }
    else
      setDisplayFlag(false);
    setLoadingQuestions(false);

    await setQemail('')
    // setDisplayFlag(true);
    // console.log(questions);

  };

  // console.log("Quest_list_role:",selectedRole);

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
    <div>


      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left', height: '100vh' }}>
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
              <Navbar setquestions={setquestions} setDownloadlist={setDownloadList} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
              <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
                  <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                      <Autocomplete
                        id="tags"
                        multiple
                        filterSelectedOptions
                        limitTags={3} // Displays only 3 max tags of autocomplete when not in focus
                        options={tags}
                        getOptionLabel={(option) => option.label}
                        value={selectedTag}
                        onChange={(event, newValue) => {
                          // console.log(newValue);
                          setselectedTag(newValue);
                        }}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              id="cancel_tag"
                              label={option.label}
                              {...getTagProps({ index })}
                              style={{ margin: 2, backgroundColor: option.color }} // Apply the color to the Chip
                              onDelete={handleDelete(option)} // Add delete handler
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
                        sx={{ width: '45%' }} // Set the width of the Autocomplete component
                      />
                      <FormControl sx={{ width: '45%' }} id='once'>
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
                            <MenuItem key={index} value={option.toLowerCase()} id={option.toLowerCase()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{option}</span>
                              {selectedDifficulty === option.toLowerCase() && (

                                <IconButton onClick={clearDifficulty} id='cross' edge="end" size="small" sx={{ marginLeft: 'auto' }}>
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
                    <FormControl sx={{ marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <TextField id='user' label="Contributor's Email" variant="outlined" value={qemail} onChange={(e) => setQemail(e.target.value)} />
                    </FormControl>
                    {errorMessage && (
                      <Typography id='error' variant="body2" color="error" gutterBottom sx={{ marginBottom: 2 }}>
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
                    <Button id="search_button" onClick={searchDB} variant="contained" color="primary">Search</Button>
                    {
                      loadingquestions && (selectedTag.length !== 0 || selectedDifficulty || qemail) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                          <CircularProgress />
                        </Box>
                      )
                    }
                    {questions.length === 0 && (selectedTag.length !== 0 || selectedDifficulty || qemail) && (displayFlag) && (
                      <Typography variant="h6" align="center" gutterBottom>
                        No results that match your search criteria
                      </Typography>
                    )}
                    {questions.length > 0 && questions.map((question, index) => (
                      (index >= (currentPage - 1) * questionsPerPage && index < (currentPage * questionsPerPage)) ? (
                        <Card id='gotQuestions' key={index} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px', cursor: 'pointer' }} onClick={() => onQuestionSelect({ index })}>
                          <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <Typography variant="h6">Question {index + 1}</Typography>
                              <MarkdownRenderer source={question.question} />
                            </div>
                            {
                              !check_ques_present_in_download_list(question) ? (
                                <IconButton id="add" onClick={(e) => { e.stopPropagation(); handleAddToDownloadList(question); }} color="primary">
                                  <Add />
                                </IconButton>
                              ) : (
                                <IconButton onClick={(e) => { e.stopPropagation(); handleRemoveFromDownloadList(question); }} color="primary">
                                  <RemoveIcon />
                                </IconButton>
                              )
                            }
                          </CardContent>
                        </Card>
                      ) : null
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                      {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => (
                        <button key={i} id={"page${i}"} onClick={() => handlePageChange(i + 1)} style={{ margin: '0.5rem', padding: '0.5rem 1rem', backgroundColor: currentPage === i + 1 ? '#26c6da' : '#f5f5f5', color: currentPage === i + 1 ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
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