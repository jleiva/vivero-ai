import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Plants from "./pages/Plants";
import SpeciesLibrary from "./pages/SpeciesLibrary";
import SeasonCalendar from "./pages/SeasonCalendar";
import NurserySetupWizard from "./pages/NurserySetupWizard";
import NurserySettings from "./pages/NurserySettings";
import { seedFakeTasks } from "./db/seedFakeTasks";
// import { seedTestNursery } from "./db/seedTestNursery";
import { speciesService } from "./services/speciesService";
import { nurseryService } from "./services/nurseryService";
import SplashScreen from "./components/SplashScreen";
import { Navigation } from "./components/Navigation";

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [hasNursery, setHasNursery] = useState(false);

  // Function to check nursery status
  const checkNursery = async () => {
    const nurseryExists = await nurseryService.hasNursery();
    console.log('nurseryExists', nurseryExists);
    setHasNursery(nurseryExists);
    return nurseryExists;
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Initializing Vivero Maestro...");

        // Initialize species data first
        await speciesService.initialize();

        // Check if user has nursery
        const nurseryExists = await checkNursery();

        // Seed fake tasks only if nursery exists (for demo)
        if (nurseryExists) {
          await seedFakeTasks();
        }

        console.log("✅ App initialization complete");
        setIsInitializing(false);
      } catch (error) {
        console.error("❌ App initialization failed:", error);
        setInitError(error.message);
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while initializing
  if (isInitializing) {
    return <SplashScreen message="Cargando especies..." />;
  }

  // Show error if initialization failed
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error de Inicialización</h2>
          <p className="text-red-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Redirect to setup if no nursery exists
  if (!hasNursery) {
    return (
      <Routes>
        <Route path="/setup" element={<NurserySetupWizard onComplete={checkNursery} />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    );
  }

  return (
    <>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/plants" element={<Plants />} />
      <Route path="/species" element={<SpeciesLibrary />} />
      <Route path="/season" element={<SeasonCalendar />} />
      <Route path="/settings/nursery" element={<NurserySettings />} />
      <Route path="/setup" element={<Navigate to="/" replace />} />
    </Routes>
    </>
    
  );
}