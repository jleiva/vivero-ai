import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { useState } from "react";
import AddPlantModal from "../components/AddPlantModal";
import { Sprout, Plus, Container, Ruler } from "lucide-react";

export default function Plants() {
  const plants = useLiveQuery(() => db.plantings.toArray(), []) ?? [];
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis Plantas</h1>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-medium"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Agregar Planta
          </button>
        </div>

        {plants.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No hay plantas registradas</p>
            <button
              onClick={() => setOpen(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              Agregar tu primera planta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plants.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                    <Sprout className="w-6 h-6 text-green-700" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{p.speciesName}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Planta #{p.id}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-blue-50 rounded">
                          <Sprout className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-600">Cantidad:</span>
                        <span className="font-medium text-gray-900">{p.quantity}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-purple-50 rounded">
                          <Container className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-gray-600">Maceta:</span>
                        <span className="font-medium text-gray-900">{p.potSizeGal} gal</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-orange-50 rounded">
                          <Ruler className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-gray-600">Profundidad:</span>
                        <span className="font-medium text-gray-900">{p.potDepthCm} cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddPlantModal isOpen={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}