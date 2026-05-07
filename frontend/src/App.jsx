import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Navigation from './layout/Navigation';
import Footer from './layout/Footer';

// Components
import Hero from './components/Hero';
import SignIn from './components/SignIn';
import Register from './components/Register';
import SignOut from './components/SignOut';
import WriteForm from './components/WriteForm';

// Pages
import DashBoard from './pages/DashBoard';
import BlogDetail from './pages/BlogDetail';
import AllCategories from './pages/AllCategories';
import UserAccount from './pages/UserAccount';
import SearchResults from './pages/SearchResults';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />

        <main className="main-content" style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signout" element={<SignOut />} />
            <Route path="/details" element={<AllCategories />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile" element={<UserAccount />} />
            <Route path="/write" element={<WriteForm />} />
           <Route path="/edit/:id" element={<WriteForm />} />
           <Route path="/dashboard" element={<DashBoard />} />
           <Route path="/categories" element={<AllCategories />} />
           {/* Add more routes as needed */}
         </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
