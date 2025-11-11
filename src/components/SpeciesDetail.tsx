// ============================================
// 1. SpeciesDetail.tsx - Main Component
// ============================================
import React, { useState } from "react";
import {
  Sprout,
  Droplet,
  Sun,
  Container,
  Ruler,
  Calendar,
  Leaf,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Wind,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from "lucide-react";
import { useWateringInterval } from "../hooks/useSeason";

interface Species {
  id: number;
  commonName: string;
  scientificName: string;
  category: string;
  description: string;
  potSizeMinGal: number;
  potSizeMaxGal: number;
  potDepthCm: number;
  rootBehavior: string;
  wateringDrySeasonDays: number;
  wateringRainySeasonDays: number;
  shadeRequirements: string;
  shadeTolerancePercent: number;
  fertilization: {
    type: string;
    notes: string;
    frequencyDays: number;
    npkRatio: string;
    organicInputs: string[];
  };
  hardeningRules: {
    totalWeeks: number;
    shadeReductionSchedule: Array<{
      week: number;
      shadePercent: number;
      windExposureHours: number;
    }>;
    notes: string;
  };
  transplantReadiness: {
    minHeightCm: number;
    minMonthsInPot: number;
    rootCheckCriteria: string;
    leafMaturity: string;
  };
  commonIssues: string[];
  growthRate: string;
  nativeToRegion: boolean;
  nitrogenFixer: boolean;
}

interface Props {
  species: Species;
  onBack?: () => void;
}

// ============================================
// 2. AccordionSection Component
// ============================================
function AccordionSection({ 
  title, 
  icon, 
  isExpanded, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: React.ReactNode; 
  isExpanded: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="text-green-600">{icon}</div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// 3. InfoCard Component
// ============================================
function InfoCard({ 
  label, 
  value, 
  icon, 
  className = "" 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-gray-600">{icon}</div>
        <span className="text-xs text-gray-600 font-medium">{label}</span>
      </div>
      <p className={`font-semibold text-gray-900 ${className}`}>{value}</p>
    </div>
  );
}

// ============================================
// 4. ChecklistItem Component
// ============================================
function ChecklistItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 capitalize">{value}</p>
      </div>
    </div>
  );
}

export default function SpeciesDetail({ species, onBack }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const currentInterval = useWateringInterval(
    species.wateringDrySeasonDays,
    species.wateringRainySeasonDays
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Category badge color
  const getCategoryColor = (category: string) => {
    const colors = {
      fruit: "bg-orange-100 text-orange-700 border-orange-300",
      timber: "bg-amber-100 text-amber-700 border-amber-300",
      timber_nitrogen_fixer: "bg-green-100 text-green-700 border-green-300",
      dye: "bg-purple-100 text-purple-700 border-purple-300"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  // Growth rate badge
  const getGrowthRateBadge = (rate: string) => {
    const badges = {
      very_fast: { color: "bg-green-100 text-green-700", label: "Muy Rápido" },
      fast: { color: "bg-blue-100 text-blue-700", label: "Rápido" },
      moderate: { color: "bg-yellow-100 text-yellow-700", label: "Moderado" },
      slow_to_moderate: { color: "bg-orange-100 text-orange-700", label: "Lento-Moderado" }
    };
    return badges[rate] || { color: "bg-gray-100 text-gray-700", label: rate };
  };

  // Format organic inputs
  const formatOrganicInput = (input: string) => {
    const labels = {
      compost_tea: "Té de Compost",
      em: "EM (Microorganismos)",
      bokashi: "Bokashi",
      wood_ash: "Ceniza de Madera"
    };
    return labels[input] || input;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <Sprout className="w-10 h-10 text-green-700" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{species.commonName}</h1>
                  <p className="text-gray-500 italic text-lg mt-1">{species.scientificName}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(species.category)}`}>
                  {species.category.replace(/_/g, " ").toUpperCase()}
                </span>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGrowthRateBadge(species.growthRate).color}`}>
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {getGrowthRateBadge(species.growthRate).label}
                </span>

                {species.nativeToRegion && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    🇨🇷 Nativa
                  </span>
                )}

                {species.nitrogenFixer && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    ⚡ Fijadora de Nitrógeno
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mt-4 leading-relaxed">{species.description}</p>
              <div>
                <p className="text-gray-700 mt-4 leading-relaxed">Riego actual: Cada {currentInterval} días</p>
                <p className="text-sm text-gray-600">
                  (Temporada seca: cada {species.wateringDrySeasonDays}d, 
                  Lluviosa: cada {species.wateringRainySeasonDays}d)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Container className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-500 font-medium">Maceta</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {species.potSizeMinGal}-{species.potSizeMaxGal} gal
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-gray-500 font-medium">Profundidad</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{species.potDepthCm} cm</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-5 h-5 text-cyan-600" />
              <span className="text-xs text-gray-500 font-medium">Riego Seco</span>
            </div>
            <p className="text-lg font-bold text-gray-900">Cada {species.wateringDrySeasonDays}d</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-500 font-medium">Meses en Pot</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{species.transplantReadiness.minMonthsInPot}+ meses</p>
          </div>
        </div>

        {/* Accordion Sections */}
        
        {/* Watering Section */}
        <AccordionSection
          title="Riego y Agua"
          icon={<Droplet className="w-5 h-5" />}
          isExpanded={expandedSection === "watering"}
          onToggle={() => toggleSection("watering")}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Temporada Seca</h4>
                <p className="text-2xl font-bold text-blue-700">Cada {species.wateringDrySeasonDays} días</p>
                <p className="text-sm text-blue-600 mt-1">Diciembre - Abril</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Temporada Lluviosa</h4>
                <p className="text-2xl font-bold text-green-700">Cada {species.wateringRainySeasonDays} días</p>
                <p className="text-sm text-green-600 mt-1">Mayo - Noviembre</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Nota:</strong> Ajusta según las condiciones locales. Verifica humedad del sustrato antes de regar.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Pot & Roots Section */}
        <AccordionSection
          title="Maceta y Raíces"
          icon={<Container className="w-5 h-5" />}
          isExpanded={expandedSection === "pot"}
          onToggle={() => toggleSection("pot")}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <InfoCard
                label="Tamaño Mínimo"
                value={`${species.potSizeMinGal} galones`}
                icon={<Container className="w-4 h-4" />}
              />
              <InfoCard
                label="Tamaño Máximo"
                value={`${species.potSizeMaxGal} galones`}
                icon={<Container className="w-4 h-4" />}
              />
              <InfoCard
                label="Profundidad"
                value={`${species.potDepthCm} cm`}
                icon={<Ruler className="w-4 h-4" />}
              />
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Comportamiento de Raíz
              </h4>
              <p className="text-amber-800 capitalize">
                {species.rootBehavior.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Light & Shade Section */}
        <AccordionSection
          title="Luz y Sombra"
          icon={<Sun className="w-5 h-5" />}
          isExpanded={expandedSection === "light"}
          onToggle={() => toggleSection("light")}
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">Requerimientos</h4>
              <p className="text-yellow-800 capitalize text-lg">
                {species.shadeRequirements.replace(/_/g, " ")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tolerancia a Sombra</span>
                <span className="text-lg font-bold text-gray-900">{species.shadeTolerancePercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${species.shadeTolerancePercent}%` }}
                />
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Fertilization Section */}
        <AccordionSection
          title="Fertilización"
          icon={<Leaf className="w-5 h-5" />}
          isExpanded={expandedSection === "fertilization"}
          onToggle={() => toggleSection("fertilization")}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard
                label="Tipo"
                value={species.fertilization.type.replace(/_/g, " ")}
                icon={<Leaf className="w-4 h-4" />}
                className="capitalize"
              />
              <InfoCard
                label="Frecuencia"
                value={`Cada ${species.fertilization.frequencyDays} días`}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Insumos Orgánicos Recomendados</h4>
              <div className="flex flex-wrap gap-2">
                {species.fertilization.organicInputs.map((input, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white rounded-full text-sm text-green-700 border border-green-300"
                  >
                    {formatOrganicInput(input)}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Ratio NPK</h4>
              <p className="text-blue-800 capitalize">{species.fertilization.npkRatio.replace(/_/g, " ")}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Notas:</strong> {species.fertilization.notes}
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Hardening Section */}
        <AccordionSection
          title="Endurecimiento"
          icon={<Wind className="w-5 h-5" />}
          isExpanded={expandedSection === "hardening"}
          onToggle={() => toggleSection("hardening")}
        >
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">
                Calendario de {species.hardeningRules.totalWeeks} Semanas
              </h4>
              
              <div className="space-y-3">
                {species.hardeningRules.shadeReductionSchedule.map((week) => (
                  <div key={week.week} className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-900">Semana {week.week}</span>
                      <span className="text-sm text-purple-600">{week.shadePercent}% sombra</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Sombra:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${week.shadePercent}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Viento:</span>
                        <p className="font-medium text-gray-900 mt-1">{week.windExposureHours}h/día</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Consejo:</strong> {species.hardeningRules.notes}
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Transplant Readiness Section */}
        <AccordionSection
          title="Preparación para Trasplante"
          icon={<CheckCircle2 className="w-5 h-5" />}
          isExpanded={expandedSection === "transplant"}
          onToggle={() => toggleSection("transplant")}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Altura Mínima</h4>
                <p className="text-2xl font-bold text-green-700">{species.transplantReadiness.minHeightCm} cm</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Tiempo Mínimo</h4>
                <p className="text-2xl font-bold text-blue-700">{species.transplantReadiness.minMonthsInPot} meses</p>
              </div>
            </div>

            <div className="space-y-3">
              <ChecklistItem
                label="Estado de Raíces"
                value={species.transplantReadiness.rootCheckCriteria.replace(/_/g, " ")}
              />
              <ChecklistItem
                label="Madurez de Hojas"
                value={species.transplantReadiness.leafMaturity.replace(/_/g, " ")}
              />
            </div>
          </div>
        </AccordionSection>

        {/* Common Issues Section */}
        <AccordionSection
          title="Problemas Comunes"
          icon={<AlertTriangle className="w-5 h-5" />}
          isExpanded={expandedSection === "issues"}
          onToggle={() => toggleSection("issues")}
        >
          <div className="space-y-2">
            {species.commonIssues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 bg-red-50 rounded-lg p-3 border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{issue}</p>
              </div>
            ))}
          </div>
        </AccordionSection>
      </div>
    </div>
  );
}

