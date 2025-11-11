import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { useState } from "react";
import AddPlantModal from "../components/AddPlantModal";
import SpeciesDetail from "../components/SpeciesDetail";
import { Sprout, Plus, Container, Ruler, Info, Droplet, Calendar } from "lucide-react";
import speciesData from "../data/species.json";
import { useSpeciesById } from "../hooks/useSpecies";

export default function PlantsWithSpecies() {
  const plants = useLiveQuery(() => db.plantings.toArray(), []) ?? [];
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);

  // Get species detail by ID
  const getSpeciesById = (speciesId: number | null) => {
    if (!speciesId) return null;
    return speciesData.find(s => s.id === speciesId);
  };

  // If viewing species detail
  const selectedSpecies = getSpeciesById(selectedSpeciesId);
  if (selectedSpecies) {
    return (
      <SpeciesDetail 
        species={selectedSpecies} 
        onBack={() => setSelectedSpeciesId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Plantas</h1>
            <p className="text-gray-600 text-sm mt-1">
              {plants.length} {plants.length === 1 ? 'planta registrada' : 'plantas registradas'}
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-medium"
            onClick={() => setOpenAddModal(true)}
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
              onClick={() => setOpenAddModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              Agregar tu primera planta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plants.map((plant) => {
              const speciesInfo = getSpeciesById(plant.speciesId);
              
              return (
                <div
                  key={plant.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                      <Sprout className="w-6 h-6 text-green-700" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{plant.speciesName}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">Planta #{plant.id}</p>
                        </div>
                        
                        {/* View Species Info Button */}
                        {speciesInfo && (
                          <button
                            onClick={() => setSelectedSpeciesId(plant.speciesId)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-all group"
                            title="Ver información de especie"
                          >
                            <Info className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                          </button>
                        )}
                      </div>

                      {/* Species Scientific Name */}
                      {speciesInfo && (
                        <p className="text-sm text-gray-500 italic mb-3">{speciesInfo.scientificName}</p>
                      )}
                      
                      {/* Plant Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 bg-blue-50 rounded">
                            <Sprout className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-gray-600 block text-xs">Cantidad</span>
                            <span className="font-medium text-gray-900">{plant.quantity}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 bg-purple-50 rounded">
                            <Container className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <span className="text-gray-600 block text-xs">Maceta</span>
                            <span className="font-medium text-gray-900">{plant.potSizeGal} gal</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 bg-orange-50 rounded">
                            <Ruler className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <span className="text-gray-600 block text-xs">Profundidad</span>
                            <span className="font-medium text-gray-900">{plant.potDepthCm} cm</span>
                          </div>
                        </div>

                        {/* Show watering schedule if species info available */}
                        {speciesInfo && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 bg-cyan-50 rounded">
                              <Droplet className="w-4 h-4 text-cyan-600" />
                            </div>
                            <div>
                              <span className="text-gray-600 block text-xs">Riego Seco</span>
                              <span className="font-medium text-gray-900">
                                Cada {speciesInfo.wateringDrySeasonDays}d
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Species-specific badges */}
                      {speciesInfo && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {speciesInfo.category.replace(/_/g, " ")}
                          </span>
                          {speciesInfo.nativeToRegion && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              🇨🇷 Nativa
                            </span>
                          )}
                          {speciesInfo.nitrogenFixer && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              ⚡ Fijadora N
                            </span>
                          )}
                        </div>
                      )}

                      {/* Transplant date if available */}
                      {plant.expectedTransplantDate && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-amber-50 rounded-lg p-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>Trasplante esperado: {plant.expectedTransplantDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AddPlantModal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} />
      </div>
    </div>
  );
}