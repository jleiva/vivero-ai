import { useState, useEffect } from "react";
import { db } from "../db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { X, Calendar, Tag, Sprout, Home, Droplet, Beaker, AlertCircle } from "lucide-react";
import { nurseryService } from "../services/nurseryService";
import { getTodayLocal } from "../utils/dateHelpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [date, setDate] = useState<string>(getTodayLocal());
  const [category, setCategory] = useState<string>("water");
  const [plantingId, setPlantingId] = useState<number | null>(null);
  const [selectedNurseryId, setSelectedNurseryId] = useState<number | null>(null);
  const [plants, setPlants] = useState<any[]>([]);

  // Dynamic payload fields based on category
  const [dosage, setDosage] = useState<string>("");
  const [dosageUnit, setDosageUnit] = useState<string>("L");
  const [dilution, setDilution] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Get all nurseries
  const nurseries = useLiveQuery(() => db.nurseries.toArray(), []) ?? [];

  // Load active nursery on mount
  useEffect(() => {
    const loadActiveNursery = async () => {
      const activeNursery = await nurseryService.getActiveNursery();
      if (activeNursery?.id) {
        setSelectedNurseryId(activeNursery.id);
      }
    };
    loadActiveNursery();
  }, []);

  // Load plants when nursery changes
  useEffect(() => {
    const loadPlants = async () => {
      if (selectedNurseryId) {
        const nurseryPlants = await db.plantings
          .where("nurseryId")
          .equals(selectedNurseryId)
          .toArray();
        setPlants(nurseryPlants);
      } else {
        setPlants([]);
      }
    };
    loadPlants();
  }, [selectedNurseryId]);

  // Reset fields when category changes
  useEffect(() => {
    setDosage("");
    setDilution("");
    setType("");
    setNote("");
    
    // Set default units based on category
    if (["water", "em", "compost"].includes(category)) {
      setDosageUnit("L");
    } else if (["bokashi", "woodash"].includes(category)) {
      setDosageUnit("kg");
    } else {
      setDosageUnit("L");
    }
  }, [category]);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!selectedNurseryId) {
      alert("Por favor selecciona un vivero");
      return;
    }

    // Build payload based on what fields are filled
    const payload: any = {};
    
    if (dosage) {
      payload.dosage = `${dosage}${dosageUnit}`;
    }
    if (dilution) {
      payload.dilution = dilution;
    }
    if (type) {
      payload.type = type;
    }
    if (note) {
      payload.note = note;
    }

    await db.tasks.add({
      nurseryId: selectedNurseryId,
      plantingId: plantingId || null,
      date,
      category,
      payload,
      status: "pending",
      createdAt: new Date(),
      completedAt: null,
    });

    // Reset form
    setDate(getTodayLocal());
    setCategory("water");
    setPlantingId(null);
    setDosage("");
    setDilution("");
    setType("");
    setNote("");
    onClose();
  };

  // Determine which fields to show based on category
  const showDosage = ["water", "em", "fertilize", "compost", "bokashi", "woodash"].includes(category);
  const showDilution = ["em", "fertilize", "compost"].includes(category);
  const showType = ["fertilize"].includes(category);
  const showNote = true; // Always available

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Body - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Nursery Selection - Only show if multiple nurseries */}
          {nurseries.length > 1 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4" />
                Vivero
              </label>
              <select
                value={selectedNurseryId ?? ""}
                onChange={(e) => {
                  setSelectedNurseryId(e.target.value ? Number(e.target.value) : null);
                  setPlantingId(null);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Seleccionar vivero...</option>
                {nurseries.map((nursery) => (
                  <option key={nursery.id} value={nursery.id}>
                    {nursery.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show nursery name if only one */}
          {nurseries.length === 1 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Vivero:</strong> {nurseries[0].name}
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Tipo de Tarea
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="water">💧 Riego</option>
              <option value="em">🧪 EM (Microorganismos)</option>
              <option value="fertilize">🌿 Fertilización</option>
              <option value="bokashi">✨ Bokashi</option>
              <option value="compost">🍂 Té de Compost</option>
              <option value="woodash">🔥 Ceniza de Madera</option>
              <option value="prune">✂️ Poda</option>
            </select>
          </div>

          {/* Plant selector - only if nursery selected */}
          {selectedNurseryId && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Sprout className="w-4 h-4" />
                Asignar a planta (opcional)
              </label>
              {plants.length > 0 ? (
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
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  No hay plantas en este vivero.
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Detalles de la Tarea
            </p>
          </div>

          {/* Dynamic Fields Based on Category */}
          
          {/* Type - Only for fertilize */}
          {showType && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Fertilizante
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Ej: Bokashi, NPK, Orgánico..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Dilution - For EM, Fertilize, Compost Tea */}
          {showDilution && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Beaker className="w-4 h-4" />
                Dilución
              </label>
              <input
                type="text"
                value={dilution}
                onChange={(e) => setDilution(e.target.value)}
                placeholder="Ej: 1:500, 1:1000..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: 1:500 significa 1 parte de producto por 500 partes de agua
              </p>
            </div>
          )}

          {/* Dosage - For water, EM, fertilize, compost, bokashi, woodash */}
          {showDosage && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                Cantidad
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <select
                  value={dosageUnit}
                  onChange={(e) => setDosageUnit(e.target.value)}
                  className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="gal">gal</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="tazas">tazas</option>
                </select>
              </div>
            </div>
          )}

          {/* Notes - Always available */}
          {showNote && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Notas (opcional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej: Riego temprano en la mañana, evitar mojar hojas..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-20 resize-none"
              />
            </div>
          )}
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
            disabled={!selectedNurseryId}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}