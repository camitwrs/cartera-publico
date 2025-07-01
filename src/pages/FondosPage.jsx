// src/pages/FondosConcursablesPage.jsx

import { useState, useCallback, useEffect } from "react";
import {
  // Asegúrate de importar solo lo que realmente usas
  Search,
  ChevronDown, // Usaremos ChevronDown para el selector, pero no en AccordionTrigger
  Target,
  ClipboardList,
  Calendar,
  RotateCcw,
  XCircle,
  Info,
} from "lucide-react";

// Importa los componentes de Accordion de Shadcn UI
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Spinner } from "@/components/ui/spinner"; // Importa el Spinner de Shadcn
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Importa Alert de Shadcn
import { Button } from "@/components/ui/button"; // Importa Button de Shadcn
import { Input } from "@/components/ui/input"; // Importa Input de Shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Importa Select de Shadcn

import { useError } from "@/contexts/ErrorContext"; // Importa tu hook de error global

import fondosService from "../api/fondos.js"; // Importa el servicio de fondos
import tipoConvocatoriaService from "../api/tipoconvocatoria.js"; // Importa el servicio de tipos de convocatoria

// Importa los logos de las imágenes
import anidLogo from "../assets/tipos_convocatorias/anid_rojo_azul.png";
import corfoLogo from "../assets/tipos_convocatorias/corfo2024.png";
import goreLogo from "../assets/tipos_convocatorias/gore-valpo.jpg";
import internasPucvLogo from "../assets/tipos_convocatorias/internaspucv.svg";
import privadaLogo from "../assets/tipos_convocatorias/private.png";

// Mapeo de tipos de fondo a sus logos
const FONDO_LOGOS = {
  ANID: anidLogo,
  CORFO: corfoLogo,
  GORE: goreLogo,
  Internas: internasPucvLogo,
  PRIVADA: privadaLogo,
};

export default function FondosPage() {
  const [fondosData, setFondosData] = useState([]); // Almacenará los fondos reales de la API
  const [loading, setLoading] = useState(true); // Estado de carga para la página
  const [errorLocal, setErrorLocal] = useState(null); // Estado de error local para la página
  const { setError: setErrorGlobal } = useError(); // Hook para mostrar errores globales

  // Estados para los filtros
  const [filterTipoFondo, setFilterTipoFondo] = useState("todos"); // Filtro por Tipo de Convocatoria (nombre)
  const [filterTrl, setFilterTrl] = useState("todos"); // Filtro por TRL (valor numérico o "N/A" como string)
  const [filterEstado, setFilterEstado] = useState("todos"); // Filtro por Estado (Vigente/Finalizado)
  const [searchTerm, setSearchTerm] = useState(""); // Filtro por búsqueda de texto
  // Mapas para IDs a Nombres (se llenarán desde la API para procesamiento de datos)
  const [tipoConvocatoriaMap, setTipoConvocatoriaMap] = useState({}); // ID Tipo Conv -> Nombre

  // Helper para obtener el color del badge del Tipo de Fondo
  const getTipoFondoColor = useCallback((tipoFondoNombre) => {
    switch (tipoFondoNombre) {
      case "ANID":
        return "bg-red-500 text-white";
      case "CORFO":
        return "bg-orange-500 text-white";
      case "Internas PUCV":
        return "bg-blue-500 text-white";
      case "GORE":
        return "bg-purple-500 text-white"; // Si "GORE" es un nombre de tipo_convo
      case "PRIVADA":
        return "bg-gray-600 text-white"; // Si "PRIVADA" es un nombre de tipo_convo
      default:
        return "bg-gray-500 text-white";
    }
  }, []);

  const renderTipoFondoLogo = useCallback((tipoFondoNombre) => {
    const logoSrc = FONDO_LOGOS[tipoFondoNombre];
    if (logoSrc) {
      return (
        <img
          src={logoSrc}
          alt={`${tipoFondoNombre} Logo`}
          className="h-5 w-5 object-contain rounded-full border border-gray-200"
        />
      );
    }
    return +(
      <div className="h-5 w-5 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 text-[0.7rem] font-bold flex-shrink-0">
        {tipoFondoNombre ? tipoFondoNombre.charAt(0) : "F"}
      </div>
    );
  }, []);

  const getTRLColor = (trl) => {
    if (trl === "Sin información") return "bg-gray-500 text-white";
    return "bg-green-500 text-white";
  };

  // Helper para formatear fechas del modal (si no lo tienes ya)
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "Fecha Inválida";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("es-CL", options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha Inválida";
    }
  }, []);

  // Helper para determinar si un fondo está vigente
  const isFondoVigente = useCallback((fondo) => {
    if (!fondo.inicio || !fondo.cierre) return false;
    const hoy = new Date();
    const inicio = new Date(fondo.inicio);
    const cierre = new Date(fondo.cierre);
    cierre.setHours(23, 59, 59, 999); // Ajustar a fin del día para comparación inclusiva
    return hoy >= inicio && hoy <= cierre;
  }, []);

  // Helper para obtener el color del badge de estado (Vigente/Finalizado)
  const getEstadoBadgeColor = useCallback((isVigente) => {
    return isVigente ? "bg-green-500 text-white" : "bg-red-500 text-white";
  }, []);

  // --- Fetching de datos inicial ---
  const fetchAllFondosData = async () => {
    setLoading(true);
    setErrorLocal(null);
    setErrorGlobal(null);
    try {
      const [fondosResponse, tiposConvocatoriaResponse] = await Promise.all([
        fondosService.getAllFondos(),
        tipoConvocatoriaService.getAllTiposConvocatoria(),
      ]);

      // Construir mapa ID Tipo Conv -> Nombre
      const newTipoConvocatoriaMap = tiposConvocatoriaResponse.reduce(
        (map, tipo) => {
          map[tipo.id] = tipo.nombre;
          return map;
        },
        {}
      );
      setTipoConvocatoriaMap(newTipoConvocatoriaMap);

      // Procesar fondos: añadir el nombre del tipo de convocatoria y el estado de vigencia
      const processedFondos = fondosResponse.map((fondo) => {
        const tipoNombre = newTipoConvocatoriaMap[fondo.tipo] || "Desconocido"; // Usamos fondo.tipo
        const estadoVigente = isFondoVigente(fondo) ? "Vigente" : "Finalizado";

        return {
          ...fondo,
          tipo_nombre: tipoNombre, // Nombre de la convocatoria (tipo de fondo)
          estado_vigencia: estadoVigente, // "Vigente" o "Finalizado"
        };
      });

      setFondosData(processedFondos);
    } catch (err) {
      console.error("Error fetching fondos data:", err);
       setErrorGlobal({
        type: "error", // Forzar a tipo error si falló
        title: "Error al cargar los fondos.",
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFondosData();
  }, []); // El array vacío asegura que se ejecute una sola vez al montar

  // --- Lógica de Filtrado ---
  const filteredFondos = fondosData.filter((fondo) => {
    const matchesTipoFondo =
      filterTipoFondo === "todos" || fondo.tipo_nombre === filterTipoFondo;
    // Manejar TRL que puede ser null o una cadena, y el filtro "N/A"
    const matchesTrl =
      filterTrl === "todos" ||
      (fondo.trl !== null && String(fondo.trl) === filterTrl) ||
      (filterTrl === "Sin información" && fondo.trl === null);
    const matchesEstado =
      filterEstado === "todos" || fondo.estado_vigencia === filterEstado;
    const matchesSearch =
      searchTerm === "" ||
      fondo.nombre.toLowerCase().startsWith(searchTerm.toLowerCase());

    return matchesTipoFondo && matchesTrl && matchesEstado && matchesSearch;
  });

  // Opciones únicas para Selects (basadas en los datos reales)
  // uniqueTiposFondo se basa en `tipo_nombre` del fondo procesado
  const uniqueTiposFondo = [...new Set(fondosData.map((f) => f.tipo_nombre))]
    .filter(Boolean)
    .sort();
  // uniqueTRLs es fijo (1-9 y N/A) ya que los valores de TRL no se sacan de una tabla externa
  const uniqueTRLs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  // uniqueEstados son fijos (Vigente/Finalizado)
  const uniqueEstados = ["Vigente", "Finalizado"];

  const resetFilters = () => {
    setFilterTipoFondo("todos");
    setFilterTrl("todos");
    setFilterEstado("todos");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Fondos Concursables
          </h2>
          <p className="text-gray-600 mt-2">
            Explora y gestiona todas las convocatorias disponibles para
            financiar tus proyectos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Tipo de Fondo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TIPO DE FONDO:
              </label>
              <div className="relative">
                <Select
                  value={filterTipoFondo}
                  onValueChange={setFilterTipoFondo}
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {uniqueTiposFondo.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* TRL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TRL:
              </label>
              <div className="relative">
                <Select value={filterTrl} onValueChange={setFilterTrl}>
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {uniqueTRLs.map((trl) => (
                      <SelectItem key={trl} value={trl}>
                        {trl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESTADO:
              </label>
              <div className="relative">
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {uniqueEstados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botón Reiniciar */}
            <div className="flex items-end">
              <Button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reiniciar Filtros
              </Button>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                &nbsp;
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading / Error / No Results - AÑADIR TODO ESTE BLOQUE AQUÍ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
            <Spinner size={48} className="text-blue-600 mb-4" />
            <p className="text-lg text-gray-600">
              Cargando fondos... Por favor, espere.
            </p>
          </div>
        ) : errorLocal ? (
          <Alert variant="destructive" className="bg-red-50 text-red-700">
            <XCircle className="h-5 w-5 mr-4" />
            <AlertTitle>Error al cargar fondos</AlertTitle>
            <AlertDescription>{errorLocal}</AlertDescription>
          </Alert>
        ) : filteredFondos.length === 0 ? (
          <Alert variant="default" className="bg-blue-50 text-blue-700">
            <Info className="h-5 w-5 mr-4" />
            <AlertTitle>No hay fondos</AlertTitle>
            <AlertDescription>
              No se encontraron fondos con los filtros o búsqueda actuales.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {" "}
            {/* Fragment para envolver los dos divs siguientes (Headers y Lista) */}
            {/* Headers de columna */}
            <div className="bg-white rounded-t-lg shadow-lg hidden md:block">
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm items-center">
                <div className="text-center">Nombre del Fondo</div>{" "}
                {/* Alineado a la izquierda */}
                <div className="text-center">Tipo de Fondo</div>{" "}
                {/* Alineado al centro */}
                <div className="text-center">TRL</div>{" "}
                {/* Alineado al centro */}
                <div className="text-center">Financiamiento</div>{" "}
                {/* Alineado a la derecha */}
                <div className="text-center">Duración</div>{" "}
                {/* Alineado al centro */}
                <div className="text-center">Estado</div>{" "}
                {/* Alineado al centro */}
              </div>
            </div>
            {/* Lista de fondos */}
            <div className="bg-white rounded-b-lg shadow-lg overflow-hidden px-4">
              {/* El componente Accordion principal */}
              <Accordion type="single" collapsible className="w-full">
                {filteredFondos.map((fondo) => (
                  <AccordionItem
                    value={`item-${fondo.id}`}
                    key={fondo.id}
                    className="border-b border-gray-200"
                  >
                    <AccordionTrigger>
                      {/* Aquí puedes poner un solo <div> o incluso directamente los <span> y <div> de las columnas */}
                      {/* Versión escritorio */}
                      <div className="hidden md:grid grid-cols-6 gap-4 w-full items-center py-2">
                        <div className="text-left flex items-center gap-2">
                          {renderTipoFondoLogo(fondo.tipo_nombre)}
                          <span className="font-medium text-gray-900">
                            {fondo.nombre}
                          </span>
                        </div>
                        {/* Columna de Tipo de Fondo (nombre de la convocatoria) */}
                        <div className="text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getTipoFondoColor(fondo.tipo_nombre)}`}
                          >
                            {fondo.tipo_nombre}
                          </span>
                        </div>
                        {/* TRL */}
                        <div className="text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getTRLColor(fondo.trl === null ? "Sin información" : String(fondo.trl))}`}
                          >
                            {fondo.trl === null
                              ? "Sin información"
                              : `TRL ${fondo.trl}`}
                          </span>
                        </div>
                        <div className="text-center text-gray-700 font-medium">
                          {fondo.financiamiento || "Sin información"}
                        </div>
                        <div className="text-center text-gray-700">
                          {fondo.plazo || "Sin información"}
                        </div>
                        <div className="text-center">
                          {" "}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoBadgeColor(fondo.estado_vigencia === "Vigente")}`}
                          >
                            {fondo.estado_vigencia}
                          </span>
                        </div>
                      </div>

                      {/* Versión móvil (visible solo en móviles) */}
                      <div className="block md:hidden w-full text-left space-y-1">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {renderTipoFondoLogo(fondo.tipo_nombre)}
                          {fondo.nombre}
                        </div>
                        <div className="text-sm text-gray-600">
                          Tipo:{" "}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${getTipoFondoColor(fondo.tipo_nombre)}`}
                          >
                            {fondo.tipo_nombre}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Estado:{" "}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${getEstadoBadgeColor(fondo.estado_vigencia === "Vigente")}`}
                          >
                            {fondo.estado_vigencia}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    {/* AccordionContent es el detalle que se expande */}
                    <AccordionContent className="bg-gray-50 p-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Objetivo */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-gray-600" />
                            Objetivo:
                          </h4>
                          <p className="text-sm text-gray-600">
                            {fondo.objetivo ||
                              "No se ha especificado el objetivo para este fondo."}
                          </p>
                        </div>

                        {/* Requisitos */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <ClipboardList className="w-4 h-4 mr-2 text-gray-600" />
                            Requisitos:
                          </h4>
                          {fondo.req && fondo.req !== "" ? (
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {/* Ajuste para requisitos: Dividir por saltos de línea y filtrar vacíos */}
                              {fondo.req
                                .split(/[\r\n]/)
                                .map((req, i) =>
                                  req.trim() ? (
                                    <li key={i}>{req.trim()}</li>
                                  ) : null
                                )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600">
                              No hay requisitos detallados disponibles.
                            </p>
                          )}
                        </div>

                        {/* Fechas Importantes */}
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                            Fechas Importantes:
                          </h4>
                          <p className="text-sm text-gray-600">
                            Inicio: {formatDate(fondo.inicio)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cierre: {formatDate(fondo.cierre)}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
