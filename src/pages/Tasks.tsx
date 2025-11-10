import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { useState } from "react";
import dayjs from "dayjs";

export default function Tasks() {
  const [showSkipped, setShowSkipped] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

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

  const todayTasks = tasks.filter(
    (t) => t.date === today && t.status !== "skipped"
  );
  const tomorrowTasks = tasks.filter(
    (t) => t.date === tomorrow && t.status !== "skipped"
  );
  const upcoming = tasks.filter(
    (t) => t.date > tomorrow && t.status !== "skipped"
  );
  const skipped = tasks.filter((t) => t.status === "skipped");

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Todas las tareas</h1>
      <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => setOpenModal(true)}
        >
          + Nueva
        </button>

      {/* ✅ Hoy */}
      <h2 className="font-semibold text-lg mb-2">Hoy</h2>
      {todayTasks.length === 0 && (
        <div className="text-sm text-gray-500 mb-2">No hay tareas hoy</div>
      )}
      {todayTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => toggleTask(task.id!, task.status)}
          onSkip={() => skipTask(task.id!)}
        />
      ))}

      {/* ✅ Mañana */}
      <h2 className="font-semibold text-lg mt-6 mb-2">Mañana</h2>
      {tomorrowTasks.length === 0 && (
        <div className="text-sm text-gray-500 mb-2">No hay tareas mañana</div>
      )}
      {tomorrowTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => toggleTask(task.id!, task.status)}
          onSkip={() => skipTask(task.id!)}
        />
      ))}

      {/* ✅ Próximas */}
      <h2 className="font-semibold text-lg mt-6 mb-2">Próximas</h2>
      {upcoming.length === 0 && (
        <div className="text-sm text-gray-500 mb-2">
          No hay tareas futuras
        </div>
      )}
      {upcoming.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => toggleTask(task.id!, task.status)}
          onSkip={() => skipTask(task.id!)}
        />
      ))}

      {/* ✅ Skipped Tasks Collapsible Panel */}
      {skipped.length > 0 && (
        <div className="mt-6">
          <button
            className="w-full flex items-center justify-between p-2 bg-gray-200 rounded"
            onClick={() => setShowSkipped(!showSkipped)}
          >
            <span className="font-medium text-sm text-gray-700">
              {showSkipped ? "Ocultar" : "Mostrar"} tareas saltadas
            </span>
            <span className="text-gray-600 text-sm">{skipped.length}</span>
          </button>

          {showSkipped && (
            <div className="mt-2 space-y-2">
              {/* ✅ Restore All */}
              <button
                className="w-full bg-blue-500 text-white text-sm py-2 rounded shadow mb-2"
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
        </div>
      )}
      <AddTaskModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
