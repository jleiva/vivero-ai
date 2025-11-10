import { useState } from "react";
import { db } from "../db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { X, Calendar, Tag, FileText, Sprout } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<string>("water");
  const [payload, setPayload] = useState<string>("");
  const [plantingId, setPlantingId] = useState<number | null>(null);

  const plants = useLiveQuery(() => db.plantings.toArray(), []) ?? [];

  if (!isOpen) return null;

  const handleAdd = async () => {
    await db.tasks.add({
      nurseryId: 1,
      plantingId: plantingId || null,
      date,
      category,
      payload: payload ? JSON.parse(payload) : {},
      status: "pending",
      createdAt: new Date(),
      completedAt: null,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Agregar Tarea</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="water">💧 Riego</option>
              <option value="em">🧪 EM</option>
              <option value="fertilize">🌿 Fertilización</option>
              <option value="bokashi">✨ Bokashi</option>
              <option value="compost">🍂 Compost</option>
              <option value="woodash">🔥 Ceniza</option>
              <option value="prune">✂️ Poda</option>
            </select>
          </div>

          {/* Plant selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Sprout className="w-4 h-4" />
              Asignar a planta (opcional)
            </label>
            <select
              value={plantingId ?? ""}
              onChange={(e) => setPlantingId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">— General para el vivero —</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.speciesName} — #{p.id}
                </option>
              ))}
            </select>
          </div>

          {/* Payload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Detalles (JSON)
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder='{"dosage": "2L", "note": "Riego ligero"}'
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-24 resize-none text-sm font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}