import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Plus, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { nurseryService } from "../services/nurseryService";

export default function Tasks() {
  const [showSkipped, setShowSkipped] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeNurseryId, setActiveNurseryId] = useState<number | null>(null);

  // Load active nursery
  useEffect(() => {
    const loadActiveNursery = async () => {
      const nursery = await nurseryService.getActiveNursery();
      setActiveNurseryId(nursery?.id || null);
    };
    loadActiveNursery();
  }, []);

  // Get tasks filtered by active nursery
  const allTasks = useLiveQuery(
    async () => {
      if (!activeNurseryId) return [];
      return await db.tasks
        .where("nurseryId")
        .equals(activeNurseryId)
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

  const today = dayjs().format("YYYY-MM-DD");
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

  const todayTasks = allTasks.filter(
    (t) => t.date === today && t.status !== "skipped"
  );
  const tomorrowTasks = allTasks.filter(
    (t) => t.date === tomorrow && t.status !== "skipped"
  );
  const upcoming = allTasks.filter(
    (t) => t.date > tomorrow && t.status !== "skipped"
  );
  const skipped = allTasks.filter((t) => t.status === "skipped");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Todas las Tareas</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        </div>

        {/* Today */}
        <section className="mb-8">
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Hoy</h2>
          {todayTasks.length === 0 ? (
            <div className="text-sm text-gray-500 bg-white rounded-lg p-4 border border-gray-200">
              No hay tareas hoy
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
        </section>

        {/* Tomorrow */}
        <section className="mb-8">
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Mañana</h2>
          {tomorrowTasks.length === 0 ? (
            <div className="text-sm text-gray-500 bg-white rounded-lg p-4 border border-gray-200">
              No hay tareas mañana
            </div>
          ) : (
            tomorrowTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id!, task.status)}
                onSkip={() => skipTask(task.id!)}
              />
            ))
          )}
        </section>

        {/* Upcoming */}
        <section className="mb-8">
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Próximas</h2>
          {upcoming.length === 0 ? (
            <div className="text-sm text-gray-500 bg-white rounded-lg p-4 border border-gray-200">
              No hay tareas futuras
            </div>
          ) : (
            upcoming.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id!, task.status)}
                onSkip={() => skipTask(task.id!)}
              />
            ))
          )}
        </section>

        {/* Skipped Tasks */}
        {skipped.length > 0 && (
          <section>
            <button
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              onClick={() => setShowSkipped(!showSkipped)}
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                {showSkipped ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                {showSkipped ? "Ocultar" : "Mostrar"} tareas saltadas
              </span>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {skipped.length}
              </span>
            </button>

            {showSkipped && (
              <div className="mt-3 space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-3 rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                  onClick={async () => {
                    await Promise.all(
                      skipped.map((task) =>
                        db.tasks.update(task.id!, {
                          status: "pending",
                          completedAt: null,
                        })
                      )
                    );
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar todas
                </button>

                {skipped.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id!, task.status)}
                    onSkip={() => skipTask(task.id!)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <AddTaskModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}