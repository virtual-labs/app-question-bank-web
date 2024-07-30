import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, Chip, useMediaQuery } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowForward, Menu } from '@mui/icons-material';
// import Navbar from './Navbar';
import { Box, Container, Paper, IconButton, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { auth } from '../../authentication/FirebaseConfig.js';
import { initialTags } from '../../components/TagsColors.js';
import MarkdownRenderer from '../Search/MarkdownRenderer.js';
import { Link } from 'react-router-dom';
import '../../css/Exam.css'
import { doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from "../../authentication/FirebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AppBar, Toolbar, Avatar, Grid } from '@mui/material';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const tagColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC733',
    '#33FFF7', '#FF5733', '#A833FF', '#FF5733', '#33FF57',
    '#3357FF', '#FF33A8', '#FFC733', '#33FFF7', '#A833FF'
];

const getRandomColor = () => {
    return tagColors[Math.floor(Math.random() * tagColors.length)];
};


const Exam = ({ quizData, downloadList, setdownloadlist, setquestions, token, setToken, selectedRole, setSelectedRole, markedOptions, setMarkedOptions }) => {
    // console.log(quizData);
    const navigate = useNavigate();
    const { index } = useParams();
    const selectedQuestion = quizData[parseInt(index)];
    const currentQuestionIndex = parseInt(index);
    const [selectedOption, setSelectedOption] = useState("");
    // const [questionStatuses, setQuestionStatuses] = useState(Array(quizData.length).fill('yellow'));
    const [questionStatuses, setQuestionStatuses] = useState(Array(10).fill('yellow'));
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [showNavigation, setShowNavigation] = useState(true); // State to control navigation pane visibility
    const [menuClicked, setMenuClicked] = useState(false);
    // useEffect(() => {
    //     setSelectedOption(markedOptions[parseInt(index)]);
    // }, [selectedOption,markedOptions]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    navigate('/results');
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const handleDeselect = () => {
        setSelectedOption("");
        const newMarkedOptions = [...markedOptions];
        newMarkedOptions[parseInt(index)] = "";
        setMarkedOptions(newMarkedOptions);

        // Update question status
        const newQuestionStatuses = [...questionStatuses];
        newQuestionStatuses[parseInt(index)] = 'yellow'; // Update the status of the current question
        setQuestionStatuses(newQuestionStatuses);
    }

    function handleOptionSelect(event) {
        const newSelectedOption = event.target.value;
        setSelectedOption(newSelectedOption);
        let ans;
        if (newSelectedOption === "a")
            ans = 1
        else if (newSelectedOption === "b")
            ans = 2
        else if (newSelectedOption === "c")
            ans = 3
        else if (newSelectedOption === "d")
            ans = 4
        // Update markedOptions array
        const newMarkedOptions = [...markedOptions];
        newMarkedOptions[parseInt(index)] = ans;
        setMarkedOptions(newMarkedOptions);

        // Update question status
        const newQuestionStatuses = [...questionStatuses];
        newQuestionStatuses[parseInt(index)] = 'green'; // Update the status of the current question
        setQuestionStatuses(newQuestionStatuses);

    };

    const handleNavigation = (newIndex) => {
        setSelectedOption(quizData[newIndex]?.selectedOption || null);
        navigate(`/exam/${newIndex}`);
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

    const checkQuestionPresentInDownloadList = (question) => {
        return downloadList.some(downloadQuestion => downloadQuestion.question === question.question && downloadQuestion.difficulty === question.difficulty);
    };

    const handleAddToDownloadList = () => {
        setdownloadlist([...downloadList, selectedQuestion]);
    };

    const handleRemoveFromDownloadList = () => {
        setdownloadlist(downloadList.filter(question => question.question !== selectedQuestion.question || question.difficulty !== selectedQuestion.difficulty));
    };

    const handleMarkForReview = () => {
        const newQuestionStatuses = [...questionStatuses];
        newQuestionStatuses[parseInt(index)] = 'purple'; // Mark the question for review
        setQuestionStatuses(newQuestionStatuses);
    };

    const handleEndQuiz = () => {
        navigate('/results');
    };

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 650) {
                setShowNavigation(menuClicked);
            } else {
                setShowNavigation(true);
            }
            // console.log(window.innerWidth, "hi");
            // console.log(showNavigation, menuClicked);
        };
    
        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set the initial state based on the current window size
    
        return () => window.removeEventListener('resize', handleResize);
    }, [menuClicked]);

    const toggleNavigation = () => {
        setShowNavigation(prevState => !prevState);
        setMenuClicked(prevState => !prevState);
        // console.log(showNavigation, menuClicked);
    };

    // const isSmallScreen = useMediaQuery('(max-width:650px)');
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isMediumScreen = useMediaQuery('(max-width:960px)');

    const timeFontSize = isSmallScreen ? '3vw' : isMediumScreen ? '1.2rem' : '1.5rem';
    const questionFontSize = isSmallScreen ? '4vw' : isMediumScreen ? '1.4rem' : '1.6rem';



    // if (quizData.length === 0) {
    //     return (
    //         <div>
    //             <Navbar setquestions={setquestions} setdownloadlist={setdownloadlist} />
    //             <Card sx={{ margin: 'auto', maxWidth: 600, padding: 2 }}>
    //                 <CardContent style={{ textAlign: 'center' }}>
    //                     <Typography variant="h5">No Query Selected</Typography>
    //                     <a href="/search">Enter a query</a>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }



    const keyToNumberMap = { "a": 1, "b": 2, "c": 3, "d": 4 }; // Mapping from alphabetic keys to numeric values


    return (
        <Container maxWidth="100%" sx={{ margin: '0 auto', mt: '5vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Virtual Labs Quiz
                    </Typography>
                </Toolbar>
            </AppBar>
            {isSmallScreen && (
                <IconButton className="menu-button" onClick={toggleNavigation} sx={{ display: 'block', margin: '0 auto' }}>
                    <Menu />
                </IconButton>
            )}
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', mt: '3vh', width: '100%' }}>
                {isSmallScreen && showNavigation && (
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '5vh' }}>
                        <Typography variant="h6" sx={{ mb: '2vh' }}>
                            Navigation Pane
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                            {questionStatuses.map((status, circleIndex) => (
                                <IconButton
                                    key={circleIndex}
                                    onClick={() => handleCircleClick(circleIndex)}
                                    sx={{
                                        width: isSmallScreen ? '30px' : '40px',
                                        height: isSmallScreen ? '30px' : '40px',
                                        backgroundColor: circleIndex === currentQuestionIndex ? 'orange' : status,
                                        color: 'black',
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem',
                                        borderRadius: '50%',
                                        '&:hover': {
                                            backgroundColor: 'darkgrey',
                                        },
                                    }}
                                >
                                    {circleIndex + 1}
                                </IconButton>
                            ))}
                        </Box>
                        <Typography variant="body2" sx={{ mt: '2vh' }}>
                            Key:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '1vh' }}>
                            <Box sx={{ width: '2vw', height: '2vw', backgroundColor: 'green', mr: '1vw' }}></Box>
                            <Typography variant="body2">Answered</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '1vh' }}>
                            <Box sx={{ width: '2vw', height: '2vw', backgroundColor: 'purple', mr: '1vw' }}></Box>
                            <Typography variant="body2">Marked for Review</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '1vh' }}>
                            <Box sx={{ width: '2vw', height: '2vw', backgroundColor: 'yellow', mr: '1vw' }}></Box>
                            <Typography variant="body2">Not Answered</Typography>
                        </Box>
                        <Button variant="contained" color="primary" sx={{ mt: '2vh' }} onClick={handleMarkForReview}>
                            Mark for Review
                        </Button>
                        <Button variant="contained" color="secondary" sx={{ mt: '2vh' }} onClick={handleEndQuiz}>
                            End Quiz
                        </Button>
                    </Box>
                )}
                <Box sx={{ width: isSmallScreen ? '100%' : showNavigation ? '80%' : menuClicked ? '40%' : '100%', position: 'relative' }}>
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
                        {isSmallScreen
                            ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                            : `Time Left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                    </Typography>
                    {selectedQuestion && (
                        <Card sx={{ mb: '2vh', p: '2vh', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'left', paddingTop: isSmallScreen ? '4rem' : '1rem' }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', fontSize: questionFontSize, display: 'flex', justifyContent: 'center' }}
                                >
                                    Question {`${(parseInt(index) + 1).toString().padStart(2, '0')}`}
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
                                        {selectedQuestion.selectedTags && selectedQuestion.selectedTags.map((tag, index) => {
                                            const tagColor = 'light blue';
                                            return (
                                                <Chip key={index} label={tag} style={{ backgroundColor: tagColor }} />
                                            );
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
                                    <RadioGroup aria-label="answers" name={`question${index}`} value={selectedOption} onChange={handleOptionSelect} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'auto 1fr auto',
                                            gap: '1.5vw',
                                            alignItems: 'center',
                                            width: '100%',
                                            position: 'relative'
                                        }}>
                                            {Object.entries(selectedQuestion.answers).map(([key, value], idx) => (
                                                <React.Fragment key={key}>
                                                    {key === "b" && (
                                                        <IconButton
                                                            onClick={handlePreviousQuestion}
                                                            disabled={parseInt(index) === 0}
                                                            sx={{
                                                                backgroundColor: 'lightgreen',
                                                                color: 'gray',
                                                                gridColumn: { xs: '1 / 2', sm: '1' },
                                                                gridRow: { xs: '1', sm: '2 / span 2' },
                                                                position: { xs: 'absolute', sm: 'static' },
                                                                left: { xs: '0', sm: 'auto' },
                                                                top: { xs: '50%', sm: 'auto' },
                                                                transform: { xs: 'translateY(-50%)', sm: 'none' }
                                                            }}
                                                        >
                                                            <ArrowBack />
                                                        </IconButton>
                                                    )}
                                                    <FormControlLabel
                                                        value={key}
                                                        control={<Radio sx={{ display: 'none' }} />}
                                                        label={
                                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                    <MarkdownRenderer source={value} />
                                                                    {parseInt(key) === selectedQuestion.correctAnswer && <CheckCircle sx={{ color: 'green', ml: '0.5rem' }} />}
                                                                </div>
                                                            </div>
                                                        }
                                                        sx={{
                                                            mt: '1vh',
                                                            p: '1vh',
                                                            backgroundColor: keyToNumberMap[key] === markedOptions[parseInt(index)] ? (parseInt(key) === selectedQuestion.correctAnswer ? 'green' : '#ccc') : 'white',
                                                            color: keyToNumberMap[key] === markedOptions[parseInt(index)] ? 'white' : 'black',
                                                            borderRadius: '4px',
                                                            gridColumn: '2'
                                                        }}
                                                    />
                                                    {key === "b" && (
                                                        <IconButton
                                                            onClick={handleNextQuestion}
                                                            disabled={parseInt(index) === quizData.length - 1}
                                                            sx={{
                                                                backgroundColor: 'lightgreen',
                                                                color: 'gray',
                                                                gridColumn: { xs: '3 / 4', sm: '3' },
                                                                gridRow: { xs: '1', sm: '2 / span 2' },
                                                                position: { xs: 'absolute', sm: 'static' },
                                                                right: { xs: '0', sm: 'auto' },
                                                                top: { xs: '50%', sm: 'auto' },
                                                                transform: { xs: 'translateY(-50%)', sm: 'none' }
                                                            }}
                                                        >
                                                            <ArrowForward />
                                                        </IconButton>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                    <Button variant="contained" color="primary" sx={{ mt: '1vh', width: '20vw' }} onClick={handleDeselect}>
                                        Clear Response
                                    </Button>
                                </FormControl>
                            </CardContent>
                        </Card>
                    )}
                    {!isSmallScreen && (
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            {/* <IconButton onClick={handlePreviousQuestion} disabled={parseInt(index) === 0} sx={{ backgroundColor: 'lightgreen', color: 'gray', mr: '1.5vw' }}>
                                <ArrowBack />
                            </IconButton>
                            <IconButton onClick={handleNextQuestion} disabled={parseInt(index) === quizData.length - 1} sx={{ backgroundColor: 'lightgreen', color: 'gray', ml: '1.5vw' }}>
                                <ArrowForward />
                            </IconButton> */}
                        </div>
                    )}
                </Box>
                {!isSmallScreen && showNavigation && (
                    <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '5vh' }}>
                        <Typography variant="h6" sx={{ mb: '2vh' }}>
                            Navigation Pane
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                            {questionStatuses.map((status, circleIndex) => (
                                <IconButton
                                    key={circleIndex}
                                    onClick={() => handleCircleClick(circleIndex)}
                                    sx={{
                                        width: isSmallScreen ? '30px' : '40px',
                                        height: isSmallScreen ? '30px' : '40px',
                                        backgroundColor: circleIndex === currentQuestionIndex ? 'orange' : status,
                                        color: 'black',
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem',
                                        borderRadius: '50%',
                                        '&:hover': {
                                            backgroundColor: 'darkgrey',
                                        },
                                    }}
                                >
                                    {circleIndex + 1}
                                </IconButton>
                            ))}
                        </Box>
                        <Typography variant="body2" sx={{ mt: '2vh' }}>
                            Key:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '1vh' }}>
                            <Box sx={{ width: '2vw', height: '2vw', backgroundColor: 'green', mr: '1vw' }}></Box>
                            <Typography variant="body2">Answered</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '1vh' }}>
                            <Box sx={{ width: '2vw', height: '2vw', backgroundColor: 'purple', mr: '1vw' }}></Box>
                            <Typography variant="body2">Marked for Review</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: '1vh' }}>
                            <Box sx={{ width: '2vw', height: '2vw', backgroundColor: 'yellow', mr: '1vw' }}></Box>
                            <Typography variant="body2">Not Answered</Typography>
                        </Box>
                        <Button variant="contained" color="primary" sx={{ mt: '2vh' }} onClick={handleMarkForReview}>
                            Mark for Review
                        </Button>
                        <Button variant="contained" color="secondary" sx={{ mt: '2vh' }} onClick={handleEndQuiz}>
                            End Quiz
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Exam;