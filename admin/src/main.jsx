import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import App from "./App.jsx";
import "./index.css";
//==========================================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <MovieProvider>
          <App />
        </MovieProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
