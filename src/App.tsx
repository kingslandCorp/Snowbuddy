import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ResortPage } from "./pages/ResortPage";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resorts/:slug" element={<ResortPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
