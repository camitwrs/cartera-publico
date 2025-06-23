import { useState } from "react";
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

export default function AnadirProyectosPage() {
  const navigate = useNavigate(); // Hook para la navegación programática

  // Datos de ejemplo que antes estaban en CarteraPage
  const themes = [
    { id: 1, name: "Economía Circular", editable: false },
    { id: 2, name: "Interdisciplina", editable: false },
    { id: 3, name: "Hidrógeno", editable: false },
    { id: 4, name: "Biotecnología", editable: false },
    { id: 5, name: "Astronomía", editable: false },
  ];

  const statuses = [
    { id: 1, name: "Postulado", editable: false },
    { id: 2, name: "En Progreso", editable: false },
    { id: 3, name: "Completado", editable: false },
    { id: 4, name: "Pausado", editable: false },
  ];

  const convocatorias = [
    { id: 1, name: "FRPD GORE Valparaíso", editable: false },
    { id: 2, name: "FOVI", editable: false },
    {
      id: 3,
      name: "Programa de Formación para la competitividad",
      editable: false,
    },
  ];

  const units = [
    { id: 1, name: "Escuela de Ingeniería Civil", editable: false },
    { id: 2, name: "Escuela de Ingeniería Química", editable: false },
    { id: 3, name: "Facultad de Ingeniería", editable: false },
    { id: 4, name: "Facultad de Ciencias", editable: false },
  ];

  const mockAcademics = [
    "ÁLVARO DÍAZ",
    "CARLOS JAVIER CARLESI",
    "SEBASTIÁN CARLOS FINGERHUTH",
    "MARÍA GONZÁLEZ",
    "JUAN PÉREZ",
  ];

  const [formData, setFormData] = useState({
    name: "",
    comments: "",
    amount: "",
    themes: [], // Asumo que esto se manejará como un array de IDs o nombres seleccionados
    supportType: { total: false, parcial: false },
    date: "",
    status: "",
    convocatoria: "",
    unit: "",
    academics: [], // Array de académicos seleccionados para el formulario
  });
  const [selectedAcademics, setSelectedAcademics] = useState([]);
  const [customAcademic, setCustomAcademic] = useState("");
  const [showCustomAcademic, setShowCustomAcademic] = useState(false);

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

  // Función para manejar el guardado del proyecto (placeholder)
  const handleSaveProject = () => {
    console.log("Guardando proyecto:", { ...formData, selectedAcademics });
    alert("Proyecto guardado (simulado)!");
    navigate("/"); // Volver a la página de inicio o a una página de confirmación
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
                  id="name"
                  placeholder="Ingrese el nombre del proyecto"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="comments"
                  className="text-sm font-medium text-gray-700"
                >
                  Comentarios
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Agregue comentarios relevantes"
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Monto
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
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
                    setFormData({ ...formData, themes: [value] })
                  } // Asume una sola temática por ahora
                  value={formData.themes[0] || ""} // Muestra la temática seleccionada
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione una temática / Buscar temática" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.name}>
                        {theme.name}
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="total"
                      checked={formData.supportType.total}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          supportType: {
                            ...formData.supportType,
                            total: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="total" className="text-sm">
                      Total
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parcial"
                      checked={formData.supportType.parcial}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          supportType: {
                            ...formData.supportType,
                            parcial: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="parcial" className="text-sm">
                      Parcial
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="date"
                  className="text-sm font-medium text-gray-700"
                >
                  Fecha de Ingreso
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
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
                    setFormData({ ...formData, status: value })
                  }
                  value={formData.status}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione un estatus / Buscar estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.name}>
                        {status.name}
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
                    {convocatorias.map((conv) => (
                      <SelectItem key={conv.id} value={conv.name}>
                        {conv.name}
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
                    setFormData({ ...formData, unit: value })
                  }
                  value={formData.unit}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione una Unidad / Buscar Unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name}
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
                    {mockAcademics.map((academic) => (
                      <SelectItem key={academic} value={academic}>
                        {academic}
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
