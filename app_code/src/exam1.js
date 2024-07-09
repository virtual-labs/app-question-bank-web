import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, ArrowForward, Menu } from '@mui/icons-material';
import Navbar from './Navbar';
import { Box, Container, Paper, IconButton, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth } from './firebaseConfig';
import { initialTags } from './tagsColors';
import MarkdownRenderer from './MarkdownRenderer';
import { Link } from 'react-router-dom';

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                user.getIdToken().then((token) => setToken(token));
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

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



    const keyToNumberMap = { "a": 1, "b": 2, "c": 3, "d": 4 }; // Mapping from alphabetic keys to numeric values


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 650) {
                setShowNavigation(false);
            } else {
                setShowNavigation(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleNavigation = () => {
        setShowNavigation(prevState => !prevState);
    };


    return (
        <Container maxWidth="100%" sx={{ margin: '0 auto', mt: 5 }}>
            <Navbar setquestions={setquestions} setdownloadlist={setdownloadlist} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <div className="container">
                    <div className={showNavigation ? 'full-width-box' : 'question-box'}>

                        <Typography
                            variant="body1"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                color: 'black', // Change color as desired
                                zIndex: 999,
                                backgroundColor: '#fff', // Change background color as desired
                                padding: '8px',
                            }}
                        >
                            Time Remaining: {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                        </Typography>
                        {selectedQuestion && (
                            <Card sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'left' }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', display: 'flex', justifyContent: 'center' }}
                                    >
                                        Question {`${(parseInt(index) + 1).toString().padStart(2, '0')}`}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', display: 'flex', justifyContent: 'left' }}>Tags:</Typography>
                                    <div style={{ display: 'flex', justifyContent: 'left' }}>
                                        {selectedQuestion.selectedTags && selectedQuestion.selectedTags.map((tag, idx) => {
                                            const tagColor = initialTags.find(t => t.label === tag)?.color || '#000000';
                                            return (
                                                <Chip key={idx} label={tag} style={{ backgroundColor: tagColor }} />
                                            );
                                        })}
                                    </div>
                                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', display: 'flex', justifyContent: 'left' }}>Difficulty:</Typography>
                                    <div style={{ display: 'flex', justifyContent: 'left' }}>
                                        <Chip label={selectedQuestion.difficulty} style={{ backgroundColor: selectedQuestion.difficulty === 'easy' ? 'blue' : selectedQuestion.difficulty === 'medium' ? 'orange' : 'grey' }} />
                                    </div>
                                    {selectedQuestion.image && (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <img
                                                src={selectedQuestion.image}
                                                style={{ width: '200px', cursor: 'pointer' }}
                                                onMouseOver={(e) => e.target.style.cursor = 'zoom-in'}
                                                onMouseOut={(e) => e.target.style.cursor = 'pointer'}
                                                onClick={(e) => e.target.style.width = e.target.style.width === '200px' ? '580px' : '200px'}
                                            />
                                        </div>
                                    )}
                                    <MarkdownRenderer source={selectedQuestion.question} sx={{ fontWeight: 'bold', justifyContent: 'center' }} style={{ display: 'flex', justifyContent: 'center' }} />
                                    <FormControl component="fieldset" sx={{ mt: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel component="legend" style={{ display: 'flex', justifyContent: 'center' }}>Answers:</FormLabel>
                                        <RadioGroup aria-label="answers" name={`question${index}`} value={selectedOption} onChange={handleOptionSelect} style={{ display: 'flex', justifyContent: 'center' }}>
                                            {Object.entries(selectedQuestion.answers).map(([key, value], idx) => (
                                                <FormControlLabel
                                                    key={key}
                                                    value={key}
                                                    control={<Radio sx={{ display: 'none' }} />}
                                                    label={
                                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                <MarkdownRenderer source={value} />
                                                                {parseInt(key) === selectedQuestion.correctAnswer && (
                                                                    <CheckCircle sx={{ color: 'green', ml: 1 }} />
                                                                )}
                                                            </div>

                                                        </div>
                                                    }
                                                    sx={{
                                                        mt: 1,
                                                        p: 1,
                                                        backgroundColor: keyToNumberMap[key] === markedOptions[parseInt(index)] ? (parseInt(key) === selectedQuestion.correctAnswer ? 'green' : '#ccc') : 'white',
                                                        color: keyToNumberMap[key] === markedOptions[parseInt(index)] ? 'white' : 'black',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            ))}
                                        </RadioGroup>
                                        <Button variant="contained" color="primary" sx={{ mt: 1, width: '200px' }} onClick={handleDeselect}>
                                            Clear Response
                                        </Button>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        )}
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <IconButton onClick={handlePreviousQuestion} disabled={parseInt(index) === 0} sx={{ backgroundColor: 'lightgreen', color: 'gray', mr: 3 }}>
                                <ArrowBack />
                            </IconButton>
                            <IconButton onClick={handleNextQuestion} disabled={parseInt(index) === quizData.length - 1} sx={{ backgroundColor: 'lightgreen', color: 'gray', ml: 3 }}>
                                <ArrowForward />
                            </IconButton>
                        </div>



                        {/* Existing code for time remaining and question display */}



                        {/* Replace Box with div className={showNavigation ? 'navigation-pane' : 'menu-button'} */}
                        {showNavigation ? (
                            <div className="navigation-pane">

                                <Typography variant="h6" sx={{ mb: 2 }}>Navigation Pane</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                    {questionStatuses.map((status, idx) => (
                                        <IconButton
                                            key={idx}
                                            onClick={() => handleCircleClick(idx)}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: status === 'green' ? 'green' : status === 'purple' ? 'purple' : 'yellow',
                                                margin: 1,
                                                position: 'relative', // Add position relative for positioning the dotted lines
                                                '&:hover': {
                                                    backgroundColor: status === 'green' ? 'green' : status === 'purple' ? 'purple' : 'yellow',
                                                },
                                                // Conditional styles for dotted lines
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '-10px', // Adjust top position as needed
                                                    left: '-10px', // Adjust left position as needed
                                                    width: '60px', // Adjust width as needed
                                                    height: '60px', // Adjust height as needed
                                                    border: '1px dotted black',
                                                    borderRadius: '50%', // Make it circular
                                                    display: idx === currentQuestionIndex ? 'block' : 'none', // Show only for current question
                                                },
                                            }}
                                        >
                                            {idx + 1} {/* Display question number */}
                                        </IconButton>
                                    ))}
                                </Box>
                                <Typography variant="body2" sx={{ mt: 2 }}>Key:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Box sx={{ width: 20, height: 20, backgroundColor: 'green', mr: 1 }}></Box>
                                    <Typography variant="body2">Answered</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Box sx={{ width: 20, height: 20, backgroundColor: 'purple', mr: 1 }}></Box>
                                    <Typography variant="body2">Answered & Marked for Review</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Box sx={{ width: 20, height: 20, backgroundColor: 'yellow', mr: 1 }}></Box>
                                    <Typography variant="body2">Not Answered</Typography>
                                </Box>
                                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleMarkForReview}>
                                    Mark for Review
                                </Button>
                                <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleEndQuiz}>
                                    End Quiz
                                </Button>


                                {/* Existing navigation pane code */}
                            </div>
                        ) : (
                            <IconButton className="menu-button" onClick={toggleNavigation}>
                                <Menu />
                            </IconButton>
                        )}
                    </div>
                    {showNavigation && (
                        <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                            {/* Existing code for navigation pane */}


                            <Typography variant="h6" sx={{ mb: 2 }}>Navigation Pane</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                {questionStatuses.map((status, idx) => (
                                    <IconButton
                                        key={idx}
                                        onClick={() => handleCircleClick(idx)}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: status === 'green' ? 'green' : status === 'purple' ? 'purple' : 'yellow',
                                            margin: 1,
                                            position: 'relative', // Add position relative for positioning the dotted lines
                                            '&:hover': {
                                                backgroundColor: status === 'green' ? 'green' : status === 'purple' ? 'purple' : 'yellow',
                                            },
                                            // Conditional styles for dotted lines
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '-10px', // Adjust top position as needed
                                                left: '-10px', // Adjust left position as needed
                                                width: '60px', // Adjust width as needed
                                                height: '60px', // Adjust height as needed
                                                border: '1px dotted black',
                                                borderRadius: '50%', // Make it circular
                                                display: idx === currentQuestionIndex ? 'block' : 'none', // Show only for current question
                                            },
                                        }}
                                    >
                                        {idx + 1} {/* Display question number */}
                                    </IconButton>
                                ))}
                            </Box>
                            <Typography variant="body2" sx={{ mt: 2 }}>Key:</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Box sx={{ width: 20, height: 20, backgroundColor: 'green', mr: 1 }}></Box>
                                <Typography variant="body2">Answered</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Box sx={{ width: 20, height: 20, backgroundColor: 'purple', mr: 1 }}></Box>
                                <Typography variant="body2">Answered & Marked for Review</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Box sx={{ width: 20, height: 20, backgroundColor: 'yellow', mr: 1 }}></Box>
                                <Typography variant="body2">Not Answered</Typography>
                            </Box>
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleMarkForReview}>
                                Mark for Review
                            </Button>
                            <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleEndQuiz}>
                                End Quiz
                            </Button>




                        </Box>
                    )}
                </div>
            </Box>
        </Container>
    );
};

export default Exam;
