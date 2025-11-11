// ============================================
// 2. NurserySetupWizard.tsx - Onboarding Flow
// ============================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Home
} from "lucide-react";
import { nurseryService } from "../services/nurseryService";
import { seasonService } from "../services/seasonService";

interface NurserySetupData {
  name: string;
  region: string;
  startMonth: number;
}

export default function NurserySetupWizard({ onComplete }: { onComplete?: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<NurserySetupData>({
    name: "",
    region: "guanacaste",
    startMonth: new Date().getMonth() + 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await nurseryService.createNursery({
        name: data.name,
        region: data.region,
        startMonth: data.startMonth,
        language: "es",
      });

      // Call the callback if provided
      if (onComplete) {
        onComplete();
      }

      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Error creating nursery:", error);
      alert("Error al crear el vivero. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true; // Welcome step
      case 2:
        return data.name.trim().length > 0;
      case 3:
        return data.region.length > 0;
      case 4:
        return data.startMonth > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-green-50 p-6 border-b border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">
              Paso {step} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-green-700">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
                <Sprout className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a Vivero Maestro!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Vamos a configurar tu vivero en unos simples pasos.
                Esta información nos ayudará a darte recomendaciones
                personalizadas para tus plantas.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-blue-900">Configura tu vivero</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-purple-900">Tareas automáticas</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-900">Guías personalizadas</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Nursery Name */}
          {step === 2 && (
            <div>
              <div className="inline-flex p-3 bg-green-100 rounded-lg mb-4">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nombra tu Vivero
              </h2>
              <p className="text-gray-600 mb-6">
                Dale un nombre a tu vivero. Puede ser el nombre de tu finca,
                proyecto, o simplemente "Mi Vivero".
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Vivero
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Ej: Vivero La Esperanza"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Consejo:</strong> Escoge un nombre que te inspire.
                  Podrás cambiarlo después en la configuración.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Region */}
          {step === 3 && (
            <div>
              <div className="inline-flex p-3 bg-green-100 rounded-lg mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Dónde está tu Vivero?
              </h2>
              <p className="text-gray-600 mb-6">
                Selecciona la región de Costa Rica donde se encuentra tu vivero.
                Esto nos ayuda a darte recomendaciones según el clima local.
              </p>
              <div className="space-y-3">
                {seasonService.getAvailableRegions().map((region) => {
                  const regionNames = {
                    guanacaste: "Guanacaste",
                    "central-valley": "Valle Central",
                  };
                  const regionDescriptions = {
                    guanacaste: "Pacífico Norte - Clima seco tropical",
                    "central-valley": "Valle Central - Clima templado",
                  };

                  return (
                    <button
                      key={region}
                      onClick={() => setData({ ...data, region })}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        data.region === region
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {regionNames[region]}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {regionDescriptions[region]}
                          </p>
                        </div>
                        {data.region === region && (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-sm text-amber-800">
                  🌍 <strong>Nota:</strong> Actualmente soportamos Guanacaste y Valle Central.
                  Más regiones próximamente.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Start Month */}
          {step === 4 && (
            <div>
              <div className="inline-flex p-3 bg-green-100 rounded-lg mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Cuándo Inicias?
              </h2>
              <p className="text-gray-600 mb-6">
                Selecciona el mes en que comenzarás tu vivero. Esto nos ayuda
                a programar las tareas según la temporada.
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ].map((monthName, index) => {
                  const monthNumber = index + 1;
                  const season = seasonService.getSeasonForMonth(monthNumber, data.region);
                  const seasonColors = {
                    dry: "bg-orange-50 border-orange-200 text-orange-700",
                    rainy: "bg-blue-50 border-blue-200 text-blue-700",
                    transition: "bg-purple-50 border-purple-200 text-purple-700",
                  };

                  return (
                    <button
                      key={monthNumber}
                      onClick={() => setData({ ...data, startMonth: monthNumber })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        data.startMonth === monthNumber
                          ? "border-green-600 bg-green-50 ring-2 ring-green-600"
                          : `${seasonColors[season]} border-2`
                      }`}
                    >
                      <div className="font-semibold text-sm">{monthName}</div>
                      {data.startMonth === monthNumber && (
                        <CheckCircle2 className="w-4 h-4 mx-auto mt-1 text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Season Info for Selected Month */}
              <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-800">
                  📅 <strong>Temporada:</strong>{" "}
                  {seasonService.getSeasonForMonth(data.startMonth, data.region) === "dry"
                    ? "Temporada Seca (Diciembre - Abril)"
                    : "Temporada Lluviosa (Mayo - Noviembre)"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Atrás
          </button>

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                canProceed()
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                canProceed() && !isSubmitting
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Completar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}