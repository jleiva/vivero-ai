import { Link, useLocation } from "react-router-dom";
import { Sprout, CheckCircle2, Leaf, Menu, X, Settings, BookOpen } from "lucide-react";
import { useState } from "react";
import { NurserySwitcher } from "./NurserySwitcher";
import { useNursery } from "../hooks/useNursery";

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const nursery = useNursery();

  const navItems = [
    { path: "/", label: "Inicio", icon: Sprout },
    { path: "/tasks", label: "Tareas", icon: CheckCircle2 },
    { path: "/plants", label: "Plantas", icon: Leaf },
    { path: "/species", label: "Especies", icon: BookOpen },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vivero Maestro</h1>
              {nursery && (
                <p className="text-xs text-gray-500 capitalize">{nursery.region}</p>
              )}
            </div>
            
            {/* Add Nursery Switcher here if you haven't already */}
            <NurserySwitcher />
          </div>
          
          <div className="flex gap-2 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Add Settings Link */}
            <Link
              to="/settings/nursery"
              className={`p-2 rounded-lg transition-all ${
                location.pathname === '/settings/nursery'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Configuración de Viveros"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-7 h-7 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vivero Maestro</h1>
              {nursery && (
                <p className="text-xs text-gray-500 capitalize">{nursery.region}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Add Settings Link for Mobile */}
            <Link
              to="/settings/nursery"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-medium border-t border-gray-100 transition-all ${
                location.pathname === '/settings/nursery'
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}