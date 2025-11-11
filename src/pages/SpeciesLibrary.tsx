// ============================================
// 1. SpeciesLibrary.tsx - Species List Page
// ============================================
import React, { useState } from "react";
import { Search, Sprout, TrendingUp, Droplet, Container, ArrowRight } from "lucide-react";
import SpeciesDetail from "../components/SpeciesDetail";
import { useSpecies } from "../hooks/useSpecies";


interface Species {
  id: number;
  commonName: string;
  scientificName: string;
  category: string;
  description: string;
  potSizeMinGal: number;
  potSizeMaxGal: number;
  wateringDrySeasonDays: number;
  growthRate: string;
  nativeToRegion: boolean;
  nitrogenFixer: boolean;
}

// ============================================
// 2. SpeciesCard Component (for grid view)
// ============================================
function SpeciesCard({ species, onClick }: { species: Species; onClick: () => void }) {
  const getCategoryColor = (category: string) => {
    const colors = {
      fruit: "bg-orange-100 text-orange-700 border-orange-300",
      timber: "bg-amber-100 text-amber-700 border-amber-300",
      timber_nitrogen_fixer: "bg-green-100 text-green-700 border-green-300",
      dye: "bg-purple-100 text-purple-700 border-purple-300"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getGrowthRateLabel = (rate: string) => {
    const labels = {
      very_fast: "Muy Rápido",
      fast: "Rápido",
      moderate: "Moderado",
      slow_to_moderate: "Lento-Moderado"
    };
    return labels[rate] || rate;
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all text-left group"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-green-50 rounded-lg border border-green-200 group-hover:bg-green-100 transition-all">
          <Sprout className="w-6 h-6 text-green-700" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-all">
            {species.commonName}
          </h3>
          <p className="text-sm text-gray-500 italic truncate">{species.scientificName}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(species.category)}`}>
          {species.category.replace(/_/g, " ")}
        </span>
        {species.nativeToRegion && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            🇨🇷 Nativa
          </span>
        )}
        {species.nitrogenFixer && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            ⚡ N-Fixer
          </span>
        )}
      </div>

      {/* Quick Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Container className="w-4 h-4" />
            Maceta
          </span>
          <span className="font-medium text-gray-900">
            {species.potSizeMinGal}-{species.potSizeMaxGal} gal
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Droplet className="w-4 h-4" />
            Riego Seco
          </span>
          <span className="font-medium text-gray-900">
            Cada {species.wateringDrySeasonDays}d
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Crecimiento
          </span>
          <span className="font-medium text-gray-900">
            {getGrowthRateLabel(species.growthRate)}
          </span>
        </div>
      </div>

      {/* View Details Button */}
      <div className="flex items-center justify-end text-green-600 font-medium text-sm group-hover:text-green-700">
        Ver detalles
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}

export default function SpeciesLibrary() {
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const speciesData = useSpecies();

  // If a species is selected, show detail view
  if (selectedSpecies) {
    return (
      <SpeciesDetail 
        species={selectedSpecies} 
        onBack={() => setSelectedSpecies(null)}
      />
    );
  }

  // Filter species
  const filteredSpecies = speciesData.filter(species => {
    const matchesSearch = species.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         species.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || species.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["all", ...new Set(speciesData.map(s => s.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Especies</h1>
          <p className="text-gray-600">Explora las especies disponibles para tu vivero</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Todas las categorías" : cat.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          Mostrando {filteredSpecies.length} de {speciesData.length} especies
        </p>

        {/* Species Grid */}
        {filteredSpecies.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron especies con ese criterio</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecies.map((species) => (
              <SpeciesCard
                key={species.id}
                species={species}
                onClick={() => setSelectedSpecies(species)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}