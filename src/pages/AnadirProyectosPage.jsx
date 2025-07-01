import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Save, UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, Info } from "lucide-react";

import { useError } from "@/contexts/ErrorContext";

import proyectosService from "../api/proyectos.js";
import funcionesService from "../api/funciones.js";
import unidadesAcademicasService from "../api/unidadesacademicas.js";
import estatusService from "../api/estatus.js";
import institucionesConvocatoriaService from "../api/institucionconvocatoria.js";
import apoyosService from "../api/apoyos.js";
import tematicasService from "../api/tematicas.js";
import tagsService from "../api/tags.js";
import tipoConvocatoriaService from "../api/tipoconvocatoria.js";

export default function AnadirProyectosPage() {
  const navigate = useNavigate(); // Hook para la navegación programática

  const [formData, setFormData] = useState({
    nombre: "",
    comentarios: "",
    monto: "",
    id_tematica: [], // Asumo que esto se manejará como un array de IDs o nombres seleccionados
    apoyo: null, // Campo para el ID de apoyo seleccionado
    detalle_apoyo: "", // Para el detalle de apoyo (texto o tags)
    fecha_postulacion: "",
    id_estatus: "",
    convocatoria: "",
    unidad: "",
    academics: [], // Array de académicos seleccionados para el formulario
    
  });
  const [selectedAcademics, setSelectedAcademics] = useState([]);
  const [customAcademic, setCustomAcademic] = useState("");
  const [showCustomAcademic, setShowCustomAcademic] = useState(false);

  const [unidadesLookup, setUnidadesLookup] = useState([]);
  const [estatusLookup, setEstatusLookup] = useState([]);
  const [institucionesLookup, setInstitucionesLookup] = useState([]);
  const [apoyosLookup, setApoyosLookup] = useState([]);
  const [tematicasLookup, setTematicasLookup] = useState([]);
  const [tagsLookup, setTagsLookup] = useState([]);
  const [tipoConvocatoriasLookup, setTipoConvocatoriasLookup] = useState([]);
  const [academicosPorProyectoLookup, setAcademicosPorProyectoLookup] =
    useState([]);
  const [academicosGeneralesLookup, setAcademicosGeneralesLookup] = useState(
    []
  );

  const [apoyosMap, setApoyosMap] = useState({});

  const [loadingLookups, setLoadingLookups] = useState(true);
  const [errorLookups, setErrorLookups] = useState(null);
  const { setError: setErrorGlobal } = useError();

  const handleAddAcademic = (academic) => {
    if (!selectedAcademics.includes(academic)) {
      setSelectedAcademics([...selectedAcademics, academic]);
    }
  };

  const handleRemoveAcademic = (academic) => {
    setSelectedAcademics(selectedAcademics.filter((a) => a !== academic));
  };

  const handleAddCustomAcademic = () => {
    if (
      customAcademic.trim() &&
      !selectedAcademics.includes(customAcademic.trim())
    ) {
      setSelectedAcademics([...selectedAcademics, customAcademic.trim()]);
      setCustomAcademic("");
      setShowCustomAcademic(false);
    }
  };

  // --- Fetching de todos los datos de lookups para los Selects ---
  const fetchLookupsData = async () => {
    setLoadingLookups(true);
    setErrorLookups(null);
    setErrorGlobal(null);
    try {
      const [
        unidadesRes,
        estatusRes,
        institucionesRes,
        apoyosRes,
        tematicasRes,
        tagsRes,
        tipoConvocatoriasRes,
        academicosPorProyectoRes, // Si necesitas mapear académicos por proyecto para el input.
        // O academicosService.getAllAcademicos() si es para el Select de académicos
        academicosGeneralesRes, // Si necesitas la lista completa de académicos
      ] = await Promise.all([
        unidadesAcademicasService.getAllUnidadesAcademicas(),
        estatusService.getAllEstatus(),
        institucionesConvocatoriaService.getAllInstitucionesConvocatoria(),
        apoyosService.getAllApoyos(),
        tematicasService.getAllTematicas(),
        tagsService.getAllTags(),
        tipoConvocatoriaService.getAllTiposConvocatoria(),
        funcionesService.getAcademicosPorProyecto(), // Opcional, si es la fuente de académicos para el Select
        // academicosService.getAllAcademicos(), // Descomentar si esta es la fuente del Select de académicos
      ]);

      setUnidadesLookup(unidadesRes);
      console.log("DEBUG: Unidades cargadas:", unidadesRes);
      setEstatusLookup(estatusRes);
      console.log("DEBUG: Estatus cargados:", estatusRes);
      setInstitucionesLookup(institucionesRes);
      console.log("DEBUG: Instituciones cargadas:", institucionesRes);
      setTematicasLookup(tematicasRes);
      console.log("DEBUG: Tematicas cargadas:", tematicasRes);
      setTagsLookup(tagsRes);
      console.log("DEBUG: Tags cargados:", tagsRes);
      setTipoConvocatoriasLookup(tipoConvocatoriasRes);
      console.log("DEBUG: TipoConvocatorias cargadas:", tipoConvocatoriasRes);
      setAcademicosPorProyectoLookup(academicosPorProyectoRes);
      console.log(
        "DEBUG: AcademicosPorProyecto cargados:",
        academicosPorProyectoRes
      );
      // setAcademicosGeneralesLookup(academicosGeneralesRes); // Descomentar si usas este

      // Mapear apoyos para fácil acceso
      const newApoyosMap = apoyosRes.reduce((map, apoyo) => {
        map[apoyo.id_apoyo] = apoyo.nombre;
        return map;
      }, {});
      setApoyosMap(newApoyosMap);
      setApoyosLookup(apoyosRes); // Guarda la lista completa de apoyos
      console.log("DEBUG: Apoyos cargados:", apoyosRes);
      console.log("DEBUG: ApoyosMap construido:", newApoyosMap);
    } catch (err) {
      console.error("Error fetching lookup data:", err);
      setErrorLookups(
        err.message || "Error al cargar las opciones del formulario."
      );
      setErrorGlobal(
        err.message || "Error al cargar las opciones del formulario."
      );
    } finally {
      setLoadingLookups(false);
    }
  };

  // useEffect para llamar a fetchLookupsData al montar
  useEffect(() => {
    fetchLookupsData();
  }, []);

  // Función para manejar el guardado del proyecto
  const handleSaveProject = async () => {
    // Validaciones básicas de formulario (puedes añadir más)
    if (
      !formData.nombre ||
      !formData.fecha_postulacion ||
      !formData.id_estatus ||
      !formData.unidad ||
      !formData.apoyo
    ) {
      setErrorGlobal("Por favor, complete todos los campos obligatorios.");
      return;
    }

    setLoadingLookups(true); // Usamos loadingLookups para indicar que el formulario está en proceso
    setErrorLookups(null);
    setErrorGlobal(null);

    try {
      // Preparar el objeto a enviar, mapeando de vuelta a IDs si es necesario
      const projectToSave = {
        nombre: formData.nombre,
        // Si comentarios es opcional y puede ser null o '', manejarlo
        comentarios: formData.comentarios || null,
        monto: formData.monto ? parseFloat(formData.monto) : 0, // Asegurar que sea número
        // Fecha a formato ISO
        fecha_postulacion: formData.fecha_postulacion
          ? new fecha_postulacion(formData.fecha_postulacion).toISOString()
          : null,
        id_estatus:
          estatusLookup.find((s) => s.name === formData.id_estatus)?.id_estatus ||
          null, // Mapear nombre a ID
        convocatoria: formData.convocatoria || null,
        // 'nombre_convo' y 'institucion' deberían ser IDs numéricos si tu API los espera así,
        // actualmente los guardas como string 'name'. Necesitarías mapear name -> ID
        // Por ahora, asumiré que tu API los acepta como el string 'name' para simplificar.
        nombre_convo: formData.convocatoria, // Si la API acepta el nombre de la convocatoria
        institucion: "N/A", // Si no hay un campo para Institución o es un ID mapeado

        unidad:
          unidadesLookup.find((u) => u.name === formData.unidad)?.id_unidad ||
          null, // Mapear nombre de unidad a ID
        apoyo:
          apoyosLookup.find((a) => a.name === formData.apoyo)?.id_apoyo || null, // Mapear nombre de apoyo a ID
        detalle_apoyo: formData.detalle_apoyo || null,

        // Para los académicos, necesitas enviar un array de sus IDs si eso espera el backend.
        // mockAcademics actualmente guarda nombres. Necesitarías un mapa nombre->ID.
        // O si `selectedAcademics` ya guarda IDs.
        academicos: selectedAcademics, // Asegúrate que selectedAcademics contenga IDs, no nombres si el backend espera IDs.
      };

      // Llamar al servicio para crear el proyecto
      const response = await proyectosService.crearProyecto(projectToSave);

      console.log("Proyecto guardado exitosamente:", response);
      alert("Proyecto guardado exitosamente!");
      navigate("/visualizacion"); // Volver a la página de visualización o a otra página
    } catch (err) {
      console.error("Error guardando proyecto:", err);
      setErrorLookups(
        err.message || "Error desconocido al guardar el proyecto."
      );
      setErrorGlobal(err.message || "Error al guardar el proyecto.");
      alert(`Error al guardar el proyecto: ${err.message}`);
    } finally {
      setLoadingLookups(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Añadir proyecto
            </h1>
            <p className="text-gray-600">
              Complete la información del nuevo proyecto
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda */}
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombre del Proyecto
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del proyecto"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* <div>
                <Label
                  htmlFor="comentarios"
                  className="text-sm font-medium text-gray-700"
                >
                  Comentarios
                </Label>
                <Textarea
                  id="comentarios"
                  placeholder="Agregue comentarios relevantes"
                  value={formData.comentarios}
                  onChange={(e) =>
                    setFormData({ ...formData, comentarios: e.target.value })
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div> */}

              <div>
                <Label
                  htmlFor="monto"
                  className="text-sm font-medium text-gray-700"
                >
                  Monto
                </Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Temática
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, id_tematica: [value] })
                  } // Asume una sola temática por ahora
                  value={formData.id_tematica || ""} // Muestra la temática seleccionada
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione una temática" />
                  </SelectTrigger>
                  <SelectContent>
                    {tematicasLookup.map((theme) => (
                      <SelectItem key={theme.id} value={theme.nombre}>
                        {theme.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Tipo(s) de Apoyo
                </Label>
                <div className="mt-2 space-y-2">
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, apoyo: value })
                    }
                    value={formData.apoyo}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccione tipo de apoyo" />
                    </SelectTrigger>
                    <SelectContent>
                      {apoyosLookup.map((apoyo) => (
                        <SelectItem key={apoyo.id_apoyo} value={apoyo.id_apoyo}>
                          {" "}
                          {/* Usar id_apoyo como valor */}
                          {apoyo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Campo para detalle_apoyo (condicional según el apoyo) */}
                  {/* Aquí necesitas lógica para mostrar Input o Select de Tags, similar al Vue `isApoyoParcial` */}
                  {/* Por simplicidad inicial, lo dejamos como Input */}
                  {(apoyosMap[formData.apoyo] === "PARCIAL" ||
                    apoyosMap[formData.apoyo] === "OTRO") && (
                    <div>
                      <Label
                        htmlFor="detalle_apoyo"
                        className="text-sm font-medium text-gray-700 mt-4"
                      >
                        Detalle Apoyo
                      </Label>
                      {apoyosMap[formData.apoyo] === "PARCIAL" ? (
                        <Select // Para tags si el apoyo es PARCIAL
                          multiple // Si permite múltiples selecciones
                          onValueChange={(selectedTags) =>
                            setFormData({
                              ...formData,
                              detalle_apoyo: selectedTags.join(", "),
                            })
                          }
                          value={formData.detalle_apoyo
                            .split(", ")
                            .filter(Boolean)} // Para pre-seleccionar tags
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccione tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {tagsLookup.map((tag) => (
                              <SelectItem
                                key={tag.id_tag}
                                value={tag.tag_nombre}
                              >
                                {tag.tag_nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="detalle_apoyo"
                          placeholder="Ingrese detalle de apoyo"
                          value={formData.detalle_apoyo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              detalle_apoyo: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="fecha_postulacion"
                  className="text-sm font-medium text-gray-700"
                >
                  Fecha de Ingreso
                </Label>
                <Input
                  id="fecha_postulacion"
                  type="fecha_postulacion"
                  value={formData.fecha_postulacion}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_postulacion: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Estatus
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, id_estatus: value })
                  }
                  value={formData.id_estatus}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione un estatus / Buscar estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    {estatusLookup.map((status) => (
                      <SelectItem
                        key={status.id_estatus}
                        value={status.id_estatus}
                      >
                        {status.tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Convocatoria
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, convocatoria: value })
                  }
                  value={formData.convocatoria}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione una convocatoria / Buscar convocatoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoConvocatoriasLookup.map((conv) => (
                      <SelectItem key={conv.id} value={conv.id}>
                        {conv.nombre} {/* Mostrar el campo 'nombre' */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Unidad Académica
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, unidad: value })
                  }
                  value={formData.unidad}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione una Unidad / Buscar Unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesLookup.map((unidad) => (
                      <SelectItem key={unidad.id_unidad} value={unidad.id_unidad}>
                        {unidad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Académicos
                </Label>
                <Select onValueChange={handleAddAcademic}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione un académico / Buscar académico" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicosGeneralesLookup.map((academic) => (
                      <SelectItem
                        key={academic.id_academico}
                        value={academic.id_academico}
                      >
                        {academic.nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Académicos seleccionados */}
                {selectedAcademics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedAcademics.map((academic) => (
                      <Badge
                        key={academic}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {academic}
                        <button
                          onClick={() => handleRemoveAcademic(academic)}
                          className="ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-8 border-t mt-8">
            <Button variant="outline" onClick={() => navigate("/")}>
              {" "}
              {/* Navegar a la raíz */}
              Cancelar
            </Button>
            <Button
              className="bg-[#2E5C8A] hover:bg-[#1E4A6F]"
              onClick={handleSaveProject}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Proyecto
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
