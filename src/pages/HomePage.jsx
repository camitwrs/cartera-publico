import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  FolderPlus,
  PenTool,
  Plus,
  Settings,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  Zap,
  FileDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  // Datos simulados
  const estadisticas = {
    totalProyectos: 24,
    proyectosActivos: 12, // estatus activo
    proyectosCompletados: 8, // estatus completado
    enRevision: 4, // estatus en revisión
    montoTotal: 2450000, // suma de montos de proyectos
    fondosDisponibles: 3, // fondos con fecha de cierre futura
  };

  const proyectosRecientes = [
    {
      id: 1,
      nombre: "Sistema de Gestión Inteligente",
      investigadorPrincipal: "Dr. María González",
      unidad: "Ingeniería de Sistemas",
      estatus: "En Progreso",
      fechaPostulacion: "2024-01-15",
      monto: 150000,
      tematica: "Inteligencia Artificial",
    },
    {
      id: 2,
      nombre: "Optimización de Procesos Industriales",
      investigadorPrincipal: "Dr. Carlos Rodríguez",
      unidad: "Ingeniería Industrial",
      estatus: "En Revisión",
      fechaPostulacion: "2024-01-10",
      monto: 200000,
      tematica: "Automatización",
    },
    {
      id: 3,
      nombre: "Desarrollo de Materiales Sostenibles",
      investigadorPrincipal: "Dra. Ana Martínez",
      unidad: "Ingeniería Química",
      estatus: "Completado",
      fechaPostulacion: "2023-12-20",
      monto: 180000,
      tematica: "Sustentabilidad",
    },
  ];

  const fondosActivos = [
    {
      id: 1,
      nombre: "FONDECYT Regular 2024",
      cierre: "2024-03-15",
      financiamiento: "Hasta $300,000",
      institucion: "ANID",
    },
    {
      id: 2,
      nombre: "Fondef IDeA I+D",
      cierre: "2024-04-30",
      financiamiento: "Hasta $500,000",
      institucion: "ANID",
    },
  ];

  const notificaciones = [
    {
      id: 1,
      tipo: "revision",
      titulo: "Revisión pendiente",
      descripcion: "Proyecto Sistema de Gestión requiere revisión",
      fecha: "Hace 2 horas",
    },
    {
      id: 2,
      tipo: "completado",
      titulo: "Proyecto completado",
      descripcion: "Desarrollo de Materiales Sostenibles finalizado",
      fecha: "Ayer",
    },
    {
      id: 3,
      tipo: "fondo",
      titulo: "Nueva convocatoria",
      descripcion: "FONDECYT Regular 2024 abierta",
      fecha: "Hace 3 días",
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Centro de Control de Proyectos
          </h1>
          <p className="text-gray-600">
            Gestiona y monitorea todos tus proyectos desde un solo lugar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Proyectos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.totalProyectos}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderPlus className="w-6 h-6 text-[#2E5C8A]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.proyectosCompletados}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.proyectosActivos}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Primary Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Acciones Rápidas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="h-20 bg-[#7bb6e9] hover:bg-[#75a9d9] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
                  size="lg"
                  onClick={() => navigate("/visualizacion")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <FolderPlus className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Ver Proyectos</div>
                      <div className="text-sm opacity-90">
                        Gestiona tu cartera
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  className="h-20 bg-[#3172b3] hover:bg-[#617fac] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate("/anadir-proyectos")}
                  size="lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Crear Proyecto</div>
                      <div className="text-sm opacity-90">
                        Inicia algo nuevo
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  className="h-20 bg-[#4c86e2] hover:bg-[#82b2ff] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
                  size="lg"
                  onClick={() => navigate("/editar-proyectos")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <PenTool className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Editar Proyectos</div>
                      <div className="text-sm opacity-90">
                        Actualiza información
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  className="h-20 bg-[#16457e] hover:bg-[#314c63] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
                  size="lg"
                  onClick={() => navigate("/estadisticas")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Ver Estadísticas</div>
                      <div className="text-sm opacity-90">Analiza métricas</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-6">
            {/* Notifications */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notificaciones
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Revisión pendiente
                    </p>
                    <p className="text-xs text-gray-600">
                      Proyecto Sistema de Gestión
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Proyecto completado
                    </p>
                    <p className="text-xs text-gray-600">
                      App Mobile finalizada
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Fondos Activos */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Fondos Activos
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {fondosActivos.map((fondo) => (
                  <div
                    key={fondo.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">
                      {fondo.nombre}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {fondo.institucion}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        Cierre: {new Date(fondo.cierre).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-medium text-green-600">
                        {fondo.financiamiento}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
