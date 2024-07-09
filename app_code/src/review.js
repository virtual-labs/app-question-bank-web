import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, FormLabel, RadioGroup, Typography, Chip, useMediaQuery } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowForward, Menu, CheckCircle, Cancel } from '@mui/icons-material';
import { Box, Container, IconButton } from '@mui/material';
import { initialTags } from './tagsColors';
import MarkdownRenderer from './MarkdownRenderer';
import './Exam.css';
import Navbar from './Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AppBar, Toolbar,Avatar } from '@mui/material';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const Review = ({ quizData, downloadList, setdownloadlist, setquestions, token, setToken, selectedRole, setSelectedRole,markedOptions, setMarkedOptions }) => {
    const navigate = useNavigate();
    const { index } = useParams();
    const selectedQuestion = quizData[parseInt(index)];
    const currentQuestionIndex = parseInt(index);
    // const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [showNavigation, setShowNavigation] = useState(true); // State to control navigation pane visibility
    const [menuClicked, setMenuClicked] = useState(false);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setTimeLeft((prevTime) => {
    //             if (prevTime <= 1) {
    //                 clearInterval(timer);
    //                 navigate('/results');
    //                 return 0;
    //             }
    //             return prevTime - 1;
    //         });
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [navigate]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 650) {
                setShowNavigation(false);
                setMenuClicked(false);
            } else {
                setShowNavigation(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleNavigation = () => {
        setMenuClicked((prevState) => !prevState);
    };

    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isMediumScreen = useMediaQuery('(max-width:960px)');

    const timeFontSize = isSmallScreen ? '3vw' : isMediumScreen ? '1.2rem' : '1.5rem';
    const questionFontSize = isSmallScreen ? '4vw' : isMediumScreen ? '1.4rem' : '1.6rem';

    const keyToNumberMap = { "a": 1, "b": 2, "c": 3, "d": 4 }; // Mapping from alphabetic keys to numeric values

    const handleNavigation = (newIndex) => {
        navigate(`/review/${newIndex}`);
    };

    const handlePreviousQuestion = () => {
        handleNavigation(parseInt(index) - 1);
    };

    const handleNextQuestion = () => {
        handleNavigation(parseInt(index) + 1);
    };

    const handleCircleClick = (circleIndex) => {
        handleNavigation(circleIndex);
    };

    const handleEndQuiz = () => {
        navigate('/results');
    };


    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    const getQuestionStatus = (index) => {
        let markedOption = markedOptions[index];
        const correctAnswer = quizData[index].correctAnswer;
        console.log(correctAnswer);
        if (markedOption === null || markedOption === undefined || markedOption === "") {
            return 'grey';
        }
        if(markedOption===1)
            {
                markedOption="a";
            }
        else if(markedOption===2)
            {
                markedOption="b";
            }
        else if(markedOption===3)
            {
                markedOption="c";
            }
        else if(markedOption===4)
            {
                markedOption="d";
            }

        return markedOption === correctAnswer ? 'green' : 'red';
    };

    const numberToLetterMap = {
        1: 'a',
        2: 'b',
        3: 'c',
        4: 'd',
        5: 'e',
        6: 'f'
      };

    return (
        <Container maxWidth="100%" sx={{ margin: '0 auto', mt: '5vh' }}>
            <Navbar setquestions={setquestions} setdownloadlist={setdownloadlist} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '3vh', width: '100%' }}>
                <Box sx={{ width: showNavigation ? '80%' : menuClicked ? '40%' : '100%', position: 'relative' }}>
                    <Typography
                        variant="body1"
                        sx={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            fontWeight: 'bold',
                            fontSize: timeFontSize,
                            color: 'black', // Change color as desired
                            zIndex: 999,
                            backgroundColor: '#fff', // Change background color as desired
                            padding: '0.5rem',
                        }}
                    >
                        {/* {isSmallScreen
                            ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                            : `Time Left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`} */}
                    </Typography>
                    {selectedQuestion && (
                        <Card sx={{ mb: '2vh', p: '2vh', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'left', paddingTop: isSmallScreen ? '4rem' : '1rem' }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', fontSize: questionFontSize, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    Question {`${(parseInt(index) + 1).toString().padStart(2, '0')}`}
                                    {numberToLetterMap[markedOptions[parseInt(index)]] === selectedQuestion.correctAnswer ? (
                                        <CheckCircle sx={{ color: 'green', ml: '0.5rem' }} />
                                    ) : markedOptions[parseInt(index)] !== null && markedOptions[parseInt(index)] !== undefined && markedOptions[parseInt(index)] !== "" ? (
                                        <Cancel sx={{ color: 'red', ml: '0.5rem' }} />
                                    ) : (
                                        <Typography sx={{ color: 'grey', ml: '0.5rem' }}>Not attempted</Typography>
                                    )}
                                </Typography>
                                <div style={{
                                    marginTop: '2rem', // Increase distance between Question and Tags
                                    display: 'flex',
                                    justifyContent: isSmallScreen ? 'center' : 'space-between',
                                    alignItems: isSmallScreen ? 'flex-start' : 'center',
                                    flexDirection: isSmallScreen ? 'column' : 'row'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'left',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem',
                                        marginBottom: isSmallScreen ? '1rem' : '0'
                                    }}>
                                        {selectedQuestion.selectedTags &&
                                            selectedQuestion.selectedTags.map((tag, idx) => {
                                                const tagColor = initialTags.find((t) => t.label === tag)?.color || 'white';
                                                return <Chip key={idx} label={tag} style={{ backgroundColor: tagColor }} />;
                                            })}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-end' }}>
                                        <Chip
                                            label={selectedQuestion.difficulty}
                                            style={{
                                                backgroundColor: selectedQuestion.difficulty === 'easy' ? 'blue' : selectedQuestion.difficulty === 'medium' ? 'orange' : 'grey',
                                            }}
                                        />
                                    </div>
                                </div>
                                {selectedQuestion.image && (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <img
                                            src={selectedQuestion.image}
                                            style={{ width: '20vw', cursor: 'pointer' }}
                                            onMouseOver={(e) => (e.target.style.cursor = 'zoom-in')}
                                            onMouseOut={(e) => (e.target.style.cursor = 'pointer')}
                                            onClick={(e) => (e.target.style.width = e.target.style.width === '20vw' ? '58vw' : '20vw')}
                                        />
                                    </div>
                                )}
                                <MarkdownRenderer source={selectedQuestion.question} sx={{ fontWeight: 'bold', justifyContent: 'center' }} style={{ display: 'flex', justifyContent: 'center' }} />
                                <FormControl component="fieldset" sx={{ mt: '2vh' }} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <FormLabel component="legend" style={{ display: 'flex', justifyContent: 'center' }}>
                                        Answers:
                                    </FormLabel>
                                    <RadioGroup aria-label="answers" name={`question${index}`} value={keyToNumberMap[selectedQuestion.correctAnswer]}>
                                        {Object.entries(selectedQuestion.answers).map(([key, value], idx) => (
                                            <FormLabel
                                                key={key}
                                                style={{
                                                    display: 'block',
                                                    margin: '1vh',
                                                    padding: '1vh',
                                                    backgroundColor: key === selectedQuestion.correctAnswer ? 'green' :
                                                        (numberToLetterMap[markedOptions[parseInt(index)]] === key && key !== selectedQuestion.correctAnswer) ? 'red' : 'white',
                                                    color: 'black',
                                                    borderRadius: '4px',
                                                    textAlign: 'left',
                                                    fontWeight: key === selectedQuestion.correctAnswer ? 'bold' : 'normal',
                                                }}
                                            >
                                                <MarkdownRenderer source={value} />
                                                {selectedQuestion.explanations && (
                                                    <MarkdownRenderer source={selectedQuestion.explanations[key]} />
                                                )}
                                            </FormLabel>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    )}
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePreviousQuestion}
                            disabled={parseInt(index) === 0}
                            startIcon={<ArrowBack />}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleNextQuestion}
                            disabled={parseInt(index) === quizData.length - 1}
                            endIcon={<ArrowForward />}
                        >
                            Next
                        </Button>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="contained" color="error" onClick={handleEndQuiz}>
                            End Review
                        </Button>
                    </div>
                </Box>
                {showNavigation && (
                    <Box sx={{ width: '15%', display: isSmallScreen ? (menuClicked ? 'block' : 'none') : 'block', ml: '1rem' }}>
                        <Typography variant="h6" sx={{ mb: '1rem' }}>
                            Question Navigation
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {quizData.map((_, idx) => (
                                <IconButton
                                    key={idx}
                                    onClick={() => handleCircleClick(idx)}
                                    sx={{
                                        backgroundColor: getQuestionStatus(idx),
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: getQuestionStatus(idx) === 'grey' ? 'darkgrey' : getQuestionStatus(idx) === 'green' ? 'darkgreen' : 'darkred',
                                        },
                                    }}
                                >
                                    {idx + 1}
                                </IconButton>
                            ))}
                        </Box>
                    </Box>
                )}
                {!showNavigation && (
                    <IconButton className="menu-button" onClick={toggleNavigation}>
                        <Menu />
                    </IconButton>
                )}
            </Box>
        </Container>
    );
};

export default Review;
