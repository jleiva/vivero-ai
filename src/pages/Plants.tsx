import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { useState } from "react";
import AddPlantModal from "../components/AddPlantModal";

export default function Plants() {
  const plants = useLiveQuery(() => db.plantings.toArray(), []) ?? [];
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Plantas</h1>
        <button className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => setOpen(true)}>
          + Agregar Planta
        </button>
      </div>

      {plants.map((p) => (
        <div key={p.id} className="border rounded p-3 mb-2 shadow-sm bg-white">
          <p className="font-medium">{p.speciesName}</p>
          <p className="text-xs text-gray-500">#{p.id}</p>
          <p className="text-xs">Maceta: {p.potSizeGal} gal - {p.potDepthCm}cm</p>
        </div>
      ))}

      <AddPlantModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
