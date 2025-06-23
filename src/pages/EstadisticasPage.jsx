import { useState, useEffect } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function EstadisticasPage() {
  // --- Datos Simulados (Alineados con la posible estructura de la API) ---
  const indicadoresPrincipales = {
    proyectosEnCartera: 47,
    montoFormulado: 21.633, // MM$
    escuelasFIN: 7,
    academicosInvolucrados: 21,
    empresasPartners: 12,
    universidadesPartners: 5,
  };

  const tematicas = [
    "Hidrógeno Verde",
    "Digital Twins",
    "Mujeres en STEM",
    "Realidad Virtual",
    "Entre otros",
  ];

  const instrumentosPostulados = [
    {
      nombre: "Centros Tecnológicos Innovación, CORFO",
      monto: 8.737,
    },
    {
      nombre: "Anillos Tecnológicos, ANID",
      monto: 660,
    },
    {
      nombre: "Centros Tecnológicos Innovación, ANID",
      monto: 10.628,
    },
    {
      nombre: "Fondo Regional Productividad y Desarrollo, GORE V",
      monto: 776,
    },
  ];

  const allProfesoresPorUnidad = [
    { unidad: "Ing. Informática", profesores: 15 },
    { unidad: "Ing. Industrial", profesores: 12 },
    { unidad: "Ing. Civil", profesores: 10 },
    { unidad: "Ing. Química", profesores: 8 },
    { unidad: "Ing. Eléctrica", profesores: 7 },
    { unidad: "Ing. Mecánica", profesores: 6 },
    { unidad: "Arquitectura", profesores: 5 },
    { unidad: "Matemáticas", profesores: 4 },
    { unidad: "Física", profesores: 3 },
  ];

  const allProyectosPorProfesor = [
    { profesor: "Dr. García", proyectos: 8 },
    { profesor: "Dra. López", proyectos: 6 },
    { profesor: "Dr. Martínez", proyectos: 5 },
    { profesor: "Dra. Rodríguez", proyectos: 4 },
    { profesor: "Dr. González", proyectos: 4 },
    { profesor: "Dra. Hernández", proyectos: 3 },
  ];

  const allProyectosData = [
    { id: 1, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 2, tematica: "Hidrógeno", institucion: "CORFO" },
    { id: 3, tematica: "Contaminación Lumínica", institucion: "CONICYT" },
    { id: 4, tematica: "Digital Twins", institucion: "GORE" },
    { id: 5, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 6, tematica: "Hidrógeno", institucion: "ANID" },
    { id: 7, tematica: "Almacenamiento Energía", institucion: "CORFO" },
    { id: 8, tematica: "Otros", institucion: "CONICYT" },
    { id: 9, tematica: "Hidrógeno", institucion: "GORE" },
    { id: 10, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 11, tematica: "Contaminación Lumínica", institucion: "ANID" },
    { id: 12, tematica: "Digital Twins", institucion: "CORFO" },
    { id: 13, tematica: "Hidrógeno", institucion: "CONICYT" },
    { id: 14, tematica: "Almacenamiento Energía", institucion: "GORE" },
    { id: 15, tematica: "Otros", institucion: "ANID" },
    { id: 16, tematica: "Contaminación Lumínica", institucion: "ANID" },
    { id: 17, tematica: "Digital Twins", institucion: "CORFO" },
    { id: 18, tematica: "Hidrógeno", institucion: "CONICYT" },
    { id: 19, tematica: "Almacenamiento Energía", institucion: "GORE" },
    { id: 20, tematica: "Otros", institucion: "ANID" },
    { id: 21, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 22, tematica: "Hidrógeno", institucion: "CORFO" },
    { id: 23, tematica: "Contaminación Lumínica", institucion: "CONICYT" },
    { id: 24, tematica: "Digital Twins", institucion: "GORE" },
    { id: 25, tematica: "Otros", institucion: "ANID" },
    { id: 26, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 27, tematica: "Hidrógeno", institucion: "CORFO" },
    { id: 28, tematica: "Contaminación Lumínica", institucion: "CONICYT" },
    { id: 29, tematica: "Digital Twins", institucion: "GORE" },
    { id: 30, tematica: "Otros", institucion: "ANID" },
    { id: 31, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 32, tematica: "Hidrógeno", institucion: "CORFO" },
    { id: 33, tematica: "Contaminación Lumínica", institucion: "CONICYT" },
    { id: 34, tematica: "Digital Twins", institucion: "GORE" },
    { id: 35, tematica: "Otros", institucion: "ANID" },
    { id: 36, tematica: "Almacenamiento Energía", institucion: "ANID" },
    { id: 37, tematica: "Hidrógeno", institucion: "CORFO" },
    { id: 38, tematica: "Contaminación Lumínica", institucion: "CONICYT" },
    { id: 39, tematica: "Digital Twins", institucion: "GORE" },
    { id: 40, tematica: "Otros", institucion: "ANID" },
    { id: 41, tematica: "Contaminación Lumínica", institucion: "GORE" },
    { id: 42, tematica: "Contaminación Lumínica", institucion: "GORE" },
    { id: 43, tematica: "Hidrógeno", institucion: "GORE" },
    { id: 44, tematica: "Hidrógeno", institucion: "GORE" },
  ];

  // Función auxiliar para agrupar y contar datos para Pie Charts
  const groupAndCount = (data, key) => {
    const counts = {};
    data.forEach((item) => {
      counts[item[key]] = (counts[item[key]] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const allProyectosPorTematica = groupAndCount(allProyectosData, "tematica");
  const allProyectosPorInstitucion = groupAndCount(
    allProyectosData,
    "institucion"
  );

  const allProyectosPorUnidad = [
    { unidad: "Ing. Informática", proyectos: 12 },
    { unidad: "Ing. Industrial", proyectos: 15 },
    { unidad: "Ing. Civil", proyectos: 8 },
    { unidad: "Ing. Química", proyectos: 7 },
    { unidad: "Ing. Eléctrica", proyectos: 5 },
  ];

  // Listas de opciones para los filtros
  const opcionesEscuela = [
    "Todas las Escuelas",
    ...allProfesoresPorUnidad.map((d) => d.unidad),
  ];
  const opcionesTematica = [
    "Todas las Temáticas",
    ...Array.from(new Set(allProyectosData.map((p) => p.tematica))),
  ];
  const opcionesInstitucion = [
    "Todas las Instituciones",
    ...Array.from(new Set(allProyectosData.map((p) => p.institucion))),
  ];

  // --- Estados para los filtros ---
  const [selectedEscuela, setSelectedEscuela] = useState("Todas las Escuelas");
  const [selectedTematica, setSelectedTematica] = useState(
    "Todas las Temáticas"
  );
  const [selectedInstitucion, setSelectedInstitucion] = useState(
    "Todas las Instituciones"
  );
  // Estado para el collapsible de indicadores (inicialmente abierto)
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(true);

  // --- Estados para los datos filtrados de los gráficos ---
  const [filteredProfesoresPorUnidad, setFilteredProfesoresPorUnidad] =
    useState(allProfesoresPorUnidad);
  const [filteredProyectosPorProfesor, setFilteredProyectosPorProfesor] =
    useState(allProyectosPorProfesor);
  const [filteredProyectosPorTematica, setFilteredProyectosPorTematica] =
    useState(allProyectosPorTematica);
  const [filteredProyectosPorInstitucion, setFilteredProyectosPorInstitucion] =
    useState(allProyectosPorInstitucion);
  const [filteredProyectosPorUnidad, setFilteredProyectosPorUnidad] = useState(
    allProyectosPorUnidad
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

  // --- Lógica de filtrado ---
  useEffect(() => {
    // Simular filtrado para Profesores por Unidad y Proyectos por Unidad
    if (selectedEscuela === "Todas las Escuelas") {
      setFilteredProfesoresPorUnidad(allProfesoresPorUnidad);
      setFilteredProyectosPorUnidad(allProyectosPorUnidad);
    } else {
      setFilteredProfesoresPorUnidad(
        allProfesoresPorUnidad.filter((item) => item.unidad === selectedEscuela)
      );
      setFilteredProyectosPorUnidad(
        allProyectosPorUnidad.filter((item) => item.unidad === selectedEscuela)
      );
    }

    // Simular filtrado para Proyectos por Profesor
    if (selectedEscuela === "Todas las Escuelas") {
      setFilteredProyectosPorProfesor(allProyectosPorProfesor);
    } else if (selectedEscuela === "Ing. Informática") {
      setFilteredProyectosPorProfesor([
        { profesor: "Dr. García", proyectos: 5 },
        { profesor: "Dra. López", proyectos: 3 },
      ]);
    } else if (selectedEscuela === "Ing. Civil") {
      setFilteredProyectosPorProfesor([
        { profesor: "Dr. Martínez", proyectos: 4 },
        { profesor: "Dra. Rodríguez", proyectos: 2 },
      ]);
    } else {
      setFilteredProyectosPorProfesor(
        allProyectosPorProfesor.slice(0, 3).map((p) => ({
          ...p,
          proyectos: Math.max(1, p.proyectos - 2),
        }))
      ); // Simular menos proyectos
    }

    // Filtrar proyectos base para temáticas e instituciones
    let proyectosFiltradosBase = allProyectosData;

    // Aplicar filtro de temática si no es "Todas las Temáticas"
    if (selectedTematica !== "Todas las Temáticas") {
      proyectosFiltradosBase = proyectosFiltradosBase.filter(
        (p) => p.tematica === selectedTematica
      );
    }

    // Aplicar filtro de institución si no es "Todas las Instituciones"
    if (selectedInstitucion !== "Todas las Instituciones") {
      proyectosFiltradosBase = proyectosFiltradosBase.filter(
        (p) => p.institucion === selectedInstitucion
      );
    }

    setFilteredProyectosPorTematica(
      groupAndCount(proyectosFiltradosBase, "tematica")
    );
    setFilteredProyectosPorInstitucion(
      groupAndCount(proyectosFiltradosBase, "institucion")
    );
  }, [selectedEscuela, selectedTematica, selectedInstitucion]);

  // Componente de etiqueta personalizada para PieChart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
    name,
    value,
  }) => {
    // Calcular la posición de la etiqueta
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Determinar la alineación del texto
    const textAnchor = x > cx ? "start" : "end";

    return (
      <Text
        x={x}
        y={y}
        fill="#000" // Color del texto
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${name}: ${value}`}
      </Text>
    );
  };

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

        {/* Sección Contráible para Indicadores y Resúmenes */}
        <Collapsible
          open={isIndicatorsOpen}
          onOpenChange={setIsIndicatorsOpen}
          className="w-full space-y-4"
        >
          <div className="flex items-center justify-between space-x-4 px-4 py-2 bg-gray-100 rounded-lg shadow-sm">
            {/* MODIFICACIÓN AQUÍ para el texto y el icono de la izquierda */}
            <h3 className="flex items-center text-md text-gray-800">
              {isIndicatorsOpen ? (
                <ArrowUpToLine className="h-5 w-5 mr-2 text-gray-700" />
              ) : (
                <ArrowDownToLine className="h-5 w-5 mr-2 text-gray-700" />
              )}
              {isIndicatorsOpen
                ? "Contraer Indicadores"
                : "Expandir Indicadores"}
            </h3>
            {/* El Chevron a la derecha permanece igual */}
            <CollapsibleTrigger asChild>
              <button className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200">
                {isIndicatorsOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle summary section</span>
              </button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            {/* Contenido original de los indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-[#5c8ebf] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <FileText className="h-8 w-8 opacity-80" />
                  <span className="text-4xl font-bold">
                    {indicadoresPrincipales.proyectosEnCartera}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-2">
                  PROYECTOS EN CARTERA
                </h3>
                <div className="flex flex-wrap justify-around gap-2">
                  <span className="bg-[#2E5C8A] px-4 py-0.5 rounded-full text-s">
                    Postulados
                  </span>
                  <span className="bg-[#2E5C8A] px-4 py-0.5 rounded-full text-s">
                    Perfilados
                  </span>
                </div>
              </div>
              <div className="bg-[#5c8ebf] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                  <span className="text-4xl font-bold">
                    {indicadoresPrincipales.montoFormulado}
                  </span>
                </div>
                <h3 className="text-base font-bold">
                  MM$ EN PROYECTOS FORMULADOS
                </h3>
                <div className="h-[22px]"></div>
              </div>
              <div className="bg-[#5c8ebf] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <GraduationCap className="h-7 w-7 opacity-80" />
                    <span className="text-3xl font-bold">
                      {indicadoresPrincipales.escuelasFIN}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold -mt-2">
                    ESCUELAS DE LA FIN
                  </h3>
                  <div className="border-t border-white pt-4 mt-4">
                    <div className="flex items-start justify-between">
                      <Users className="h-7 w-7 opacity-80" />
                      <span className="text-3xl font-bold">
                        {indicadoresPrincipales.academicosInvolucrados}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold -mt-2">
                      ACADÉMICOS INVOLUCRADOS
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#5c8ebf] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <Building2 className="h-8 w-8 opacity-80" />
                  <span className="text-4xl font-bold">
                    {indicadoresPrincipales.empresasPartners}
                  </span>
                </div>
                <h3 className="text-base font-bold">EMPRESAS PARTNERS</h3>
                <div className="h-[22px]"></div>
              </div>
              <div className="bg-[#5c8ebf] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <University className="h-8 w-8 opacity-80" />
                  <span className="text-4xl font-bold">
                    {indicadoresPrincipales.universidadesPartners}
                  </span>
                </div>
                <h3 className="text-base font-bold">UNIVERSIDADES PARTNERS</h3>
                <div className="h-[22px]"></div>
              </div>
            </div>

            {/* Temáticas */}
            {/* Antes estaba fuera del collapsible, ahora va dentro */}
            <div className="bg-[#5c8ebf] rounded-xl p-6 text-white shadow-lg flex flex-col items-center min-h-[220px] mb-6">
              <h3 className="text-2xl font-bold mb-6 text-center">TEMÁTICAS</h3>
              <div className="grid grid-cols-3 gap-4 w-full mb-4">
                {tematicas.slice(0, 3).map((tematica, index) => (
                  <div
                    key={index}
                    className="bg-[#2E5C8A] px-4 py-6 rounded-md text-lg text-center flex items-center justify-center"
                  >
                    {tematica}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 w-2/3">
                {tematicas.slice(3, 5).map((tematica, index) => (
                  <div
                    key={index + 3}
                    className="bg-[#2E5C8A] px-4 py-6 rounded-md text-lg text-center flex items-center justify-center"
                  >
                    {tematica}
                  </div>
                ))}
              </div>
            </div>

            {/* Instrumentos Postulados */}
            {/* Antes estaba fuera del collapsible, ahora va dentro */}
            <div className="bg-[#5c8ebf] rounded-xl p-8 text-white shadow-lg mb-6">
              <h3 className="text-2xl font-bold text-center mb-8">
                INSTRUMENTOS A LOS QUE SE HA POSTULADO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {instrumentosPostulados.map((instrumento, index) => (
                  <div
                    key={index}
                    className="bg-[#2E5C8A] items-center  flex flex-col rounded-xl p-6"
                  >
                    <h4 className="font-semibold text-lg mb-2">
                      {instrumento.nombre}
                    </h4>
                    <p className="text-2xl font-bold">
                      ({instrumento.monto} MM$)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Sección de Distribución por Áreas con filtros (sin cambios aquí) */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Distribución por Áreas
            {selectedEscuela !== "Todas las Escuelas" &&
              ` - ${selectedEscuela}`}
            {selectedTematica !== "Todas las Temáticas" &&
              ` - ${selectedTematica}`}
            {selectedInstitucion !== "Todas las Instituciones" &&
              ` - ${selectedInstitucion}`}
          </h2>
          <p className="text-gray-600 mt-2">
            Descubre cómo se distribuyen los proyectos y recursos en las
            distintas áreas, filtrando por los criterios deseados.
          </p>
        </div>

        {/* Controles de Filtrado (sin cambios aquí) */}
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

        {/* Gráficos Dinámicos (sin cambios aquí) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profesores por Unidad Académica */}
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

          {/* Proyectos por Profesor */}
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

          {/* Proyectos por Temática */}
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

          {/* Proyectos por Institución */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Proyectos por Institución
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
        </div>

        {/* Proyectos por Unidad */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                No hay datos de proyectos por unidad para la selección actual.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
