// ============================================
// 3. SeasonIndicator.tsx - UI Component
// ============================================
import React from "react";
import { useSeason } from "../hooks/useSeason";
import { Sun, CloudRain, Wind, Droplet, Calendar } from "lucide-react";

interface Props {
  region?: string;
  compact?: boolean;
}

export function SeasonIndicator({ region = "guanacaste", compact = false }: Props) {
  const seasonInfo = useSeason(region);

  const seasonIcons = {
    dry: <Sun className="w-5 h-5" />,
    rainy: <CloudRain className="w-5 h-5" />,
    transition: <Wind className="w-5 h-5" />,
  };

  const seasonColors = {
    dry: "bg-orange-50 text-orange-700 border-orange-300",
    rainy: "bg-blue-50 text-blue-700 border-blue-300",
    transition: "bg-purple-50 text-purple-700 border-purple-300",
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${seasonColors[seasonInfo.season]}`}>
        {seasonIcons[seasonInfo.season]}
        <span>{seasonInfo.seasonName}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${seasonColors[seasonInfo.season]}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white/50 rounded-lg">
          {seasonIcons[seasonInfo.season]}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{seasonInfo.seasonName}</h3>
          <p className="text-sm opacity-80">{seasonInfo.monthName}</p>
        </div>
      </div>

      <p className="text-sm mb-3">{seasonInfo.description}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Droplet className="w-4 h-4" />
          <span>Multiplicador de riego: {seasonInfo.wateringMultiplier}x</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span>
            Próxima temporada ({seasonInfo.nextSeasonChange.season === "dry" ? "Seca" : "Lluviosa"}) 
            en {seasonInfo.nextSeasonChange.daysUntil} días
          </span>
        </div>
      </div>

      {seasonInfo.recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current/20">
          <h4 className="font-semibold text-sm mb-2">Recomendaciones:</h4>
          <ul className="space-y-1">
            {seasonInfo.recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-xs mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}