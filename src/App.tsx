import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Plants from "./pages/Plants";
import { seedFakeTasks } from "./db/seedFakeTasks";
import { seedTestNursery } from './db/seedTestNursery'

export default function App() {
  useEffect(() => {
    seedFakeTasks();
    seedTestNursery();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/plants" element={<Plants />} />
    </Routes>
  );
}
