import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Schedules from "./pages/Schedules";
import Search from "./pages/Search";
import NoPage from './pages/NoPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Schedules />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<NoPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
