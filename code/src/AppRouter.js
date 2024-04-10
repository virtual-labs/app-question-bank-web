import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './QuestionList';
import Quiz from './Quiz';
import AddToQueueSharption from './AddQuestion';
import DownloadList from './downloadlist';
import { useState } from 'react';
import LoginPage from './LoginPage';
import UserProfilePage from './profile';
import { MathJaxContext } from 'better-react-mathjax';

function AppRouter() {
  const [downloadList, setDownloadList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <MathJaxContext>
      <Router>
        <Routes>
          <Route path="/add" element={<AddToQueueSharption setquestions={setQuestions} setDownloadList={setDownloadList} />} />
          <Route path="/search" element={<QuestionList questions={questions} setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} />} />
          <Route path="/quiz/:index" element={<Quiz quizData={questions} setquestions={setQuestions} downloadList={downloadList} setdownloadlist={setDownloadList} />} />
          <Route path="/downloadlist" element={<DownloadList setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} />} />
          <Route path="/login" element={<LoginPage setDownloadList={setDownloadList} email={email} password={password} setEmail={setEmail} setPassword={setPassword} />} />
          <Route path="/profile" element={<UserProfilePage email={email} password={password} setEmail={setEmail} setPassword={setPassword} />} />
        </Routes>
      </Router>
    </MathJaxContext>
  );
}

export default AppRouter;
