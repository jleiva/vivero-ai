import React, { useState } from "react";
import { type Task } from "../db/db";
import { Droplet, Leaf, FlaskConical, Scissors, Sprout, Flame, Plus } from "lucide-react";
import AddInputLogModal from "./AddInputLogModal";

interface Props {
  task: Task;
  onToggle: () => void;
  onSkip: () => void;
}

const categoryIcons = {
  water: <Droplet className="w-5 h-5" />,
  fertilize: <Leaf className="w-5 h-5" />,
  em: <FlaskConical className="w-5 h-5" />,
  prune: <Scissors className="w-5 h-5" />,
  compost: <Leaf className="w-5 h-5" />,
  bokashi: <Sprout className="w-5 h-5" />,
  woodash: <Flame className="w-5 h-5" />
};

const categoryColors = {
  water: 'bg-blue-50 text-blue-700 border-blue-200',
  fertilize: 'bg-green-50 text-green-700 border-green-200',
  em: 'bg-purple-50 text-purple-700 border-purple-200',
  prune: 'bg-orange-50 text-orange-700 border-orange-200',
  compost: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  bokashi: 'bg-amber-50 text-amber-700 border-amber-200',
  woodash: 'bg-red-50 text-red-700 border-red-200'
};

// Map task categories to input log types
const categoryToInputType = {
  water: "water",
  fertilize: "fertilizer",
  em: "em",
  compost: "compost_tea",
  bokashi: "bokashi",
  woodash: "wood_ash",
};

export default function TaskCard({ task, onToggle, onSkip }: Props) {
  const [showLogModal, setShowLogModal] = useState(false);
  const isCompleted = task.status === "completed";
  const colorClass = categoryColors[task.category] || 'bg-gray-50 text-gray-700 border-gray-200';

  // Check if this task type can be logged
  const canLog = ["water", "fertilize", "em", "compost", "bokashi", "woodash"].includes(task.category);

  return (
    <>
      <div className={`border rounded-xl p-4 mb-3 transition-all hover:shadow-md ${
        isCompleted ? 'bg-gray-50 opacity-60' : 'bg-white'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg border ${colorClass}`}>
            {categoryIcons[task.category] || <Sprout className="w-5 h-5" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through' : ''}`}>
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </h3>
                {task.plantingId && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    Planta #{task.plantingId}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">{task.date}</span>
            </div>
            
            {task.payload?.dosage && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5" />
                Dosis: {task.payload.dosage}
              </p>
            )}
            
            {task.payload?.note && (
              <p className="text-sm text-gray-600 mt-1 italic">
                {task.payload.note}
              </p>
            )}
            
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={onToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isCompleted
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isCompleted ? "Deshacer" : "Completar"}
              </button>
              
              {task.status !== "skipped" && !isCompleted && (
                <button
                  onClick={onSkip}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Saltar
                </button>
              )}

              {/* Quick Log Button - Only for loggable task types */}
              {canLog && !isCompleted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLogModal(true);
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all flex items-center gap-1"
                  title="Registrar aplicación"
                >
                  <Plus className="w-4 h-4" />
                  Registrar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input Log Modal */}
      {showLogModal && (
        <AddInputLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          taskId={task.id || null}
          defaultInputType={categoryToInputType[task.category]}
          defaultPlantingId={task.plantingId || null}
          defaultDate={task.date}
        />
      )}
    </>
  );
}