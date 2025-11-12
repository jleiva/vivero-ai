import { useState, useEffect } from "react";
import { nurseryService } from "../services/nurseryService";
import { type Nursery } from "../db/db";
import { Plus, Trash2, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NurserySettings() {
  const navigate = useNavigate();
  const [nurseries, setNurseries] = useState<Nursery[]>([]);
  const [activeNursery, setActiveNursery] = useState<Nursery | null>(null);
  const [statsMap, setStatsMap] = useState<Record<number, any>>({});

  useEffect(() => {
    loadNurseries();
  }, []);

  const loadNurseries = async () => {
    const all = await nurseryService.getAllNurseries();
    const active = await nurseryService.getActiveNursery();
    
    setNurseries(all);
    setActiveNursery(active);

    // Load stats for each nursery
    const stats: Record<number, any> = {};
    for (const nursery of all) {
      if (nursery.id) {
        stats[nursery.id] = await nurseryService.getNurseryStats(nursery.id);
      }
    }
    setStatsMap(stats);
  };

  const handleDelete = async (nurseryId: number) => {
    if (!confirm("¿Estás seguro? Esto eliminará todas las plantas y tareas de este vivero.")) {
      return;
    }

    try {
      await nurseryService.deleteNursery(nurseryId);
      
      // Check if any nurseries remain
      const hasNursery = await nurseryService.hasNursery();
      if (!hasNursery) {
        // No nurseries left, redirect to setup
        navigate("/setup");
      } else {
        // Reload the list
        loadNurseries();
      }
    } catch (error) {
      alert("Error al eliminar vivero");
    }
  };

  const handleSetActive = async (nurseryId: number) => {
    try {
      await nurseryService.switchNursery(nurseryId);
      window.location.reload();
    } catch (error) {
      alert("Error al cambiar vivero activo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Viveros</h1>
          <button
            onClick={() => navigate("/setup")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Crear Nuevo Vivero
          </button>
        </div>

        {/* Nurseries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nurseries.map((nursery) => {
            const isActive = nursery.id === activeNursery?.id;
            const stats = statsMap[nursery.id!] || {
              totalPlants: 0,
              totalSpecies: 0,
              pendingTasks: 0,
              completedTasks: 0
            };

            return (
              <div
                key={nursery.id}
                className={`bg-white rounded-xl p-6 border-2 transition-all ${
                  isActive
                    ? "border-green-600 ring-2 ring-green-600 ring-opacity-20"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{nursery.name}</h3>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      {nursery.region}
                    </p>
                  </div>
                  
                  {isActive && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      ACTIVO
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Plantas</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalPlants}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Especies</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalSpecies}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Pendientes</p>
                    <p className="text-xl font-bold text-amber-600">{stats.pendingTasks}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Completadas</p>
                    <p className="text-xl font-bold text-green-600">{stats.completedTasks}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!isActive && (
                    <button
                      onClick={() => handleSetActive(nursery.id!)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm"
                    >
                      Activar
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(nursery.id!)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                    title="Eliminar vivero"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {nurseries.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-600 mb-4">No hay viveros registrados</p>
            <button
              onClick={() => navigate("/setup")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              Crear Primer Vivero
            </button>
          </div>
        )}
      </div>
    </div>
  );
}