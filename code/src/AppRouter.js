import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './QuestionList';
import Quiz from './Quiz';
import AddToQueueSharption from './AddQuestion';
import DownloadList from './downloadlist';
import { useState } from 'react';
import LoginPage from './LoginPage';

function AppRouter() {
  const [downloadList, setDownloadList] = useState([]);
  // ADD CODE TO GET DOWNLOAD LIST FROM SERVER
  const [questions, setQuestions] = useState([])
  return (
    <Router>
      <Routes>
        <Route path="/add" element={<AddToQueueSharption />} setquestions = {setQuestions} setDownloadList = {setDownloadList}/>
        <Route path="/search" element={<QuestionList questions={questions} setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} />} />
        <Route path="/quiz/:index" element={<Quiz quizData={questions} setquestions ={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} />} />
        <Route path="/downloadlist" element={<DownloadList setquestions = {setQuestions} downloadList={downloadList} setDownloadList={setDownloadList}  />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
