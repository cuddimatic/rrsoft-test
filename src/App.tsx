import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.js"
import Result from "./pages/Results";
import ArticleCreation from "./pages/ArticleCreation";

const App: React.FC = () => {
  return (
    <>
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={<Result />} />
        <Route path="/create" element={<ArticleCreation />} />
      </Routes>
    </Router>
    </>
   
  );
};

export default App;

