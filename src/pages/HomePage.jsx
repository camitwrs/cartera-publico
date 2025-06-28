import { Button } from "@/components/ui/button";
import funcionesService from "../api/funciones.js";
import FondosActivosSection from "./components/FondosActivosSection.jsx";
import estadisticasService from "../api/estadisticas.js";
import { useState, useEffect } from "react";

// **** Importa tu componente Spinner específico para esta página ****
import { Spinner } from "@/components/ui/spinner";

import {
  BarChart3,
  FolderPlus,
  PenTool,
  Plus,
  ArrowRight,
  ContactRound,
  FolderOpen,
  FolderCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// Mantienes el useError, pero NO usarás useLoading aquí.
import { useError } from "@/contexts/ErrorContext";

export default function HomePage() {
  const navigate = useNavigate();
  const [proyectosCrudosData, setProyectosCrudosData] = useState([]);
  const [proyectosProfesorData, setProyectosProfesorData] = useState([]);
  // **** Vuelve a usar useState local para `loading` ****
  const [loading, setLoading] = useState(true); // Inicia en true para mostrar el spinner al cargar
  // Mantienes el uso del hook de error global
  const { setError } = useError();

  // Las variables calculadas se mantienen igual
  const proyectosEnCartera = Array.isArray(proyectosCrudosData)
    ? proyectosCrudosData.length
    : 0;

  const postuladosCount = Array.isArray(proyectosCrudosData)
    ? proyectosCrudosData.filter((p) => p.estatus === "Postulado").length
    : 0;

  const perfiladosCount = Array.isArray(proyectosCrudosData)
    ? proyectosCrudosData.filter((p) => p.estatus === "Perfilado").length
    : 0;

  const fetchData = async () => {
    // Aquí el `setLoading(true)` es el local de este componente
    setLoading(true);
    // Limpia el error global antes de la nueva petición
    setError(null);
    try {
      const projectsResponse =
        await funcionesService.getDataInterseccionProyectos();
      const profProjectsResponse =
        await estadisticasService.getAcademicosPorUnidad();
      console.log("projectsResponse:", projectsResponse);

      setProyectosCrudosData(
        Array.isArray(projectsResponse) ? projectsResponse : []
      );
      setProyectosProfesorData(
        Array.isArray(profProjectsResponse) ? profProjectsResponse : []
      );
    } catch (e) {
      console.error("Error fetching data for dashboard summary:", e);
      // Muestra el error globalmente a través del contexto
      setError(e.message || "Error desconocido al cargar los datos.");
    } finally {
      // Aquí el `setLoading(false)` es el local de este componente
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ... (Resto de tus datos simulados y JSX)
  const estadisticas = {
    totalProyectos: 24,
    proyectosActivos: 12,
    proyectosCompletados: 8,
    enRevision: 4,
    montoTotal: 2450000,
    fondosDisponibles: 3,
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

        {/* Quick Stats - Los divs que contendrán los spinners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Total Proyectos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Proyectos
                </p>
                {loading ? (
                  // **** Spinner para Total Proyectos ****
                  <div className="flex justify-center items-center h-8">
                    <Spinner size={24} className="text-[#2E5C8A]" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {proyectosEnCartera}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-[#2E5C8A]" />
              </div>
            </div>
          </div>

          {/* Tarjeta de Postulados */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Postulados</p>
                {loading ? (
                  // **** Spinner para Postulados ****
                  <div className="flex justify-center items-center h-8">
                    <Spinner size={24} className="text-green-600" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {postuladosCount}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Tarjeta de Perfilados */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perfilados</p>
                {loading ? (
                  // **** Spinner para Perfilados ****
                  <div className="flex justify-center items-center h-8">
                    <Spinner size={24} className="text-purple-600" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {perfiladosCount}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ContactRound className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Areas (Se mantienen igual) */}
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
            {/* Fondos Activos */}
            <FondosActivosSection />
          </div>
        </div>
      </main>
    </div>
  );
}
