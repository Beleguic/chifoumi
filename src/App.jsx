// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/AuthContext"; // Importer AuthProvider
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Matches from "./pages/Matches";
import Game from "./pages/Game"; // nouvelle page pour le jeu
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <UserProvider> {/* Envelopper l'ensemble de l'application avec AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Route protégée pour la liste des matchs */}
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />

          {/* Route protégée pour le jeu, en fonction de l'ID du match */}
          <Route
            path="/game/:matchId"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
