// ============================================
// 6. Updated Home.tsx - Show Nursery Info
// ============================================
import { Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useNursery } from "../hooks/useNursery";
import { useSeason } from "../hooks/useSeason";
import TaskCard from "../components/TaskCard";
import { SeasonIndicator } from "../components/SeasonIndicator";
import { db } from "../db/db";
import { Sprout, Calendar, CheckCircle2, Plus, ArrowRight, Settings } from "lucide-react";

export default function HomeWithNursery() {
  const todayTasks = useTasks();
  const nursery = useNursery();
  const seasonInfo = useSeason(nursery?.region || "guanacaste");

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {nursery?.name || "Vivero Maestro"}
              </h1>
              <p className="text-sm text-gray-500 capitalize">
                {nursery?.region && `${nursery.region} • `}
                {seasonInfo.seasonName}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link
              to="/tasks"
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-all"
            >
              Tareas
            </Link>
            <Link
              to="/plants"
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-all"
            >
              Plantas
            </Link>
            <Link
              to="/settings/nursery"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Season Indicator */}
        <div className="mb-6">
          <SeasonIndicator region={nursery?.region || "guanacaste"} />
        </div>

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