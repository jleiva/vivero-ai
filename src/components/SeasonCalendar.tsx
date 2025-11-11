// ============================================
// 4. SeasonCalendar.tsx - Yearly View Component
// ============================================
import { seasonService } from "../services/seasonService";

export function SeasonCalendar({ region = "guanacaste" }: { region?: string }) {
  const calendar = seasonService.getYearlySeasonCalendar(region);
  const currentMonth = new Date().getMonth() + 1;

  const seasonColors = {
    dry: "bg-orange-100 border-orange-300 text-orange-900",
    rainy: "bg-blue-100 border-blue-300 text-blue-900",
    transition: "bg-purple-100 border-purple-300 text-purple-900",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Calendario de Temporadas</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {calendar.map((month) => (
          <div
            key={month.month}
            className={`p-3 rounded-lg border-2 transition-all ${
              seasonColors[month.season]
            } ${
              month.month === currentMonth
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }`}
          >
            <div className="font-semibold text-sm">{month.monthName}</div>
            <div className="text-xs mt-1 opacity-75">{month.seasonName}</div>
            {month.month === currentMonth && (
              <div className="text-xs mt-1 font-semibold">← Actual</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
          <span className="text-gray-600">Temporada Seca</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
          <span className="text-gray-600">Temporada Lluviosa</span>
        </div>
      </div>
    </div>
  );
}