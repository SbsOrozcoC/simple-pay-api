import React from "react";
import './index.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { LoginPage, RegisterPage } from "./modules/auth";
import DashboardPage from "./modules/dashboard/pages/DashboardPage.jsx";
import { SubscriptionPage, UserPanelPage } from "./modules/subscription";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/panel" element={<UserPanelPage />} />
    </Routes>
  </BrowserRouter>
);
