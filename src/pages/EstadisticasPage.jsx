import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Building2,
  DollarSign,
  FileText,
  GraduationCap,
  Users,
  University,
  ChevronDown, // Importar ChevronDown para el icono de expandir/colapsar
  ChevronUp, // Importar ChevronUp para el icono de expandir/colapsar
  ArrowDownToLine,
  ArrowUpToLine,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Text,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useError } from "@/contexts/ErrorContext";

import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, Info } from "lucide-react";

import funcionesService from "../api/funciones.js";
import estadisticasService from "../api/estadisticas.js";
import academicosService from "../api/academicos.js";
import unidadesAcademicasService from "../api/unidadesacademicas.js";

export default function EstadisticasPage() {
  const [proyectosData, setProyectosData] = useState([]); // getDataInterseccionProyectos
  const [profesoresPorUnidadData, setProfesoresPorUnidadData] = useState([]); // estadisticasService.getAcademicosPorUnidad
  const [proyectosPorProfesorData, setProyectosPorProfesorData] = useState([]); // estadisticasService.getProyectosPorProfesor
  const [academicosData, setAcademicosData] = useState([]); // academicosService.getAllAcademicos
  const [unidadesData, setUnidadesData] = useState([]); // unidadesAcademicasService.getAllUnidadesAcademicas

  const [academicosMap, setAcademicosMap] = useState({});
  const [unidadesMap, setUnidadesMap] = useState({});

  const [indicadoresPrincipales, setIndicadoresPrincipales] = useState({
    proyectosEnCartera: 0,
    montoFormulado: 0, // En número, se formatea en la función formatMM
    escuelasFIN: 0,
    academicosInvolucrados: 0,
    empresasPartners: 0,
    universidadesPartners: 0, // Si no tienes API para esto
  });

  const [tematicasDestacadas, setTematicasDestacadas] = useState([]);
  const [instrumentosPostulados, setInstrumentosPostulados] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorLocal, setErrorLocal] = useState(null);
  const { setError: setErrorGlobal } = useError();

  // --- Estados para los filtros ---
  const [selectedEscuela, setSelectedEscuela] = useState("Todas las Escuelas");
  const [selectedTematica, setSelectedTematica] = useState(
    "Todas las Temáticas"
  );
  const [selectedInstitucion, setSelectedInstitucion] = useState(
    "Todas las Instituciones"
  );

  // Opciones para los selects de filtro (calculadas dinámicamente)
  const opcionesEscuela = [
    "Todas las Escuelas",
    ...new Set(unidadesData.map((u) => u.nombre)),
  ]
    .filter(Boolean)
    .sort();
  const opcionesTematica = [
    "Todas las Temáticas",
    ...new Set(proyectosData.map((p) => p.tematica)),
  ]
    .filter(Boolean)
    .sort();
  // Asumiendo que 'institucion' en proyectosData es la cadena de texto del nombre de la institución
  const opcionesInstitucion = [
    "Todas las Instituciones",
    ...new Set(proyectosData.map((p) => p.institucion)),
  ]
    .filter(Boolean)
    .sort();


  // --- Estados para los datos filtrados de los gráficos ---
  const [filteredProfesoresPorUnidad, setFilteredProfesoresPorUnidad] =
    useState([]);
  const [filteredProyectosPorProfesor, setFilteredProyectosPorProfesor] =
    useState([]);
  const [filteredProyectosPorTematica, setFilteredProyectosPorTematica] =
    useState([]);
  const [filteredProyectosPorInstitucion, setFilteredProyectosPorInstitucion] =
    useState([]);
  const [filteredProyectosPorUnidad, setFilteredProyectosPorUnidad] = useState(
    []
  );

  // Paleta de azules (mantener consistente para los pie charts)
  const bluePalette = [
    "#2E5C8A", // Azul principal
    "#5D95C8", // Azul medio
    "#7CA3CB", // Azul claro
    "#3B82F6", // Azul acento
    "#1E3A5C", // Azul oscuro
    "#0F2A4A", // Más oscuro
    "#4A7A9F", // Intermedio
  ];

  const groupAndCount = (data, key) => {
    const counts = {};
    data.forEach((item) => {
      // Usar el nombre mapeado si existe, o la clave directa
      const keyValue = item[`${key}_nombre`] || item[key];
      if (keyValue) {
        // Asegura que el valor no sea nulo o vacío
        counts[keyValue] = (counts[keyValue] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  // Helper para formatear montos a MM$
  const formatMM = useCallback((monto) => {
    if (monto === null || monto === undefined || isNaN(monto)) return "0 MM$";
    const numericMonto = parseFloat(monto); // Asegura que el monto sea un número antes de dividir
    if (isNaN(numericMonto)) return "0 MM$";
    return `${(numericMonto / 1000000).toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })} MM$`;
  }, []);

  // Componente de etiqueta personalizada para PieChart
  const renderCustomizedLabel = useCallback(
    ({ cx, cy, midAngle, outerRadius, percent, index, name, value }) => {
      const radius = outerRadius * 1.2;
      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
      const textAnchor = x > cx ? "start" : "end";
      return (
        <Text
          x={x}
          y={y}
          fill="#000"
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
        >
          {`${name}: ${value}`}
        </Text>
      );
    },
    []
  );

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorLocal(null);
    setErrorGlobal(null);
    try {
      const [
        proyectosRes,
        profesoresPorUnidadRes, // De estadisticasService
        proyectosPorProfesorRes, // De estadisticasService
        academicosRes, // De academicosService
        unidadesRes, // De unidadesAcademicasService
      ] = await Promise.all([
        funcionesService.getDataInterseccionProyectos(),
        estadisticasService.getAcademicosPorUnidad(), // Asumo que devuelve {UnidadAcademica, NumeroDeProfesores}
        estadisticasService.getProyectosPorProfesor(), // Asumo que devuelve {NombreAcademico, ApellidoAcademico, ...}
        academicosService.getAllAcademicos(),
        unidadesAcademicasService.getAllUnidadesAcademicas(),
      ]);

      // Mapear académicos (id -> objeto académico completo)
      const newAcademicosMap = academicosRes.reduce((map, acad) => {
        map[acad.id_academico] = {
          ...acad,
          nombre_completo:
            `${acad.nombre} ${acad.a_paterno || ""} ${acad.a_materno || ""}`.trim(),
        };
        return map;
      }, {});
      setAcademicosMap(newAcademicosMap);
      setAcademicosData(academicosRes); // Guarda los datos de académicos completos

      // Mapear unidades académicas (id_unidad -> objeto unidad)
      const newUnidadesMap = unidadesRes.reduce((map, unidad) => {
        map[unidad.id_unidad] = unidad;
        return map;
      }, {});
      setUnidadesMap(newUnidadesMap);
      setUnidadesData(unidadesRes); // Guarda los datos de unidades completos

      // Procesar proyectos: añadir nombres completos de líder, unidad, etc.
      const processedProyectos = proyectosRes.map((p) => {
        const academicoLider = newAcademicosMap[p.investigador_principal];
        const unidadAcademica = newUnidadesMap[academicoLider?.id_unidad];

        return {
          ...p,
          nombre_lider_completo:
            academicoLider?.nombre_completo || "Desconocido",
          nombre_unidad_academica: unidadAcademica?.nombre || "Desconocida",
        };
      });
      setProyectosData(processedProyectos); // Guarda los proyectos procesados

      // Guarda los datos de la API para los gráficos directamente
      setProfesoresPorUnidadData(profesoresPorUnidadRes);
      setProyectosPorProfesorData(proyectosPorProfesorRes);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setErrorLocal(err.message || "Error al cargar los datos del dashboard.");
      setErrorGlobal(err.message || "Error al cargar los datos del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect para llamar a fetchDashboardData al montar
  useEffect(() => {
    fetchDashboardData();
  }, []); // El array vacío asegura que se ejecute una sola vez al montar

  // --- Lógica de filtrado ---
  useEffect(() => {
    // 1. Datos base para filtrar: Proyectos del estado
    let currentProyectos = proyectosData;
    let currentProfesoresPorUnidad = profesoresPorUnidadData;
    let currentProyectosPorProfesor = proyectosPorProfesorData;

    // 2. Aplicar filtros SELECT (escuela, temática, institución) a `currentProyectos`
    if (selectedEscuela !== "Todas las Escuelas") {
      currentProyectos = currentProyectos.filter(
        (p) => p.nombre_unidad_academica === selectedEscuela
      );
      currentProfesoresPorUnidad = profesoresPorUnidadData.filter(
        (item) => item.UnidadAcademica === selectedEscuela
      );
      currentProyectosPorProfesor = proyectosPorProfesorData.filter(
        (p) => p.UnidadAcademica === selectedEscuela
      );
    } else {
      currentProfesoresPorUnidad = profesoresPorUnidadData;
      currentProyectosPorProfesor = proyectosPorProfesorData;
    }

    if (selectedTematica !== "Todas las Temáticas") {
      currentProyectos = currentProyectos.filter(
        (p) => p.tematica === selectedTematica
      );
    }

    if (selectedInstitucion !== "Todas las Instituciones") {
      currentProyectos = currentProyectos.filter(
        (p) => p.institucion === selectedInstitucion
      );
    }

    // 3. Recalcular datos para los gráficos basados en los `currentProyectos` filtrados
    setFilteredProyectosPorTematica(
      groupAndCount(currentProyectos, "tematica")
    );
    setFilteredProyectosPorInstitucion(
      groupAndCount(currentProyectos, "institucion")
    );

    // Actualizar estados de los gráficos
    setFilteredProfesoresPorUnidad(currentProfesoresPorUnidad);
    setFilteredProyectosPorProfesor(
      currentProyectosPorProfesor.map((p) => ({
        profesor: `${p.NombreAcademico} ${p.ApellidoAcademico || ""}`.trim(),
        proyectos: p.NumeroDeProyectos,
      }))
    );
    setFilteredProyectosPorUnidad(
      groupAndCount(currentProyectos, "nombre_unidad_academica")
    );

    // Recalcular Indicadores Principales Compactos
    const projectsInDashboard = proyectosData; // Estos no se filtran por ahora, son siempre los datos crudos

    const totalMonto = projectsInDashboard.reduce(
      (sum, item) => sum + (item.monto || 0), // Asegurarse que item.monto sea un número, si es string "X millones"
      0
    );
    setIndicadoresPrincipales({
      proyectosEnCartera: projectsInDashboard.length,
      montoFormulado: formatMM(totalMonto),
      escuelasFIN: new Set(unidadesData.map((u) => u.nombre)).size,
      academicosInvolucrados: new Set(academicosData.map((a) => a.id_academico))
        .size,
      empresasPartners: new Set(projectsInDashboard.map((p) => p.institucion))
        .size,
      universidadesPartners: 0, // No tenemos este dato de la API aún
    });

    // Actualizar tematicas e instrumentos postulados para las listas
    const countsTematicas = groupAndCount(projectsInDashboard, "tematica")
      .sort((a, b) => b.value - a.value)
      .map((item) => item.name)
      .slice(0, 6);
    setTematicasDestacadas(countsTematicas);

    const groupedInstruments = projectsInDashboard.reduce((acc, item) => {
      const key = `${item.apoyo || "Desconocido"} (${item.institucion || "Desconocida"})`;
      if (!acc[key]) {
        acc[key] = { name: key, monto: 0 };
      }
      acc[key].monto += item.monto || 0; // Sumar montos
      return acc;
    }, {});
    const processedInstruments = Object.values(groupedInstruments)
      .map((instrument) => ({
        ...instrument,
        montoFormatted: formatMM(instrument.monto),
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 4);
    setInstrumentosPostulados(processedInstruments);
  }, [
    selectedEscuela,
    selectedTematica,
    selectedInstitucion,
    proyectosData,
    profesoresPorUnidadData,
    proyectosPorProfesorData,
    academicosData,
    unidadesData,
    formatMM,
  ]); // Dependencias

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Título principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Estadísticas</h2>
          <p className="text-gray-600 mt-2">
            Datos para la toma de decisiones estratégicas
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label
              htmlFor="select-escuela"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filtrar por Escuela
            </label>
            <Select onValueChange={setSelectedEscuela} value={selectedEscuela}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Escuela" />
              </SelectTrigger>
              <SelectContent>
                {opcionesEscuela.map((opcion) => (
                  <SelectItem key={opcion} value={opcion}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="select-tematica"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filtrar por Temática
            </label>
            <Select
              onValueChange={setSelectedTematica}
              value={selectedTematica}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Temática" />
              </SelectTrigger>
              <SelectContent>
                {opcionesTematica.map((opcion) => (
                  <SelectItem key={opcion} value={opcion}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="select-institucion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filtrar por Institución
            </label>
            <Select
              onValueChange={setSelectedInstitucion}
              value={selectedInstitucion}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar Institución" />
              </SelectTrigger>
              <SelectContent>
                {opcionesInstitucion.map((opcion) => (
                  <SelectItem key={opcion} value={opcion}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr_2fr] gap-8 mb-8">
          {" "}
          {/* Grid principal: 1 col móvil, 3 en grandes */}
          {/* COLUMNA 1: Indicadores y Resúmenes */}
          <div className="space-y-8">
            {" "}
            {/* h-full para estirar verticalmente */}
            {/* Indicadores Principales Compactos */}
            <div className="grid grid-cols-1 gap-4">
              {/* Indicador: Proyectos en Cartera */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Proyectos Cartera
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {indicadoresPrincipales.proyectosEnCartera}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-[#2E5C8A] opacity-70" />
              </div>
              {/* Indicador: MM$ Formulados */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    MM$ Formulados
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {indicadoresPrincipales.montoFormulado}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600 opacity-70" />
              </div>
              {/* Indicador: Escuelas FIN */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Escuelas FIN
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {indicadoresPrincipales.escuelasFIN}
                  </p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-600 opacity-70" />
              </div>
              {/* Indicador: Académicos Involucrados */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Académicos Inv.
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {indicadoresPrincipales.academicosInvolucrados}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600 opacity-70" />
              </div>
              {/* Indicador: Empresas Partners */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Empresas Partners
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {indicadoresPrincipales.empresasPartners}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-blue-400 opacity-70" />
              </div>
              {/* Indicador: Universidades Partners */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Universidades Partners
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {indicadoresPrincipales.universidadesPartners}
                  </p>
                </div>
                <University className="w-8 h-8 text-gray-500 opacity-70" />
              </div>
            </div>{" "}
            {/* Fin del grid de indicadores pequeños */}
            {/* Temáticas Destacadas - Tarjeta Compacta */}
            <div className="bg-white items-center  rounded-xl p-6 text-gray-900 shadow-lg border border-gray-100">
              <h3 className="text-lg text-center font-semibold mb-4">
                Temáticas Destacadas
              </h3>
              <div className="flex flex-col gap-2">
                {tematicasDestacadas.map((tematica, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-center text-sm font-medium"
                  >
                    {tematica}
                  </span>
                ))}
              </div>
            </div>
            {/* Instrumentos Postulados - Tarjeta Compacta */}
            <div className="bg-white rounded-xl p-6 text-gray-900 shadow-lg border border-gray-100">
              <h3 className="text-lg  text-center font-semibold mb-4">
                Instrumentos Postulados (MM$)
              </h3>
              <div className="flex flex-col">
                {instrumentosPostulados.map((instrumento, index) => (
                  <div
                    key={index}
                    className="flex justify-between flex-col mb-2 text-sm"
                  >
                    <p className="text-gray-700">{instrumento.name}</p>
                    <span className="font-semibold text-gray-900">
                      {instrumento.montoFormatted}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>{" "}
          {/* Fin de la COLUMNA 1 */}
          {/* COLUMNA 2: Gráficos de Barras (Profesores por Unidad y Proyectos por Profesor) */}
          <div className="space-y-8">
            {" "}
            {/* Ocupa 1/3 del ancho, y deja espacio entre gráficos */}
            {/* Profesores por Unidad Académica - Gráfico de Barras */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Profesores por Unidad Académica
              </h4>
              <div className="h-80 flex items-center justify-center">
                {filteredProfesoresPorUnidad.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredProfesoresPorUnidad}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="unidad"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="profesores" fill="#2E5C8A" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">
                    No hay datos de profesores para la selección actual.
                  </p>
                )}
              </div>
            </div>
            {/* Proyectos por Profesor - Gráfico de Barras */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Proyectos por Profesor
              </h4>
              <div className="h-80 flex items-center justify-center">
                {filteredProyectosPorProfesor.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredProyectosPorProfesor}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="profesor"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="proyectos" fill="#5D95C8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">
                    No hay datos de proyectos por profesor para la selección
                    actual.
                  </p>
                )}
              </div>
            </div>
            {/* Proyectos por Unidad (Gráfico de Barras - Ahora integrado en la tercera columna) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {" "}
              {/* Sin mb-8 para que el space-y-8 lo controle */}
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Proyectos por Unidad
              </h4>
              <div className="h-80 flex items-center justify-center">
                {filteredProyectosPorUnidad.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredProyectosPorUnidad}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="unidad"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="proyectos" fill="#7CA3CB" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">
                    No hay datos de proyectos por unidad para la selección
                    actual.
                  </p>
                )}
              </div>
            </div>
          </div>{" "}
          {/* Fin de la COLUMNA 2 */}
          {/* COLUMNA 3: Gráficos de Torta (Proyectos por Temática, Proyectos por Convocatoria, y Proyectos por Unidad) */}
          <div className="lg:col-span-1 space-y-8">
            {" "}
            {/* Ocupa 1/3 del ancho, y deja espacio entre gráficos */}
            {/* Proyectos por Temática (Pie Chart) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Proyectos por Temática
              </h4>
              <div className="h-80 flex items-center justify-center">
                {filteredProyectosPorTematica.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={filteredProyectosPorTematica}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {filteredProyectosPorTematica.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={bluePalette[index % bluePalette.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">
                    No hay datos de proyectos por temática para la selección
                    actual.
                  </p>
                )}
              </div>
            </div>
            {/* Proyectos por Convocatoria (Pie Chart) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Proyectos por Convocatoria
              </h4>
              <div className="h-80 flex items-center justify-center">
                {filteredProyectosPorInstitucion.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={filteredProyectosPorInstitucion}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {filteredProyectosPorInstitucion.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={bluePalette[index % bluePalette.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">
                    No hay datos de proyectos por institución para la selección
                    actual.
                  </p>
                )}
              </div>
            </div>
          </div>{" "}
          {/* Fin de la COLUMNA 3 */}
        </div>
      </div>
    </div>
  );
}
