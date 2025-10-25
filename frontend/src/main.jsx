import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home.jsx'

import "./lang/i18n";

import AIAsistan from "./components/AIAsistan.jsx";
import { useTranslation } from "react-i18next";
const { t } = useTranslation();

import Footer from "./components/Footer.jsx";
// Sayfanın altında:
<Footer />

// JSX içinde:
<AIAsistan t={t} />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home/>
  </React.StrictMode>
)
