// src/pages/FondosConcursablesPage.jsx

import React from "react"; // Siempre importante para componentes React
import {
  // Asegúrate de importar solo lo que realmente usas
  Search,
  ChevronDown, // Usaremos ChevronDown para el selector, pero no en AccordionTrigger
  Target,
  ClipboardList,
  Calendar,
} from "lucide-react";

// Importa los componentes de Accordion de Shadcn UI
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FondosPage() {
  // Datos simulados (fondos)
  const fondos = [
    {
      id: 1,
      nombre: "Concurso IDeA I+D 2026",
      institucion: "ANID",
      trl: "TRL 2",
      monto: "227 millones",
      duracion: "24 meses",
      estado: "Finalizado",
      objetivo:
        "Apoya el cofinanciamiento de proyectos de I+D aplicada con un fuerte componente científico, para que desarrollen tecnologías que puedan convertirse en nuevos productos, procesos o servicios, con una razonable probabilidad de generación de impactos productivos, económicos y sociales.",
      requisitos: ["No hay requisitos detallados disponibles."],
      fechaInicio: "29 de junio de 2025",
      fechaCierre: "30 de agosto de 2025",
    },
    {
      id: 2,
      nombre: "Concurso de Investigación Tecnológica IDeA 2026",
      institucion: "ANID",
      trl: "TRL 4",
      monto: "237 millones",
      duracion: "24 meses",
      estado: "Finalizado",
      objetivo:
        "Apoyar el financiamiento de proyectos de investigación y desarrollo, con antecedentes que sustenten una hipótesis de aplicación de una tecnología, producto o servicio y que, con el desarrollo de la investigación, logren validarse a través de prototipos avanzados en el plazo de dos años. En la etapa de Investigación Tecnológica, se espera que los proyectos avancen hacia la obtención de resultados más próximos a su aplicación productiva o a su implementación en el plano social.",
      requisitos: ["No hay requisitos detallados disponibles."],
      fechaInicio: "30 de agosto de 2025",
      fechaCierre: "30 de octubre de 2025",
    },
    {
      id: 3,
      nombre: "Startup Ciencia 2026",
      institucion: "ANID",
      trl: "TRL 3",
      monto: "134 millones",
      duracion: "12 meses",
      estado: "Finalizado",
      objetivo:
        "Promover el crecimiento y fortalecimiento de empresas de base científico-tecnológica (EBCT) en Chile y en etapa temprana, a través del cofinanciamiento y apoyo técnico en el proceso de desarrollo tecnológico e innovación, en la validación técnica y de negocios de nuevos productos o servicios, facilitando así su entrada a los mercados nacionales e internacionales.",
      requisitos: [
        "Contar con una empresa constituida en Chile con menos de 10 años. Dificultad: cofinanciamiento.",
      ],
      fechaInicio: "29 de junio de 2025",
      fechaCierre: "30 de agosto de 2025",
    },
    {
      id: 4,
      nombre: "Convocatoria Crea y Valida",
      institucion: "CORFO",
      trl: "N/A",
      monto: "180-220 millones",
      duracion: "24 meses",
      estado: "Finalizado",
      objetivo:
        "El programa Crea y Valida tiene como propósito apoyar el desarrollo de nuevos o mejorados productos (bienes o servicios) y/o procesos, que requieran I+D, desde la fase de prototipo hasta la fase de validación técnica a escala productiva y/o validación comercial. Su objetivo es fortalecer las capacidades de innovación en empresas chilenas. ",
      requisitos: ["No hay requisitos detallados disponibles."],
      fechaInicio: "28 de febrero de 2025",
      fechaCierre: "30 de abril de 2025",
    },
    {
      id: 5,
      nombre: "Convocatoria Innova Región",
      institucion: "CORFO",
      trl: "N/A",
      monto: "60 millones",
      duracion: "24 meses",
      estado: "Finalizado",
      objetivo:
        "El programa Innova Región tiene como propósito apoyar el desarrollo de nuevos o mejorados productos (bienes o servicios) y/o procesos, desde la fase de prototipo hasta la validación técnica y comercial, con el fin de fortalecer la innovación empresarial a nivel regional.",
      requisitos: ["No hay requisitos detallados disponibles."],
      fechaInicio: "31 de marzo de 2025",
      fechaCierre: "30 de abril de 2025",
    },
    {
      id: 6,
      nombre: "DI Regular PUCV",
      institucion: "INTERNAS PUCV",
      trl: "N/A",
      monto: "3.300.000",
      duracion: "10 meses",
      estado: "Finalizado",
      objetivo:
        "Incentivar a académicos/as con trayectoria investigadora en la PUCV que hayan finalizado proyectos FONDECYT (inicio/regular), FONDEF, o similares, y desean preparar una nueva postulación a esos concursos, o a proyectos similares.",
      requisitos: [
        "Publicar un paper WoS, Q1 o Q2, u otra alternativa de productividad científica equivalente.",
        "Participar como evaluador/a en concursos de la Dirección de Investigación.",
        "Colaborar en actividades de la Dirección de Investigación.",
        "Involucrar estudiantes PUCV (tesistas de pre/postgrado).",
        "Incluir agradecimientos a VINCI.",
        "DI PUCV en la productividad científica.",
        "Postular a FONDECYT 2025 u otro proyecto similar en 2024.",
        "Generar difusión en medios/RRSS destacando el aporte PUCV.",
      ],
      fechaInicio: "28 de febrero de 2025",
      fechaCierre: "31 de marzo de 2025",
    },
  ];

  const getInstitucionColor = (institucion) => {
    switch (institucion) {
      case "ANID":
        return "bg-red-500 text-white";
      case "CORFO":
        return "bg-orange-500 text-white";
      case "INTERNAS PUCV":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTRLColor = (trl) => {
    if (trl === "N/A") return "bg-gray-500 text-white";
    return "bg-green-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                {/* Selector de Tipo de Fondo */}
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                  <option value="">Todos</option>
                  <option value="ANID">ANID</option>
                  <option value="CORFO">CORFO</option>
                  <option value="INTERNAS PUCV">INTERNAS PUCV</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* TRL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TRL:
              </label>
              <div className="relative">
                {/* Selector de TRL */}
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                  <option value="">Todos</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="N/A">N/A</option>{" "}
                  {/* Asegúrate de que N/A también sea una opción */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESTADO:
              </label>
              <div className="relative">
                {/* Selector de Estado */}
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                  <option value="">Todos</option>
                  <option value="Vigente">Vigente</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Botón Reiniciar */}
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Reiniciar Filtros
              </button>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                &nbsp;
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Headers de columna */}
        <div className="bg-white rounded-t-lg shadow-lg">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm">
            <div>Nombre del Fondo</div>
            <div>Tipo de Fondo</div>
            <div>TRL</div>
            <div>Financiamiento</div>
            <div>Duración</div>
            <div>Estado</div>
          </div>
        </div>

        {/* Lista de fondos */}
        <div className="bg-white rounded-b-lg shadow-lg overflow-hidden px-4">
          {/* El componente Accordion principal */}
          {/* type="single" asegura que solo un elemento se expanda a la vez */}
          <Accordion type="single" collapsible className="w-full">
            {fondos.map((fondo) => (
              <AccordionItem
                value={`item-${fondo.id}`}
                key={fondo.id}
                className="border-b border-gray-200"
              >
                <AccordionTrigger>
                  {/* Aquí puedes poner un solo <div> o incluso directamente los <span> y <div> de las columnas */}
                  <div className="grid grid-cols-6 gap-4 w-full items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-blue-400 rounded-full"></div>
                      <span className="font-medium text-gray-900">
                        {fondo.nombre}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getInstitucionColor(fondo.institucion)}`}
                      >
                        {fondo.institucion}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getTRLColor(fondo.trl)}`}
                      >
                        {fondo.trl}
                      </span>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {fondo.monto}
                    </div>
                    <div className="text-gray-700">{fondo.duracion}</div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                        {fondo.estado}
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
                      <p className="text-sm text-gray-600">{fondo.objetivo}</p>
                    </div>

                    {/* Requisitos */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <ClipboardList className="w-4 h-4 mr-2 text-gray-600" />
                        Requisitos:
                      </h4>
                      {fondo.requisitos && fondo.requisitos.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {fondo.requisitos.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
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
                        Inicio: {fondo.fechaInicio}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cierre: {fondo.fechaCierre}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
