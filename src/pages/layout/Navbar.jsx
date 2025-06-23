import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Home,
  FileText, // Icono para Cartera de Proyectos (el menú)
  User,
  ChevronDown,
  BarChart,
  DollarSign,
  ClipboardList,
  Plus, // Icono para Añadir Proyecto
  Edit, // Icono para Editar Proyectos
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Importar hooks de react-router-dom

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para manejar la navegación
  const handleNavItemClick = (path) => {
    navigate(path);
  };

  // Función auxiliar para determinar si un elemento de navegación debe estar activo
  const isActive = (paths) => {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    return pathArray.some((path) => location.pathname === path);
  };

  return (
    <header className="bg-[#2E5C8A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo y Título de la Aplicación */}
            <div
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={() => handleNavItemClick("/")} // Ruta raíz para inicio
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#2E5C8A]" />
              </div>
              <div className="text-white font-bold text-lg">
                Formulación de Proyectos I+D
              </div>
            </div>

            {/* Navegación Principal */}
            <nav className="hidden md:flex space-x-6">
              <Button
                variant="ghost"
                className={`text-white cursor-pointer hover:bg-white/10 hover:text-white ${
                  isActive("/") ? "bg-white/10" : "" // Home es la ruta raíz
                }`}
                onClick={() => handleNavItemClick("/")}
              >
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Button>
              <Button
                variant="ghost"
                className={`text-white cursor-pointer hover:bg-white/10 hover:text-white ${
                  isActive("/visualizacion") ? "bg-white/10" : ""
                }`}
                onClick={() => handleNavItemClick("/visualizacion")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Visualización
              </Button>

              {/* Dropdown para "Cartera de proyectos" */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`text-white cursor-pointer hover:bg-white/10 hover:text-white ${
                      isActive(["/anadir-proyectos", "/editar-proyectos"]) // Active si una de las sub-rutas está activa
                        ? "bg-white/10"
                        : ""
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Cartera de proyectos
                    <ChevronDown className="w-4 h-4 ml-1 -mr-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-md mt-2">
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => handleNavItemClick("/anadir-proyectos")}
                  >
                    <Plus className="w-4 h-4 mr-2 text-gray-700" />
                    Añadir Nuevo Proyecto
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => handleNavItemClick("/editar-proyectos")}
                  >
                    <Edit className="w-4 h-4 mr-2 text-gray-700" />
                    Modificar Cartera de Proyectos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dropdown para "Perfiles de proyecto" */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`text-white cursor-pointer hover:bg-white/10 hover:text-white ${
                      isActive(["/estadisticas", "/fondos", "/formularios"]) // Active si una de las sub-rutas está activa
                        ? "bg-white/10"
                        : ""
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Perfiles de proyecto
                    <ChevronDown className="w-4 h-4 ml-1 -mr-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-md mt-2">
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => handleNavItemClick("/estadisticas")}
                  >
                    <BarChart className="w-4 h-4 mr-2 text-gray-700" />
                    Estadísticas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => handleNavItemClick("/fondos")}
                  >
                    <DollarSign className="w-4 h-4 mr-2 text-gray-700" />
                    Fondos
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => handleNavItemClick("/formularios")}
                  >
                    <ClipboardList className="w-4 h-4 mr-2 text-gray-700" />
                    Formularios
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          {/* Aquí puedes añadir otros elementos del lado derecho del navbar si los hubiera */}
        </div>
      </div>
    </header>
  );
}
