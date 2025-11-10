import React from "react";
import { type Task } from "../db/db";
import { categoryIcons, DefaultIcon } from "../utils/taskIcons";

interface Props {
  task: Task;
  onToggle: () => void;
  onSkip: () => void;
}

export default function TaskCard({ task, onToggle, onSkip }: Props) {
  const isCompleted = task.status === "completed";

  return (
    <div className="border rounded-lg p-3 mb-2 flex justify-between items-center bg-white shadow-sm">
      <div className="flex items-center gap-2">
        {/* Icon */}
        <span>{categoryIcons[task.category] ?? <DefaultIcon />}</span>

        <div>
          <p
            className={`font-semibold ${
              isCompleted ? "line-through text-gray-500" : ""
            }`}
          >
            {task.category}
            {task.plantingId && (
              <span className="text-xs text-blue-600 ml-1">
                (Planta #{task.plantingId})
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">{task.date}</p>
           {/* ✅ Dosage & notes */}
  {task.payload?.dosage && (
    <p className="text-xs text-green-700 mt-1">
      💧 Dosis: {task.payload.dosage}
    </p>
  )}

  {task.payload?.note && (
    <p className="text-xs text-gray-700 italic mt-1">
      ✍️ {task.payload.note}
    </p>
  )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Complete button */}
        <button
          onClick={onToggle}
          className={`px-3 py-1 rounded text-sm ${
            isCompleted ? "bg-yellow-200" : "bg-green-200"
          }`}
        >
          {isCompleted ? "Deshacer" : "Completar"}
        </button>

        {/* Skip button */}
        {task.status !== "skipped" && (
          <button
            onClick={onSkip}
            className="px-3 py-1 rounded bg-red-200 text-sm"
          >
            Saltar
          </button>
        )}
      </div>
    </div>
  );
}
