// src/components/AddTaskModal.tsx
import { useState } from "react";
import { db } from "../db/db";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ Allows plant-specific OR general tasks
export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<string>("water");
  const [payload, setPayload] = useState<string>("");
  const [plantingId, setPlantingId] = useState<number | null>(null);

  const plants = useLiveQuery(() => db.plantings.toArray(), []) ?? [];

  if (!isOpen) return null;

  const handleAdd = async () => {
    await db.tasks.add({
      nurseryId: 1, // default nursery for now
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-80 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Agregar Tarea</h2>

        {/* Date */}
        <label className="block text-sm mb-1 font-medium">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        {/* Category */}
        <label className="block text-sm mb-1 font-medium">Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        >
          <option value="water">Riego</option>
          <option value="em">EM</option>
          <option value="fertilize">Fertilización</option>
          <option value="bokashi">Bokashi</option>
          <option value="compost">Compost</option>
          <option value="woodash">Ceniza</option>
          <option value="prune">Poda</option>
        </select>

        {/* Plant selector */}
        <label className="block text-sm mb-1 font-medium">Asignar a planta (opcional)</label>
        <select
          value={plantingId ?? ""}
          onChange={(e) => setPlantingId(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 w-full rounded mb-3"
        >
          <option value="">— General para el vivero —</option>
          {plants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.speciesName} — #{p.id}
            </option>
          ))}
        </select>

        {/* Payload */}
        <label className="block text-sm mb-1 font-medium">Detalles (JSON)</label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder='{"amount": "2L"}'
          className="border p-2 w-full rounded mb-4 text-sm h-20"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 text-sm">
            Cancelar
          </button>

          <button
            onClick={handleAdd}
            className="px-3 py-1 rounded bg-green-500 text-white text-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
