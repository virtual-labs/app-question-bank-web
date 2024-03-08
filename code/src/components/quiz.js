import React, { useState } from 'react';
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';

function Quiz({ quizData }) {
  const [showExplanations, setShowExplanations] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      {quizData.questions.map((question, index) => (
        <Card key={index} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <CardContent>
            <Typography variant="h6">Question {index + 1}</Typography>
            <Typography variant="body1">{question.question}</Typography>
            <FormControl component="fieldset" sx={{ marginTop: 2 }}>
              <FormLabel component="legend">Answers:</FormLabel>
              <RadioGroup aria-label="answers" name={`question${index}`} value={selectedOption} onChange={handleOptionChange}>
                {Object.entries(question.answers).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio sx={{ color: '#3f51b5' }} />}
                    label={value}
                    sx={{
                      marginTop: 1,
                      padding: 1,
                      backgroundColor: selectedOption === key ? (key === question.correctAnswer ? '#58e21c' : '#ef5766') : '#ffffff',
                      borderRadius: '4px'
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {showExplanations && question.explanations && (
              <Typography variant="body2" sx={{ marginTop: 2 }}>Explanation: {question.explanations}</Typography>
            )}
          </CardContent>
        </Card>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => setShowExplanations(!showExplanations)} sx={{ marginTop: 2 }}>
          {showExplanations ? 'Hide Explanations' : 'Show Explanations'}
        </Button>
      </div>
    </div>
  );
}
export default Quiz;