// ============================================
// 3. NurserySettings.tsx - Edit Nursery Config
// ============================================
import { useState, useEffect } from "react";
import { nurseryService } from "../services/nurseryService";
import { type Nursery } from "../db/db";
import { Save, Trash2, MapPin, Calendar, Home, AlertTriangle } from "lucide-react";

export default function NurserySettings() {
  const [nursery, setNursery] = useState<Nursery | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    startMonth: 1,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stats, setStats] = useState({
    totalPlants: 0,
    totalSpecies: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    loadNursery();
  }, []);

  const loadNursery = async () => {
    const activeNursery = await nurseryService.getActiveNursery();
    if (activeNursery) {
      setNursery(activeNursery);
      setFormData({
        name: activeNursery.name,
        region: activeNursery.region,
        startMonth: activeNursery.startMonth,
      });

      const nurseryStats = await nurseryService.getNurseryStats(activeNursery.id!);
      setStats(nurseryStats);
    }
  };

  const handleSave = async () => {
    if (!nursery?.id) return;

    try {
      await nurseryService.updateNursery(nursery.id, formData);
      setIsEditing(false);
      loadNursery();
    } catch (error) {
      alert("Error al guardar cambios");
    }
  };

  const handleDelete = async () => {
    if (!nursery?.id) return;

    try {
      await nurseryService.deleteNursery(nursery.id);
      window.location.href = "/setup"; // Redirect to setup
    } catch (error) {
      alert("Error al eliminar vivero");
    }
  };

  if (!nursery) {
    return <div className="p-8">Cargando...</div>;
  }

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuración del Vivero</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Plantas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPlants}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Especies</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSpecies}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingTasks}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
          </div>
        </div>

        {/* Nursery Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Información del Vivero</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4" />
                Nombre
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium">{nursery.name}</p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Región
              </label>
              {isEditing ? (
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="guanacaste">Guanacaste</option>
                  <option value="central-valley">Valle Central</option>
                </select>
              ) : (
                <p className="text-gray-900 font-medium capitalize">{nursery.region}</p>
              )}
            </div>

            {/* Start Month */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Mes de Inicio
              </label>
              {isEditing ? (
                <select
                  value={formData.startMonth}
                  onChange={(e) => setFormData({ ...formData, startMonth: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 font-medium">{monthNames[nursery.startMonth - 1]}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Zona de Peligro
          </h2>
          <p className="text-red-700 mb-4">
            Eliminar el vivero borrará permanentemente todas las plantas, tareas y registros.
            Esta acción no se puede deshacer.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Eliminar Vivero
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-900 font-semibold">¿Estás seguro? Esta acción es permanente.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                >
                  Sí, eliminar todo
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}