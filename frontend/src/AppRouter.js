import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './screens/Search/QuestionList.js';
import Quiz from './screens/ViewQuestion/Quiz.js';
import AddToQueueSharption from './screens/AddQuestions/AddQuestion.js';
import DownloadList from './screens/Download/DownloadList.js';
import { useState } from 'react';
import LoginPage from './screens/LoginPage.js';
import UserProfilePage from './screens/ProfilePage/Profile.js';
import { MathJaxContext } from 'better-react-mathjax';
import APIDocumentation from './screens/ProfilePage/ApiDocumentation.js';
import QuizInit from './screens/TakeQuiz/QuizInit.js';
import Exam from './screens/TakeQuiz/Exam.js';
import Results from './screens/TakeQuiz/Results.js';
import LandingPage from './screens/LandingPage.js';
import Review from './screens/TakeQuiz/Review.js';
import PopulateDatabasePage from './screens/PopulateDatabase/PopulateDatabase.js';
import UpdateQuestion from './screens/UpdateQuestions/UpdateQuestion.js';


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
          <Route path="/add" element={<AddToQueueSharption setquestions={setQuestions} setDownloadList={setDownloadList} email={email} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} tags={tags} setTags={setTags}/>} />
          <Route path="/search" element={<QuestionList questions={questions} setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}  tags={tags}  setTags={setTags} />} />
          <Route path="/quiz/:index" element={<Quiz questionData={questionData} setQuestionData={setQuestionData}  quizData={questions} setquestions={setQuestions} downloadList={downloadList} setdownloadlist={setDownloadList}  token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />} />
          <Route path="/downloadlist" element={<DownloadList setquestions={setQuestions} downloadList={downloadList} setDownloadList={setDownloadList} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />} />
          <Route path="/login" element={<LoginPage setDownloadList={setDownloadList} email={email} password={password} setEmail={setEmail} setPassword={setPassword} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
          <Route path="/profile" element={<UserProfilePage  setquestions={setQuestions}  email={email} password={password} setEmail={setEmail} setPassword={setPassword} token={token} setToken={setToken} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>} />
          <Route path="/api_documentation" element={<APIDocumentation selectedRole={selectedRole} setSelectedRole={setSelectedRole} setToken={setToken}/>} />
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
