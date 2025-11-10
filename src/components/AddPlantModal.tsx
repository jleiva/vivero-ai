import { useState } from "react";
import { db } from "../db/db";
import { X, Sprout, Hash, Container } from "lucide-react";

export default function AddPlantModal({ isOpen, onClose }) {
  const [speciesName, setSpeciesName] = useState("");
  const [potSizeGal, setPotSizeGal] = useState(1);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleSave = async () => {
    await db.plantings.add({
      nurseryId: 1,
      speciesName,
      speciesId: null,
      quantity,
      potSizeGal,
      potDepthCm: 25,
      expectedTransplantDate: "2026-05-15"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Agregar Planta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Species Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Sprout className="w-4 h-4" />
              Especie
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={speciesName}
              onChange={(e) => setSpeciesName(e.target.value)}
              placeholder="Ej: Mango, Caoba..."
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4" />
              Cantidad
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
          </div>

          {/* Pot Size */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Container className="w-4 h-4" />
              Tamaño de Maceta (galones)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={potSizeGal}
              onChange={(e) => setPotSizeGal(Number(e.target.value))}
              min="0.5"
              step="0.5"
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
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}