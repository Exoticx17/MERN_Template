import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react' 
import Navbar from './components/navbar';
import Landing from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import Files from './pages/files';
import Votes from './pages/votes';
import Basic from './pages/basic';
import Footer from './components/footer';
import User from './pages/user';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className='routes'> 
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/files" element={<Files />}/>
            <Route exact path="/votes" element={<Votes />} />
            <Route exact path="/basic" element={<Basic />} />
            <Route exact path="/user" element={<User />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;