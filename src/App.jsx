import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MiPerfil from "./pages/Auth/MiPerfil";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/miperfil" element={<MiPerfil />} />
        </Routes>
      </Router>
    );
}

export default App;
