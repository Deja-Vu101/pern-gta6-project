import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./home/Home.tsx";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WaitList from "./waitlist/WaitList.tsx";
import { Login } from "./auth-pages/login/Login.tsx";
import Register from "./auth-pages/register/Register.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<WaitList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </QueryClientProvider>
    </React.StrictMode>
  </BrowserRouter>
);
