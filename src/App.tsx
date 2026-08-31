import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SnowfallBackground } from "./components/SnowfallBackground";
import { HomePage } from "./pages/HomePage";
import { ResortPage } from "./pages/ResortPage";

function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SnowfallBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resorts/:slug" element={<ResortPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
