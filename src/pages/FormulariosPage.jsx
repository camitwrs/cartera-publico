import { useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Home,
  PieChart,
  School,
  User,
  Users,
} from "lucide-react";

export default function FormulariosPage() {
  // Datos exactos de la imagen
  const respuestas = [
    {
      id: 1,
      nombre: "SEBASTIÁN CARLOS",
      escuela: "Escuela de Ingeniería Bioquímica",
      fecha: "14 de junio de 2025",
      esHoy: false,
      seleccionado: true,
    },
    {
      id: 2,
      nombre: "A",
      escuela: "CREAS",
      fecha: "22 de junio de 2025",
      esHoy: true,
      seleccionado: false,
    },
    {
      id: 3,
      nombre: "Camila",
      escuela: "Escuela de Ingeniería Industrial",
      fecha: "22 de junio de 2025",
      esHoy: true,
      seleccionado: false,
    },
    {
      id: 4,
      nombre: "Juan",
      escuela: "Escuela de Ingeniería",
      fecha: "22 de junio de 2025",
      esHoy: true,
      seleccionado: false,
    },
  ];

  const preguntas = [
    {
      numero: 1,
      texto:
        "¿Qué es la tecnología o resultado de investigación en la que se basa su proyecto?",
      respuesta: "Sin respuesta",
    },
    {
      numero: 2,
      texto: "¿Qué problema o necesidad resuelve?",
      respuesta: "Sin respuesta",
    },
    {
      numero: 3,
      texto:
        "¿Quién tiene ese problema o necesidad? ¿Ha tenido acercamientos con él/a o ellos/as?",
      respuesta: "Sin respuesta",
    },
    {
      numero: 4,
      texto: "¿Por qué es importante resolver ese problema o necesidad?",
      respuesta: "Sin respuesta",
    },
  ];

  // Obtener listas únicas para los selects
  const academicos = [...new Set(respuestas.map((r) => r.nombre))];
  const escuelas = [...new Set(respuestas.map((r) => r.escuela))];

  // Estados de filtro
  const [filtroAcademico, setFiltroAcademico] = useState("");
  const [filtroEscuela, setFiltroEscuela] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [respuestaSeleccionadaId, setRespuestaSeleccionadaId] = useState(
    respuestas[0].id
  );

  // Filtrar respuestas según los filtros seleccionados
  const respuestasFiltradas = respuestas.filter((r) => {
    const coincideAcademico = !filtroAcademico || r.nombre === filtroAcademico;
    const coincideEscuela = !filtroEscuela || r.escuela === filtroEscuela;
    const coincideFecha = !filtroFecha || r.fecha === filtroFecha;
    return coincideAcademico && coincideEscuela && coincideFecha;
  });

  // Si la respuesta seleccionada no está en las filtradas, selecciona la primera
  const respuestaSeleccionada =
    respuestasFiltradas.find((r) => r.id === respuestaSeleccionadaId) ||
    respuestasFiltradas[0];

  // Si la respuesta seleccionada cambió por el filtro, actualiza el id
  // (esto evita que quede seleccionada una respuesta que ya no está visible)
  if (
    respuestaSeleccionada &&
    respuestaSeleccionada.id !== respuestaSeleccionadaId
  ) {
    setTimeout(() => setRespuestaSeleccionadaId(respuestaSeleccionada.id), 0);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Formularios</h2>
          <p className="text-gray-600 mt-2">
            Revisa las respuestas de los formularios
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Filtrar por:</span>
              </div>

              {/* Filtro Académico */}
              <div className="relative">
                <select
                  className="px-2 w-50 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
                  value={filtroAcademico}
                  onChange={(e) => setFiltroAcademico(e.target.value)}
                >
                  <option value="">Todos los académicos</option>
                  {academicos.map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filtro Escuela */}
              <div className="relative">
                <select
                  className="px-2 w-72 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
                  value={filtroEscuela}
                  onChange={(e) => setFiltroEscuela(e.target.value)}
                >
                  <option value="">Todas las escuelas</option>
                  {escuelas.map((escuela) => (
                    <option key={escuela} value={escuela}>
                      {escuela}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filtro Fecha */}
              <div className="relative">
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setFiltroAcademico("");
                  setFiltroEscuela("");
                  setFiltroFecha("");
                }}
              >
                Limpiar filtros
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Generar PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de respuestas */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Lista de respuestas
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {respuestas.map((respuesta) => (
                <div
                  key={respuesta.id}
                  onClick={() => setRespuestaSeleccionadaId(respuesta.id)}
                  className={`p-6 cursor-pointer transition-colors ${
                    respuestaSeleccionadaId === respuesta.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {respuesta.nombre}
                        </h4>
                        {respuesta.esHoy && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            Hoy
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <School className="h-4 w-4" />
                          <span>Escuela: {respuesta.escuela}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{respuesta.fecha}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalles de la respuesta */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles de la Respuesta
                </h3>
              </div>
            </div>

            {respuestaSeleccionada && (
              <div className="p-6">
                {/* Información del investigador */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Investigador:
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {respuestaSeleccionada.nombre}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <School className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Escuela:
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {respuestaSeleccionada.escuela}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Fecha:
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {respuestaSeleccionada.fecha}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Respuestas del cuestionario */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Respuestas del Cuestionario
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {preguntas.map((pregunta) => (
                      <div
                        key={pregunta.numero}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="mb-3">
                          <h5 className="font-semibold text-gray-900 mb-2">
                            Pregunta {pregunta.numero}
                          </h5>
                          <p className="text-gray-700 italic">
                            {pregunta.texto}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-500 italic">
                            {pregunta.respuesta}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
