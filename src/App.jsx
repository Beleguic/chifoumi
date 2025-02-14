// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/AuthContext"; // Importer AuthProvider
import Register from "./pages/Register";
import Login from "./pages/Login";
import Matches from "./pages/Matches";
import Game from "./pages/Game"; // nouvelle page pour le jeu
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const App = () => {
  return (
    <UserProvider> {/* Envelopper l'ensemble de l'application avec AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/matches" />} /> 
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
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
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
