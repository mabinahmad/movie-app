import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MovieProvider } from "./context/MovieContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AuthProvider>
          <ThemeProvider>
            <MovieProvider>
              <App />
            </MovieProvider>
          </ThemeProvider>
        </AuthProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
