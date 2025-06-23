import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, X, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

export default function EditarProyectosPage() {
  const navigate = useNavigate(); // Hook para la navegación programática

  // Datos de ejemplo que antes estaban en CarteraPage
  const [themes, setThemes] = useState([
    { id: 1, name: "Economía Circular", editable: false },
    { id: 2, name: "Interdisciplina", editable: false },
    { id: 3, name: "Hidrógeno", editable: false },
    { id: 4, name: "Biotecnología", editable: false },
    { id: 5, name: "Astronomía", editable: false },
  ]);

  const [statuses, setStatuses] = useState([
    { id: 1, name: "Postulado", editable: false },
    { id: 2, name: "En Progreso", editable: false },
    { id: 3, name: "Completado", editable: false },
    { id: 4, name: "Pausado", editable: false },
  ]);

  const [convocatorias, setConvocatorias] = useState([
    { id: 1, name: "FRPD GORE Valparaíso", editable: false },
    { id: 2, name: "FOVI", editable: false },
    {
      id: 3,
      name: "Programa de Formación para la competitividad",
      editable: false,
    },
  ]);

  const [units, setUnits] = useState([
    { id: 1, name: "Escuela de Ingeniería Civil", editable: false },
    { id: 2, name: "Escuela de Ingeniería Química", editable: false },
    { id: 3, name: "Facultad de Ingeniería", editable: false },
    { id: 4, name: "Facultad de Ciencias", editable: false },
  ]);

  const [editingCell, setEditingCell] = useState({ table: null, id: null });
  const [tempValue, setTempValue] = useState("");

  const handleEditCell = (table, id, currentValue) => {
    setEditingCell({ table, id });
    setTempValue(currentValue);
  };

  const handleSaveCell = (table, id) => {
    const updateFunction = {
      themes: setThemes,
      statuses: setStatuses,
      convocatorias: setConvocatorias,
      units: setUnits,
    }[table];

    const currentData = {
      themes,
      statuses,
      convocatorias,
      units,
    }[table];

    updateFunction(
      currentData.map((item) =>
        item.id === id ? { ...item, name: tempValue } : item
      )
    );
    setEditingCell({ table: null, id: null });
    setTempValue("");
  };

  const handleCancelEdit = () => {
    setEditingCell({ table: null, id: null });
    setTempValue("");
  };

  const handleDeleteRow = (table, id) => {
    const updateFunction = {
      themes: setThemes,
      statuses: setStatuses,
      convocatorias: setConvocatorias,
      units: setUnits,
    }[table];

    const currentData = {
      themes,
      statuses,
      convocatorias,
      units,
    }[table];

    updateFunction(currentData.filter((item) => item.id !== id));
  };

  const handleAddRow = (table) => {
    const currentData = {
      themes,
      statuses,
      convocatorias,
      units,
    }[table];

    const updateFunction = {
      themes: setThemes,
      statuses: setStatuses,
      convocatorias,
      units,
    }[table];

    const newId =
      currentData.length > 0
        ? Math.max(...currentData.map((item) => item.id)) + 1
        : 1; // Asegurarse de que el ID inicial sea 1 si el array está vacío
    updateFunction([
      ...currentData,
      { id: newId, name: "Nuevo elemento", editable: false },
    ]);
  };

  const EditableTable = ({ title, data, tableName }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Button
          size="sm"
          onClick={() => handleAddRow(tableName)}
          className="bg-[#2E5C8A] hover:bg-[#1E4A6F]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Nombre
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-24">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingCell.table === tableName &&
                  editingCell.id === item.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleSaveCell(tableName, item.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveCell(tableName, item.id)}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                      onClick={() =>
                        handleEditCell(tableName, item.id, item.name)
                      }
                    >
                      {item.name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleEditCell(tableName, item.id, item.name)
                      }
                      className="text-[#2E5C8A] border-[#2E5C8A] hover:bg-[#2E5C8A] hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRow(tableName, item.id)}
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Cartera de Proyectos
            </h1>
            <p className="text-gray-600">
              Administra las categorías y elementos del sistema
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger
                value="themes"
                className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
              >
                Temáticas
              </TabsTrigger>
              <TabsTrigger
                value="statuses"
                className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
              >
                Estatus
              </TabsTrigger>
              <TabsTrigger
                value="convocatorias"
                className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
              >
                Convocatorias
              </TabsTrigger>
              <TabsTrigger
                value="units"
                className="data-[state=active]:bg-[#2E5C8A] data-[state=active]:text-white"
              >
                Unidades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="themes">
              <EditableTable
                title="Temáticas"
                data={themes}
                tableName="themes"
              />
            </TabsContent>

            <TabsContent value="statuses">
              <EditableTable
                title="Estatus"
                data={statuses}
                tableName="statuses"
              />
            </TabsContent>

            <TabsContent value="convocatorias">
              <EditableTable
                title="Convocatorias"
                data={convocatorias}
                tableName="convocatorias"
              />
            </TabsContent>

            <TabsContent value="units">
              <EditableTable
                title="Unidades Académicas"
                data={units}
                tableName="units"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
