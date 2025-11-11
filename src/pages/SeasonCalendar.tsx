import { SeasonCalendar } from "../components/SeasonCalendar";

export default function SeasonInfo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1>Información de Temporadas</h1>
      <SeasonCalendar region="guanacaste" />
    </div>
  );
}