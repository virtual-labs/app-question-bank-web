import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Grid, Button } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend);

const ResultsText = ({ correctCount, incorrectCount, leftCount, finalScore }) => {
    return (
        <Box sx={{ fontSize: '1.2rem', textAlign: 'left', pl: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'green' }}>
                Number of Correct Choices: {correctCount}/10
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'red' }}>
                Number of Incorrect Choices: {incorrectCount}/10
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'orange' }}>
                Number of Left Questions: {leftCount}/10
            </Typography>
            <Box my={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: '2rem', color: 'blue' }}>
                    Final Score: {finalScore} out of 40
                </Typography>
            </Box>
        </Box>
    );
};

const ResultsChart = ({ correctCount, incorrectCount, leftCount }) => {
    const data = {
        labels: ['Correct', 'Incorrect', 'Left'],
        datasets: [
            {
                data: [correctCount, incorrectCount, leftCount],
                backgroundColor: ['green', 'red', 'yellow'],
            },
        ],
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Pie data={data} />
        </Box>
    );
};

// function make_correct()

const Results = ({ markedOptions, quizData, setQuestions, selectedRole, setSelectedRole }) => {
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [leftCount, setLeftCount] = useState(0);
    const [finalScore, setFinalScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let correct = 0;
        let incorrect = 0;
        let left = 0;
        let score = 0;

        quizData.forEach((question, index) => {
            let markedOption = markedOptions[index];

            if (markedOption !== null && markedOption !== undefined && markedOption !== "") 
            {
                console.log(markedOption);
                if(markedOption === 1)
                    {
                        markedOption = "a";
                    }
                else if(markedOption === 2)
                    {
                        markedOption = "b";
                    }
                else if(markedOption === 3)
                    {
                        markedOption = "c";
                    }
                else if(markedOption === 4)
                    {
                        markedOption = "d";
                    }
                    if(question.correctAnswer === 1)
                    {
                        question.correctAnswer = "a";   
                    }
                    else if(question.correctAnswer === 2)
                    {
                        question.correctAnswer = "b";
                    }
                    else if(question.correctAnswer === 3)
                    {
                        question.correctAnswer = "c";
                    }
                    else if(question.correctAnswer=="d")
                        question.correctAnswer = "d";

                if (markedOption === question.correctAnswer) 
                {
                    correct++;
                    score += 4; // +4 points for correct choice
                } else 
                {
                    incorrect++;
                    score -= 1; // -1 point for incorrect choice
                }
            } 
            else 
            {
                left++;
            }
        });

        setCorrectCount(correct);
        setIncorrectCount(incorrect);
        setLeftCount(left);
        setFinalScore(score);
    }, [markedOptions, quizData]);

    const handleReviewTest = () => {
        navigate('/review/0');
    };

    return (
        <>
            <Navbar setQuestions={setQuestions} setSelectedRole={setSelectedRole} selectedRole={selectedRole} />
            <Container maxWidth="lg">
                <Box textAlign="center" my={4}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Results
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <ResultsText
                            correctCount={correctCount}
                            incorrectCount={incorrectCount}
                            leftCount={leftCount}
                            finalScore={finalScore}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ResultsChart
                            correctCount={correctCount}
                            incorrectCount={incorrectCount}
                            leftCount={leftCount}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button variant="contained" color="primary" onClick={handleReviewTest} sx={{ fontSize: '1rem' }}>
                        Review Test
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default Results;
