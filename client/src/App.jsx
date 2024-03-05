import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/Login/Login";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { SignupPage } from "./pages/Signup/Signup";
import { FrontPage } from "./pages/Front/FrontPage";
import { WatchLaterPage } from "./pages/WatchLater/WatchLater";
import { ForgotPasswordPage } from "./pages/ForgotPassword/ForgotPassword";
import { ThemeContext } from "./context/ThemeContext";
import ProtectedRoute from "./hooks/ProtectedRoute";
import ProtectedRouterAfterLogin from "./hooks/ProtectedRouterAfterLogin";
import "./App.css";
//==========================================================================

function App() {
  const { isLightMode } = useContext(ThemeContext);

  return (
    <div className={`app ${isLightMode ? "light-mode" : ""}`}>
      <Header />
      <Routes>
        <Route element={<ProtectedRouterAfterLogin />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/watchlater" element={<WatchLaterPage />} />
        </Route>
        <Route path="/" element={<FrontPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
