import { Link } from "react-router-dom";
import { db } from "../db/db";
import { Sprout, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState, useEffect } from "react";
import { nurseryService } from "../services/nurseryService";
import TaskCard from "../components/TaskCard";
import { getTodayLocal } from "../utils/dateHelpers";

export default function Home() {
  const [activeNurseryId, setActiveNurseryId] = useState<number | null>(null);

  // Load active nursery
  useEffect(() => {
    const loadActiveNursery = async () => {
      const nursery = await nurseryService.getActiveNursery();
      setActiveNurseryId(nursery?.id || null);
    };
    loadActiveNursery();
  }, []);

  // Get today's tasks for active nursery
  const todayTasks = useLiveQuery(
    async () => {
      if (!activeNurseryId) return [];
      
      const today = getTodayLocal();
      
      return await db.tasks
        .where("nurseryId")
        .equals(activeNurseryId)
        .and((task) => task.date === today)
        .toArray();
    },
    [activeNurseryId]
  ) ?? [];

  const toggleTask = async (taskId: number, status: string) => {
    await db.tasks.update(taskId, {
      status: status === "completed" ? "pending" : "completed",
      completedAt: status === "completed" ? null : new Date(),
    });
  };

  const skipTask = async (taskId: number) => {
    await db.tasks.update(taskId, {
      status: "skipped",
      completedAt: new Date(),
    });
  };

  const completedCount = todayTasks.filter(t => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Tareas Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{todayTasks.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Completadas</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Progreso</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tareas de Hoy</h2>
          </div>

          {todayTasks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">¡No hay tareas pendientes hoy!</p>
            </div>
          ) : (
            todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id!, task.status)}
                onSkip={() => skipTask(task.id!)}
              />
            ))
          )}
        </div>

        <Link
          to="/tasks"
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium"
        >
          Ver todas las tareas
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/plants"
          className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium mt-3"
        >
          <Sprout className="w-4 h-4" />
          Ver Plantas
        </Link>
      </main>
    </div>
  );
}