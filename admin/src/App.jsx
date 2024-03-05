import { useContext } from "react";
import Movie from "./pages/Movie/Movie";
import { Genre } from "./pages/Genre/Genre";
import { Genres } from "./pages/Genres/Genres";
import { Movies } from "./pages/Movies/Movies";
import { Route, Routes } from "react-router-dom";
import { MovieEdit } from "./pages/Movie/MovieEdit";
import { GenreEdit } from "./pages/Genre/GenreEdit";
import { Home } from "./pages/Home/Home";
import { SideBar } from "./components/SideBar/SideBar";
import { Header } from "./components/Header/Header";
import { Users } from "./pages/Users/Users";
import { User } from "./pages/User/User";
import { LoginPage } from "./pages/Login/Login";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { ProtectedRouterAfterLogin } from "./hooks/ProtectedRouteAfterLogin";
import { UserContext } from "./context/UserContext";
import { useRoleBasedAccess } from "./hooks/useRoleBasedAccess";
import "./App.css";
//=============================================================================

function App() {
  const { token } = useContext(UserContext);

  return (
    <>
      <div className="app">
        <Header />
        {token && <SideBar />}

        <div className="main-content">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route
                element={useRoleBasedAccess([
                  "Super Admin",
                  "Content Administrator",
                ])}
              >
                <Route path="/movies" element={<Movies />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/movie-create" element={<Movie />} />
                <Route path="/movie-edit/:movieId" element={<MovieEdit />} />
                <Route path="/genre-create" element={<Genre />} />
                <Route path="/genre-edit/:genreId" element={<GenreEdit />} />
              </Route>

              <Route
                element={useRoleBasedAccess([
                  "Super Admin",
                  "User Administrator",
                ])}
              >
                <Route path="/users" element={<Users />} />
                <Route path="/user-create" element={<User />} />
              </Route>
            </Route>

            <Route element={<ProtectedRouterAfterLogin />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
