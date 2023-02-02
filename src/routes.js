import React from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";

// layouts
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";
// import DashboardLayout from "./layouts/dashboard";
// import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";

// pages
import {
  // auth
  Login,
  Register,
} from "./pages";

import ChatPageTest from "./pages/ChatPageTest/ChatPageTest";
// ----------------------------------------------------------------------
const Authentication = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/chat"></Navigate>;
  }
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login"> </Navigate>;
  }
};

export default function Router() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/chat" element={<ChatPageTest />} />
      </Route>

      <Route path="/" element={<Authentication />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
