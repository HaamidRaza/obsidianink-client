import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  MutationObserver,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
axios.defaults.withCredentials = true;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
        <ToastContainer position="bottom-right"/>
      </QueryClientProvider>
    </ClerkProvider>
  </BrowserRouter>,
);
