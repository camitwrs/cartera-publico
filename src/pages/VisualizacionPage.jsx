// src/pages/VisualizacionPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Users, // Para el líder del proyecto
  Tag, // Para temáticas (puede ser genérico)
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Calendar, // Para la fecha
  Zap, // Rayo para "Almacenamiento Energía"
  FlaskRound, // Para "Hidrógeno"
  Lightbulb, // Para "Contaminación Lumínica"
  XCircle,
  Info,
  Pickaxe,
  Dna,
  BatteryCharging,
} from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import funcionesService from "../api/funciones.js";
import { useError } from "@/contexts/ErrorContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Importaciones de logos
import anidLogo from "../assets/tipos_convocatorias/anid_rojo_azul.png";
import corfoLogo from "../assets/tipos_convocatorias/corfo2024.png";
import goreLogo from "../assets/tipos_convocatorias/gore-valpo.jpg";
import sqmLogo from "../assets/instituciones/sqm.png";
import codesserLogo from "../assets/instituciones/logo-codesser2.png";

// Mapeo de INSTITUCIONES a sus logos
const INSTITUCION_LOGOS = {
  ANID: anidLogo,
  CORFO: corfoLogo,
  "GORE-Valparaíso": goreLogo, // Asegúrate de que este nombre coincide si viene así en 'institucion'
  SQM: sqmLogo,
  CODESSER: codesserLogo,
};

// Componente ProjectCard
function ProjectCard({ project, academicosDelProyecto }) {
  const renderInstitucionLogo = (nombreInstitucion) => {
    const logoSrc = INSTITUCION_LOGOS[nombreInstitucion];
    if (logoSrc) {
      return (
        <img
          src={logoSrc}
          alt={`${nombreInstitucion} Logo`}
          className="h-5 w-5 object-contain rounded-full border border-gray-200"
        />
      );
    } else if (
      nombreInstitucion === "PRIVADA" ||
      nombreInstitucion === "CODESSER" ||
      nombreInstitucion === "SQM"
    ) {
      return (
        <div className="h-5 w-5 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 text-[0.7rem] font-bold flex-shrink-0">
          {nombreInstitucion === "PRIVADA"
            ? "PRIV"
            : nombreInstitucion.substring(0, 4).toUpperCase()}
        </div>
      );
    }
    return null;
  };

  const getThematicBadge = (tematica) => {
    const baseClasses =
      "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium";
    let icon = <Tag className="h-4 w-4" />;
    let colorClasses = "bg-gray-100 text-gray-700";

    switch (tematica) {
      case "Almacenamiento Energía":
        icon = <Zap className="h-4 w-4" />;
        colorClasses = "bg-teal-100 text-teal-700";
        break;
      case "Hidrógeno":
        icon = <FlaskRound className="h-6 w-6" />;
        colorClasses = "bg-cyan-100 text-cyan-700";
        break;
      case "Contaminación Lumínica":
        icon = <Lightbulb className="h-4 w-4" />;
        colorClasses = "bg-yellow-100 text-yellow-700";
        break;
      case "Minería":
        icon = <Pickaxe className="h-4 w-4" />;
        colorClasses = "bg-orange-100 text-orange-700";
        break;
      case "Biotecnología":
        icon = <Dna className="h-4 w-4" />;
        colorClasses = "bg-purple-100 text-purple-700";
        break;
      case "Litio":
        icon = <BatteryCharging className="h-4 w-4" />;
        colorClasses = "bg-slate-100 text-slate-700";
        break;
      default:
        icon = <Tag className="h-4 w-4" />;
        colorClasses = "bg-gray-100 text-gray-700";
        break;
    }
    return (
      <Badge className={`${baseClasses} ${colorClasses}`}>
        {icon} {tematica}
      </Badge>
    );
  };

  // getStatusBadge: Retorna el Badge de estatus (sin iconos, solo texto)
  const getStatusBadge = (estatus) => {
    // Clases base para el badge de estatus
    const baseClasses =
      "px-2.5 py-1 rounded-full text-s font-medium font-semibold whitespace-nowrap flex-shrink-0";
    let colorClasses = "";

    switch (estatus) {
      case "Postulado":
        colorClasses = "bg-blue-100 text-blue-700 border-blue-200";
        break;
      case "Perfil": // Asegúrate de que el valor del estatus es "Perfilado" y no "Perfil"
        colorClasses = "bg-yellow-100 text-yellow-700 border-yellow-200";
        break;
      case "Adjudicado":
        colorClasses = "bg-green-100 text-green-700 border-green-200";
        break;
      default:
        colorClasses = "bg-gray-100 text-gray-700 border-gray-200";
        break;
    }
    return (
      <Badge className={`${baseClasses} ${colorClasses}`}>
        <span>{estatus}</span>
      </Badge>
    );
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "Fecha Inválida";
      const options = { month: "short", year: "numeric" };
      let formatted = date.toLocaleDateString("es-CL", options);
      formatted = formatted.replace(".", "");
      return formatted;
    } catch (e) {
      console.warn(
        "Invalid date string for ProjectCard (short format):",
        dateString,
        e
      );
      return "Fecha Inválida";
    }
  };

  // Nombres de los académicos para mostrar
  const academicosNames =
    academicosDelProyecto && Array.isArray(academicosDelProyecto.profesores)
      ? academicosDelProyecto.profesores
          .map((p) => p.nombre_completo)
          .join(", ")
      : "N/A";

  return (
    <Card className="relative flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-[#2E5C8A] to-[#3A6FA7] p-4 flex-shrink-0">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white leading-tight pr-4 flex-grow line-clamp-2">
            {project.nombre || "Nombre no disponible"}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {getThematicBadge(project.tematica)}
          {project.institucion && (
            <Badge className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {renderInstitucionLogo(project.institucion)}
              <span>{project.institucion}</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4">
        {/* Líder / Profesores */}
        <div className="flex items-center text-gray-700 text-sm mb-2">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <p>{academicosNames}</p> {/* Muestra los nombres de los académicos */}
        </div>
        {/* Fecha de Postulación */}
        <div className="flex items-center text-gray-700 text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <p>{formatDateShort(project.fecha_postulacion)}</p>
        </div>
        {/* Badge en esquina inferior derecha */}
        <div className="absolute bottom-4 right-4">
          {getStatusBadge(project.estatus)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VisualizacionPage() {
  const [orden, setOrden] = useState("reciente");
  const [projectsData, setProjectsData] = useState([]); // Todos los proyectos sin filtrar
  const [selectedStatus, setSelectedStatus] = useState("todos"); // 'todos', 'Postulado', 'Adjudicado', 'Perfilado'
  const [academicosMap, setAcademicosMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorLocal, setErrorLocal] = useState(null);
  const { setError: setErrorGlobal } = useError();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitucion, setSelectedInstitucion] = useState("todos");
  const [selectedConvocatoria, setSelectedConvocatoria] = useState("todos");
  const [selectedTematica, setSelectedTematica] = useState("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchData = async () => {
    setLoading(true);
    setErrorLocal(null);
    setErrorGlobal(null);

    try {
      const [projectsResponse, academicosResponse] = await Promise.all([
        funcionesService.getDataInterseccionProyectos(),
        funcionesService.getAcademicosPorProyecto(),
      ]);

      const projects = Array.isArray(projectsResponse) ? projectsResponse : [];
      const academicosPorProyecto = Array.isArray(academicosResponse)
        ? academicosResponse
        : [];

      const newAcademicosMap = academicosPorProyecto.reduce((map, item) => {
        map[item.id_proyecto] = item;
        return map;
      }, {});
      setAcademicosMap(newAcademicosMap);

      setProjectsData(projects);

      console.log("Proyectos obtenidos:", projects);
      console.log("Mapa de Académicos por Proyecto:", newAcademicosMap);
    } catch (err) {
      console.error("Error fetching data for VisualizacionPage:", err);
      setErrorLocal(
        err.message || "Error desconocido al cargar los proyectos."
      );
      setErrorGlobal(err.message || "Error al cargar los proyectos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Opciones únicas para los Selects (calculadas a partir de projectsData)
  const uniqueConvocatorias = [
    ...new Set(projectsData.map((p) => p.nombre_convo)),
  ]
    .filter(Boolean)
    .sort();
  const uniqueTematicas = [...new Set(projectsData.map((p) => p.tematica))]
    .filter(Boolean)
    .sort();
  const uniqueInstituciones = [
    ...new Set(projectsData.map((p) => p.institucion)),
  ]
    .filter(Boolean)
    .sort();

  // Lógica para filtrar proyectos según el estatus seleccionado
  const filteredProjects = projectsData.filter((project) => {
    // Filtrar por estatus
    const matchesStatus =
      selectedStatus === "todos" || project.estatus === selectedStatus;

    // Filtro por término de búsqueda (en el nombre del proyecto)
    const matchesSearch =
      searchTerm === "" || // Si el searchTerm está vacío, no filtra por búsqueda
      project.nombre.toLowerCase().startsWith(searchTerm.toLowerCase());

    // Nuevo filtro por convocatoria
    const matchesConvocatoria =
      selectedConvocatoria === "todos" ||
      project.nombre_convo === selectedConvocatoria;

    // Nuevo filtro por temática
    const matchesTematica =
      selectedTematica === "todos" || project.tematica === selectedTematica;

    // Nuevo filtro por institución
    const matchesInstitucion =
      selectedInstitucion === "todos" ||
      project.institucion === selectedInstitucion;

    return (
      matchesStatus &&
      matchesSearch &&
      matchesConvocatoria &&
      matchesTematica &&
      matchesInstitucion
    );
  });

  // Lógica de ordenamiento
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const hasDateA =
      a.fecha_postulacion && !isNaN(new Date(a.fecha_postulacion));
    const hasDateB =
      b.fecha_postulacion && !isNaN(new Date(b.fecha_postulacion));
    if (!hasDateA && !hasDateB) return 0; // Ambos sin fecha, mantener orden relativo
    if (!hasDateA) return orden === "reciente" ? 1 : -1; // A sin fecha, va al final en reciente, al principio en antiguo
    if (!hasDateB) return orden === "reciente" ? -1 : 1; // B sin fecha, va al final en reciente, al principio en antiguo
    const dateA = new Date(a.fecha_postulacion);
    dateA.setUTCHours(0, 0, 0, 0); // Forzar a medianoche UTC
    const dateB = new Date(b.fecha_postulacion);
    dateB.setUTCHours(0, 0, 0, 0); // Forzar a me

    if (orden === "reciente") {
      return dateB.getTime() - dateA.getTime();
    } else {
      // "antiguo"
      return dateA.getTime() - dateB.getTime();
    }
  });

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  // Asegurarse de que la página actual no exceda el total de páginas (ej. si se filtra y el total disminuye)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1); // Volver a la primera página si no hay resultados
    }
  }, [currentPage, totalPages]);

  // Calcular los proyectos de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, endIndex);

  // Función para cambiar de página
  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visualización de Proyectos
          </h1>
          <p className="text-gray-600">
            Explora y gestiona todos tus proyectos de tu organización
          </p>
        </div>

        {/* Filters and Search (sin cambios) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[220px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Buscar proyectos..."
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select
                value={selectedConvocatoria}
                onValueChange={setSelectedConvocatoria}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Todas las convocatorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las convocatorias</SelectItem>
                  {uniqueConvocatorias.map((conv) => (
                    <SelectItem key={conv} value={conv}>
                      {conv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={selectedInstitucion}
                onValueChange={setSelectedInstitucion}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Todas las instituciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las instituciones</SelectItem>
                  {uniqueInstituciones.map((institucion) => (
                    <SelectItem key={institucion} value={institucion}>
                      {institucion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={selectedTematica}
                onValueChange={setSelectedTematica}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Todas las temáticas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las temáticas</SelectItem>
                  {uniqueTematicas.map((tem) => (
                    <SelectItem key={tem} value={tem}>
                      {tem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={orden} onValueChange={setOrden}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reciente">
                    <span className="flex items-center gap-2">
                      <ArrowDownWideNarrow className="w-4 h-4" />
                      Más reciente - Descendente
                    </span>
                  </SelectItem>
                  <SelectItem value="antiguo">
                    <span className="flex items-center gap-2">
                      <ArrowUpWideNarrow className="w-4 h-4" />
                      Más antiguo - Ascendente
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs - Ahora manejan el estado de filtro */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="mb-6"
        >
          <TabsList className="bg-white border border-gray-100">
            <TabsTrigger
              value="todos"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Todos ({projectsData.length})
            </TabsTrigger>
            <TabsTrigger
              value="Postulado"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Postulados (
              {projectsData.filter((p) => p.estatus === "Postulado").length})
            </TabsTrigger>
            <TabsTrigger
              value="Adjudicado"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Adjudicados (
              {projectsData.filter((p) => p.estatus === "Adjudicado").length})
            </TabsTrigger>
            <TabsTrigger
              value="Perfil"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Perfil (
              {projectsData.filter((p) => p.estatus === "Perfil").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Projects Grid (Renderizado Condicional) */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size={64} className="text-[#2E5C8A]" />
          </div>
        ) : errorLocal ? (
          <Alert variant="destructive" className="bg-red-50 text-red-700">
            <XCircle className="h-5 w-5" />
            <AlertTitle>Error al cargar proyectos</AlertTitle>
            <AlertDescription>{errorLocal}</AlertDescription>
          </Alert>
        ) : sortedProjects.length === 0 ? (
          <Alert variant="default" className="bg-blue-50 text-blue-700">
            <Info className="h-5 w-5" />
            <AlertTitle>No hay proyectos</AlertTitle>
            <AlertDescription>
              No se encontraron proyectos para mostrar con el filtro actual.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id_proyecto}
                project={project}
                academicosDelProyecto={academicosMap[project.id_proyecto]}
              />
            ))}
          </div>
        )}

        {/* Pagination (sin cambios) */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-sm text-gray-500">
            Mostrando{" "} 
            {Math.min(sortedProjects.length, endIndex)} de{" "}
            {sortedProjects.length} proyectos
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || sortedProjects.length === 0}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(i + 1)}
                className={
                  currentPage === i + 1
                    ? "bg-[#2E5C8A] text-white hover:bg-[#1E4A6F]"
                    : ""
                }
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages || sortedProjects.length === 0
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
