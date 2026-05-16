import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MT5IndicatorPage from "./pages/MT5IndicatorPage";
import AlgoStrategyPage from "./pages/AlgoStrategyPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/mt5-indicator" element={<MT5IndicatorPage />} />
          <Route path="/products/algo-strategy" element={<AlgoStrategyPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
