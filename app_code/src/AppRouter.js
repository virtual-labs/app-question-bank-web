import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './QuestionList.js';
import Quiz from './Quiz';
import AddToQueueSharption from './AddQuestion';
import DownloadList from './downloadlist';
import { useState } from 'react';
import LoginPage from './LoginPage';
import UserProfilePage from './profile';
import { MathJaxContext } from 'better-react-mathjax';
import API_Documentation from './api_documentation.js';
import SpaceGame from './spaceGame.js';


function AppRouter() {
  const [downloadList, setDownloadList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token,setToken]=useState('');

  return (
    <MathJaxContext>
      <Router>
        <Routes>
          <Route path="/add" element={<AddToQueueSharption setquestions={setQuestions} setDownloadList={setDownloadList} email={email} token={token} setToken={setToken} />} />
          <Route path="/search" element={<QuestionList questions={questions} setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} token={token} setToken={setToken}/>} />
          <Route path="/quiz/:index" element={<Quiz quizData={questions} setquestions={setQuestions} downloadList={downloadList} setdownloadlist={setDownloadList}  token={token} setToken={setToken} />} />
          <Route path="/downloadlist" element={<DownloadList setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} token={token} setToken={setToken}/>} />
          <Route path="/login" element={<LoginPage setDownloadList={setDownloadList} email={email} password={password} setEmail={setEmail} setPassword={setPassword} token={token} setToken={setToken}/>} />
          <Route path="/profile" element={<UserProfilePage  setquestions={setQuestions}  email={email} password={password} setEmail={setEmail} setPassword={setPassword} token={token} setToken={setToken}/>} />
          <Route path="/api_documentation" element={<API_Documentation/>} />
          <Route path="/space_game" element={<SpaceGame/>} />
        </Routes>
      </Router>
    </MathJaxContext>
  );
}

export default AppRouter;
