import { useState } from "react";
import { db } from "../db/db";
import { X, Sprout, Hash, Container, Search } from "lucide-react";
import speciesData from "../data/species.json";

export default function AddPlantModalWithSpecies({ isOpen, onClose }) {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [potSizeGal, setPotSizeGal] = useState(1);
  const [potDepthCm, setPotDepthCm] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const selectedSpecies = speciesData.find(s => s.id === selectedSpeciesId);

  // Auto-fill pot size when species selected
  const handleSpeciesSelect = (speciesId: number) => {
    setSelectedSpeciesId(speciesId);
    const species = speciesData.find(s => s.id === speciesId);
    if (species) {
      setPotSizeGal(species.potSizeMinGal);
      setPotDepthCm(species.potDepthCm);
    }
  };

  const handleSave = async () => {
    if (!selectedSpecies) {
      alert("Por favor selecciona una especie");
      return;
    }

    await db.plantings.add({
      nurseryId: 1,
      speciesId: selectedSpecies.id,
      speciesName: selectedSpecies.commonName,
      quantity,
      potSizeGal,
      potDepthCm,
      expectedTransplantDate: null
    });

    // Reset form
    setSelectedSpeciesId(null);
    setQuantity(1);
    setSearchTerm("");
    onClose();
  };

  const filteredSpecies = speciesData.filter(s =>
    s.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Body - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Species Search */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Sprout className="w-4 h-4" />
              Seleccionar Especie
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar especie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Species Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
            {filteredSpecies.map((species) => (
              <button
                key={species.id}
                onClick={() => handleSpeciesSelect(species.id)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  selectedSpeciesId === species.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{species.commonName}</div>
                <div className="text-xs text-gray-500 italic">{species.scientificName}</div>
                <div className="flex gap-1 mt-2">
                  {species.nativeToRegion && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">🇨🇷</span>
                  )}
                  {species.nitrogenFixer && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">⚡</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Species Info */}
          {selectedSpecies && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Especie Seleccionada</h3>
              <p className="text-sm text-green-800">
                <strong>{selectedSpecies.commonName}</strong> - {selectedSpecies.scientificName}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Maceta recomendada: {selectedSpecies.potSizeMinGal}-{selectedSpecies.potSizeMaxGal} gal, 
                Profundidad: {selectedSpecies.potDepthCm} cm
              </p>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4" />
              Cantidad
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
          </div>

          {/* Pot Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Container className="w-4 h-4" />
                Tamaño Maceta (gal)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={potSizeGal}
                onChange={(e) => setPotSizeGal(Number(e.target.value))}
                min="0.5"
                step="0.5"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Profundidad (cm)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={potDepthCm}
                onChange={(e) => setPotDepthCm(Number(e.target.value))}
                min="10"
              />
            </div>
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
            disabled={!selectedSpeciesId}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}