import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import WorkoutDetail from "./WorkoutDetail";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 shadow-lg">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/workout/:id" element={<WorkoutDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>
);
