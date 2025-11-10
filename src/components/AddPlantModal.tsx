import { useState } from "react";
import { db } from "../db/db";

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-80 shadow-lg">
        <h2 className="font-bold mb-3">Agregar Planta</h2>

        <label className="block text-sm font-medium">Especie</label>
        <input
          className="border p-2 w-full rounded mb-2"
          value={speciesName}
          onChange={(e) => setSpeciesName(e.target.value)}
        />

        <label className="block text-sm font-medium">Cantidad</label>
        <input
          type="number"
          className="border p-2 w-full rounded mb-2"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <label className="block text-sm font-medium">Maceta (gal)</label>
        <input
          type="number"
          className="border p-2 w-full rounded mb-4"
          value={potSizeGal}
          onChange={(e) => setPotSizeGal(Number(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Cancelar</button>
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
