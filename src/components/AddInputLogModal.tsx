import { useState, useEffect } from "react";
import { X, Calendar, Beaker, Hash, MessageSquare, Droplet } from "lucide-react";
import { inputLogService } from "../services/inputLogService";
import { nurseryService } from "../services/nurseryService";
import { db } from "../db/db";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taskId?: number | null;
  defaultInputType?: string;
  defaultPlantingId?: number | null;
  defaultDate?: string;
}

const INPUT_TYPES = [
  { value: "water", label: "💧 Agua", units: ["L", "gal", "ml"] },
  { value: "em", label: "🧪 EM (Microorganismos)", units: ["L", "ml"] },
  { value: "compost_tea", label: "🍵 Té de Compost", units: ["L", "ml"] },
  { value: "bokashi", label: "✨ Bokashi", units: ["kg", "g", "tazas"] },
  { value: "wood_ash", label: "🔥 Ceniza de Madera", units: ["kg", "g", "tazas"] },
  { value: "fertilizer", label: "🌿 Fertilizante", units: ["kg", "g", "ml", "L"] },
];

export default function AddInputLogModal({ 
  isOpen, 
  onClose, 
  taskId = null,
  defaultInputType = "water",
  defaultPlantingId = null,
  defaultDate
}: Props) {
  const [date, setDate] = useState<string>(
    defaultDate || new Date().toISOString().slice(0, 10)
  );
  const [inputType, setInputType] = useState<string>(defaultInputType);
  const [quantity, setQuantity] = useState<string>("");
  const [units, setUnits] = useState<string>("L");
  const [plantingId, setPlantingId] = useState<number | null>(defaultPlantingId);
  const [notes, setNotes] = useState<string>("");
  const [activeNurseryId, setActiveNurseryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load active nursery
  useEffect(() => {
    const loadActiveNursery = async () => {
      const nursery = await nurseryService.getActiveNursery();
      setActiveNurseryId(nursery?.id || null);
    };
    loadActiveNursery();
  }, []);

  // Get plants for active nursery
  const plants = useLiveQuery(
    async () => {
      if (!activeNurseryId) return [];
      return await db.plantings
        .where("nurseryId")
        .equals(activeNurseryId)
        .toArray();
    },
    [activeNurseryId]
  ) ?? [];

  // Update units when input type changes
  useEffect(() => {
    const selectedType = INPUT_TYPES.find(t => t.value === inputType);
    if (selectedType && selectedType.units.length > 0) {
      setUnits(selectedType.units[0]);
    }
  }, [inputType]);

  // Reset form when modal opens with new defaults
  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate || new Date().toISOString().slice(0, 10));
      setInputType(defaultInputType);
      setPlantingId(defaultPlantingId);
    }
  }, [isOpen, defaultDate, defaultInputType, defaultPlantingId]);

  const handleSubmit = async () => {
    if (!activeNurseryId || !quantity) return;

    setIsSubmitting(true);
    try {
      await inputLogService.createLog({
        nurseryId: activeNurseryId,
        taskId,
        plantingId,
        date,
        inputType,
        quantity: parseFloat(quantity),
        units,
        notes,
      });

      // Reset form
      setQuantity("");
      setNotes("");
      
      onClose();
    } catch (error) {
      console.error("Error creating log:", error);
      alert("Error al guardar el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedInputType = INPUT_TYPES.find(t => t.value === inputType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {taskId ? "Registrar Aplicación de Tarea" : "Registrar Aplicación"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Show task indicator if from task */}
          {taskId && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800">
                📋 Registrando aplicación para tarea #{taskId}
              </p>
            </div>
          )}

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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Input Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Beaker className="w-4 h-4" />
              Tipo de Insumo
            </label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {INPUT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Units */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4" />
                Cantidad
              </label>
              <input
                type="number"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad
              </label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {selectedInputType?.units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plant Selection (Optional) */}
          {plants.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Droplet className="w-4 h-4" />
                Aplicado a (opcional)
              </label>
              <select
                value={plantingId ?? ""}
                onChange={(e) => setPlantingId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todo el vivero</option>
                {plants.map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.speciesName} - #{plant.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Aplicación foliar temprano en la mañana"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-20"
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
            onClick={handleSubmit}
            disabled={!activeNurseryId || !quantity || isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}