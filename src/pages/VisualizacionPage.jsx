import { useState } from "react"; // Todavía necesitamos useState para otros fines
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter, // CardFooter ya no se usará, pero lo mantengo en el import por si lo usas en otro lado
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  FileDown,
  Clock, // Mantengo Clock si lo usas para otra cosa
  DollarSign,
  Users,
  Tag,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Calendar, // Necesitaremos Calendar para "Fecha de registro"
} from "lucide-react";

// Datos de ejemplo para los proyectos (sin lastUpdate, ya que no estaba en tu referencia de card expandida)
const projects = [
  {
    id: 1,
    title: "Base Circular: Agregados Sustentables para la Región de Valparaíso",
    status: "Postulado",
    theme: "Economía Circular",
    academicUnit: "Escuela de Ingeniería Civil",
    leader: "ÁLVARO DÍAZ",
    amount: "$246.000.000",
    supportType: "Total (Total)",
    applicationDate: "17 de mayo de 2025",
    call: "FRPD GORE Valparaíso",
    comments: "Proyecto con apoyo total en la formulación",
  },
  {
    id: 2,
    title:
      "Fortalecimiento de capacidades para la economía circular en plásticos en la red internacional TechTraPlastiCE",
    status: "Postulado",
    theme: "Economía Circular",
    academicUnit: "Escuela de Ingeniería Química",
    leader: "CARLOS JAVIER CARLESI",
    amount: "$30.000.000",
    supportType: "Parcial (Formulación y Postulación)",
    applicationDate: "30 de abril de 2025",
    call: "FOVI",
    comments: "Proyecto postulado apoyado por Ivania",
  },
  {
    id: 3,
    title: "Centro Interdisciplinario Regional",
    status: "Postulado",
    theme: "Interdisciplina",
    academicUnit: "Facultad de Ingeniería",
    leader: "SEBASTIÁN CARLOS FINGERHUTH",
    amount: "$259.000.000",
    supportType: "Total (Total)",
    applicationDate: "24 de abril de 2025",
    call: "FRPD GORE Valparaíso",
    comments:
      "Se han tenido conversaciones con Gianni, Lorena Jorquera e Iván Díaz (se estaría postulando en 2025)",
  },
  {
    id: 4,
    title: "Diplomado Evaluación Ambiental de Proyectos de Hidrógeno Verde",
    status: "Postulado",
    theme: "Hidrógeno",
    academicUnit: "Facultad de Ingeniería",
    leader: "SEBASTIÁN CARLOS FINGERHUTH",
    amount: "No especificado",
    supportType: "Total (Total)",
    applicationDate: "6 de abril de 2025",
    call: "Programa de Formación para la competitividad",
    comments: "-",
  },
];

// Componente para la tarjeta de proyecto - MODIFICADO
function ProjectCard({ project }) {
  // Ya no necesitamos 'expanded' aquí
  // const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="bg-gradient-to-r from-[#2E5C8A] to-[#3A6FA7] p-4 min-h-[96px] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white  pr-4 flex-grow">
          {project.title}
        </h3>
        <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200 whitespace-nowrap self-start">
          {project.status}
        </Badge>
      </CardHeader>
      {/* Información esencial siempre visible (Contenido Central) - MODIFICADO */}
      {/* Ahora todo va aquí y se distribuye en un grid */}
      <CardContent className="p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
          {/* Líder y Unidad Académica */}
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 ">
                {project.leader}
              </p>
              <p className="text-xs text-gray-500 ">{project.academicUnit}</p>
            </div>
          </div>

          {/* Monto y Tipo de Apoyo */}
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 ">
                {project.amount}
              </p>
              <p className="text-xs text-gray-500 ">{project.supportType}</p>
            </div>
          </div>

          {/* Fecha de Registro (anteriormente "Fecha de postulación") */}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <p className="text-sm text-gray-900 ">{project.applicationDate}</p>
          </div>

          {/* Convocatoria */}
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-500 mr-2 shrink-0" />{" "}
            {/* O un icono de documento/bandera */}
            <p className="text-sm text-gray-900 ">{project.call}</p>
          </div>

          {/* Temática (mantengo en una fila separada o al final si es necesario) */}
          <div className="flex items-center md:col-span-2">
            {" "}
            {/* Ocupa todo el ancho en md */}
            <Tag className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <p className="text-sm text-gray-900 ">{project.theme}</p>
          </div>
        </div>
        {/* Los comentarios ya no se muestran por defecto para mantener la tarjeta compacta */}
        {/* Si los quieres, deberías decidir dónde ubicarlos o si es un tooltip al hover */}
      </CardContent>
      {/* Eliminado CardFooter, ya no hay botón de expandir */}
    </Card>
  );
}

export default function VisualizacionPage() {
  const [orden, setOrden] = useState("reciente"); // "reciente" o "antiguo"

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visualización de Proyectos
          </h1>
          <p className="text-gray-600">
            Explora y gestiona todos los proyectos de tu organización
          </p>
        </div>

        {/* Filters and Search */}
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
                />
              </div>
            </div>
            <div>
              <Select defaultValue="convocatorias">
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Convocatorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="convocatorias">
                    Todas las convocatorias
                  </SelectItem>
                  <SelectItem value="frpd">FRPD GORE Valparaíso</SelectItem>
                  <SelectItem value="fovi">FOVI</SelectItem>
                  <SelectItem value="programa">
                    Programa de Formación
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="tematicas">
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Temáticas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tematicas">Todas las temáticas</SelectItem>
                  <SelectItem value="economia">Economía Circular</SelectItem>
                  <SelectItem value="interdisciplina">
                    Interdisciplina
                  </SelectItem>
                  <SelectItem value="hidrogeno">Hidrógeno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={orden} onValueChange={setOrden}>
                <SelectTrigger className="bg-gray-50  border-gray-200">
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

        {/* Botones de exportar */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="secondary"
            className="bg-red-600 text-md text-white hover:bg-red-500 cursor-pointer"
            onClick={() => exportarPDF(projects)}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button
            variant="secondary"
            className="bg-green-600 text-md text-white hover:bg-green-500 cursor-pointer"
            onClick={() => exportarExcel(projects)}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todos" className="mb-6">
          <TabsList className="bg-white border border-gray-100">
            <TabsTrigger
              value="todos"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Todos (12)
            </TabsTrigger>
            <TabsTrigger
              value="postulados"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Postulados (4)
            </TabsTrigger>
            <TabsTrigger
              value="adjudicados"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Adjudicados (3)
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
            >
              Perfil (5)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-sm text-gray-500">
            Mostrando 4 de 12 proyectos
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#2E5C8A] text-white hover:bg-[#1E4A6F]"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
