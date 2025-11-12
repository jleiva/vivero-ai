import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";
import { nurseryService } from "../services/nurseryService";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NurserySwitcher() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const nurseries = useLiveQuery(() => db.nurseries.toArray(), []) ?? [];
  const activeNursery = useLiveQuery(async () => {
    return await nurseryService.getActiveNursery();
  }) ?? null;

  const handleSwitch = async (nurseryId: number) => {
    try {
      await nurseryService.switchNursery(nurseryId);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error switching nursery:", error);
      alert("Error al cambiar de vivero");
    }
  };

  if (nurseries.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
      >
        <span className="text-sm font-medium text-gray-700">
          {activeNursery?.name || "Seleccionar vivero"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown  */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[101]">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Mis Viveros
              </div>
              
              {nurseries.map((nursery) => (
                <button
                  key={nursery.id}
                  onClick={() => handleSwitch(nursery.id!)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    nursery.id === activeNursery?.id
                      ? "bg-green-50 text-green-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div>
                    <div className="font-medium">{nursery.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{nursery.region}</div>
                  </div>
                  {nursery.id === activeNursery?.id && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/setup");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear Nuevo Vivero
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}