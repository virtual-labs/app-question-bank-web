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
import QuizInit from './quiz_init.js';
import Exam from './exam.js';
import Results from './results.js';
import LandingPage from './LandingPage.js';
import Review from './review.js';
import PopulateDatabasePage from './PopulateDatabase.js';
import UpdateQuestion from './updateQuestion.js';

function AppRouter() {
  const [downloadList, setDownloadList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token,setToken]=useState('');
  const [selectedRole, setSelectedRole] = useState([]);
  const [quizQuestions, setquizQuestions] = useState([]);
  const [markedOptions,setMarkedOptions]=useState([]);
  const [questionData,setQuestionData]=useState([]);
  const [tags,setTags]=useState([]);

  return (
    <MathJaxContext>
      <Router>
        <Routes>
          <Route path="/add" element={<AddToQueueSharption setquestions={setQuestions} setDownloadList={setDownloadList} email={email} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
          <Route path="/search" element={<QuestionList questions={questions} setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}  tags={tags}  setTags={setTags} />} />
          <Route path="/quiz/:index" element={<Quiz questionData={questionData} setQuestionData={setQuestionData}  quizData={questions} setquestions={setQuestions} downloadList={downloadList} setdownloadlist={setDownloadList}  token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />} />
          <Route path="/downloadlist" element={<DownloadList setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />} />
          <Route path="/login" element={<LoginPage setDownloadList={setDownloadList} email={email} password={password} setEmail={setEmail} setPassword={setPassword} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
          <Route path="/profile" element={<UserProfilePage  setquestions={setQuestions}  email={email} password={password} setEmail={setEmail} setPassword={setPassword} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
          <Route path="/api_documentation" element={<API_Documentation selectedRole={selectedRole} setSelectedRole={setSelectedRole} setToken={setToken}/>} />
          <Route path="/space_game" element={<SpaceGame/>} />
          <Route path="/exam" element={<QuizInit  selectedRole={selectedRole} setSelectedRole={setSelectedRole} quizQuestions={quizQuestions} setquizQuestions={setquizQuestions} token={token} setToken={setToken}   /> } />
          <Route path="/exam/:index" element={<Exam quizData={quizQuestions} setquestions={setquizQuestions} downloadList={downloadList} setdownloadlist={setDownloadList}  token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} markedOptions={markedOptions} setMarkedOptions={setMarkedOptions} />} />
          <Route path="/results" element={<Results  quizData={quizQuestions} markedOptions={markedOptions} setQuestions={setQuestions} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
          <Route path="/LandingPage" element={<LandingPage selectedRole={selectedRole} setSelectedRole={setSelectedRole} setToken={setToken}/>} />
          <Route path="/review/:index" element={<Review quizData={quizQuestions} setquestions={setquizQuestions} downloadList={downloadList} setdownloadlist={setDownloadList}  token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} markedOptions={markedOptions} setMarkedOptions={setMarkedOptions} />} />
          <Route path="/PopulateDatabasePage" element={<PopulateDatabasePage selectedRole={selectedRole} setSelectedRole={setSelectedRole} setToken={setToken} token={token}/>} />
          <Route path="/update" element={<UpdateQuestion tags={tags} setTags={setTags}  questionData={questionData} setquestions={setQuestions} setDownloadList={setDownloadList} email={email} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
        </Routes>
      </Router>
    </MathJaxContext>
  );
}

export default AppRouter;
