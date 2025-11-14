import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { nurseryService } from "../services/nurseryService";
import { inputLogService } from "../services/inputLogService";
import AddInputLogModal from "../components/AddInputLogModal";
import { 
  Plus, 
  Droplet, 
  Beaker, 
  Leaf, 
  Flame, 
  Trash2,
  Calendar,
  TrendingUp,
  Filter
} from "lucide-react";
import dayjs from "dayjs";

export default function InputLogs() {
  const [activeNurseryId, setActiveNurseryId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [stats, setStats] = useState<any>(null);

  // Load active nursery
  useEffect(() => {
    const loadActiveNursery = async () => {
      const nursery = await nurseryService.getActiveNursery();
      setActiveNurseryId(nursery?.id || null);
    };
    loadActiveNursery();
  }, []);

  // Get logs for active nursery
  const logs = useLiveQuery(
    async () => {
      if (!activeNurseryId) return [];
      return await inputLogService.getLogsByNursery(activeNurseryId);
    },
    [activeNurseryId]
  ) ?? [];

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      if (activeNurseryId) {
        const statsData = await inputLogService.getStats(activeNurseryId);
        setStats(statsData);
      }
    };
    loadStats();
  }, [activeNurseryId, logs.length]);

  const handleDelete = async (logId: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    
    try {
      await inputLogService.deleteLog(logId);
    } catch (error) {
      alert("Error al eliminar el registro");
    }
  };

  // Filter logs
  const filteredLogs = filterType === "all" 
    ? logs 
    : logs.filter(log => log.inputType === filterType);

  // Icon mapping
  const getIcon = (type: string) => {
    const icons = {
      water: <Droplet className="w-5 h-5 text-blue-600" />,
      em: <Beaker className="w-5 h-5 text-purple-600" />,
      compost_tea: <Leaf className="w-5 h-5 text-green-600" />,
      bokashi: <Leaf className="w-5 h-5 text-amber-600" />,
      wood_ash: <Flame className="w-5 h-5 text-red-600" />,
      fertilizer: <Leaf className="w-5 h-5 text-emerald-600" />,
    };
    return icons[type] || <Beaker className="w-5 h-5 text-gray-600" />;
  };

  const getLabel = (type: string) => {
    const labels = {
      water: "Agua",
      em: "EM",
      compost_tea: "Té de Compost",
      bokashi: "Bokashi",
      wood_ash: "Ceniza",
      fertilizer: "Fertilizante",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registro de Aplicaciones</h1>
            <p className="text-gray-600 mt-1">Historial de agua, fertilizantes y bio-insumos</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Registrar
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600 font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
            </div>

            {Object.entries(stats.byType).slice(0, 3).map(([type, data]: [string, any]) => (
              <div key={type} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(type)}
                  <span className="text-sm text-gray-600 font-medium">{getLabel(type)}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{data.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filtrar por tipo:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({logs.length})
            </button>
            {["water", "em", "compost_tea", "bokashi", "wood_ash", "fertilizer"].map((type) => {
              const count = logs.filter(l => l.inputType === type).length;
              if (count === 0) return null;
              
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterType === type
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getLabel(type)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Beaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              {filterType === "all" 
                ? "No hay registros de aplicaciones" 
                : `No hay registros de ${getLabel(filterType)}`}
            </p>
            <button
              onClick={() => setOpenModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              Crear Primer Registro
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {getIcon(log.inputType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {getLabel(log.inputType)}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {log.quantity} {log.units}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {dayjs(log.date).format("DD/MM/YYYY")}
                        </span>
                        {log.plantingId && (
                          <span className="text-blue-600">
                            Planta #{log.plantingId}
                          </span>
                        )}
                      </div>

                      {log.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(log.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddInputLogModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}