// src/pages/HomePage.jsx
import { Button } from "@/components/ui/button";
import funcionesService from "../api/funciones.js";
import FondosActivosSection from "../pages/components/FondosActivosSection"; // Asegúrate de esta ruta
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
  FileDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useError } from "@/contexts/ErrorContext";
import { useExportData } from "@/hooks/useExportData";

// Importa los iconos de los archivos si los vas a seguir usando así
import pdfIcon from "../assets/icons/file-pdf-regular.svg";
import excelIcon from "../assets/icons/excel2-svgrepo-com.svg";

export default function HomePage() {
  const navigate = useNavigate();
  const [proyectosCrudosData, setProyectosCrudosData] = useState([]);
  const [proyectosProfesorData, setProyectosProfesorData] = useState([]);
  const [loadingQuickStats, setLoadingQuickStats] = useState(true);
  const { setError } = useError();

  const { loadingExportPDF, loadingExportExcel, generarPDF, generarExcel } =
    useExportData();

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
    setLoadingQuickStats(true);
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
      setError(e.message || "Error desconocido al cargar los datos.");
    } finally {
      setLoadingQuickStats(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section y Botones de Exportar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Centro de Control de Proyectos
            </h1>
            <p className="text-gray-600">
              Gestiona y monitorea todos tus proyectos desde un solo lugar
            </p>
          </div>
          {/* Botones de exportar */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <Button
              variant="secondary"
              className="bg-red-500 text-md text-white hover:bg-red-600 cursor-pointer"
              onClick={generarPDF}
              disabled={loadingExportPDF} // Deshabilitar mientras carga
            >
              {loadingExportPDF ? (
                // **** Spinner para el botón PDF ****
                <Spinner size={16} className="text-white mr-2" />
              ) : (
                <div className="bg-white rounded-full p-1 mr-2 flex items-center justify-center w-6 h-6">
                  <img
                    src={pdfIcon} // Usar la importación del icono
                    alt="PDF icon"
                    className="w-4 h-4"
                  />
                </div>
              )}
              Exportar Cartera
            </Button>

            <Button
              variant="secondary"
              className="bg-green-500 text-md text-white hover:bg-green-600 cursor-pointer"
              onClick={generarExcel}
              disabled={loadingExportExcel} // Deshabilitar mientras carga
            >
              {loadingExportExcel ? (
                // **** Spinner para el botón Excel ****
                <Spinner size={16} className="text-white mr-2" />
              ) : (
                <div className="bg-white rounded-full p-1 mr-2 flex items-center justify-center w-6 h-6">
                  <img
                    src={excelIcon} // Usar la importación del icono
                    alt="Excel icon"
                    className="w-4 h-4"
                  />
                </div>
              )}
              Exportar Cartera
            </Button>
          </div>
        </div>

        {/* Quick Stats - Los divs que contendrán los spinners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Total Proyectos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Proyectos
                </p>
                {loadingQuickStats ? (
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
                <p className="text-sm font-medium text-gray-600">
                  Proyectos Postulados
                </p>
                {loadingQuickStats ? (
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
                <p className="text-sm font-medium text-gray-600 ">
                  Proyectos Perfilados
                </p>
                {loadingQuickStats ? (
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
                  className="h-20 bg-gradient-to-r from-[#2463a2] to-[#669dd8] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
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
                  className="h-20 bg-gradient-to-r from-[#2463a2] to-[#669dd8] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
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
                  className="h-20 bg-gradient-to-r from-[#2463a2] to-[#669dd8] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
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
                  className="h-20 bg-gradient-to-r from-[#2463a2] to-[#669dd8] text-white justify-start p-6 group transition-transform hover:scale-[1.02] cursor-pointer"
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
