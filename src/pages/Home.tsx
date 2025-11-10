import { Link } from "react-router-dom";
import { useTasks } from "..//hooks/useTasks";
import TaskCard from "../components/TaskCard";
import { db } from "../db/db";

export default function Home() {
  const todayTasks = useTasks();

  const toggleTask = async (taskId: number, status: string) => {
    await db.tasks.update(taskId, {
      status: status === "completed" ? "pending" : "completed",
      completedAt: status === "completed" ? null : new Date(),
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Vivero Maestro 🌱</h1>
      <h2 className="text-lg font-semibold mb-2">Hoy</h2>

      {todayTasks.length === 0 && (
        <p className="text-gray-500">No hay tareas hoy.</p>
      )}

      {todayTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => toggleTask(task.id!, task.status)}
        />
      ))}

      <Link
        to="/tasks"
        className="block mt-4 bg-green-600 text-white py-2 rounded text-center"
      >
        Ver todas las tareas →
      </Link>
      <Link to="/plants" className="bg-blue-500 text-white px-3 py-1 rounded">
    Ver Plantas
  </Link>
    </div>
  );
}
