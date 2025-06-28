import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
// Importa los componentes de Shadcn UI que vas a usar para la alerta de error
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"; // Para el botón de cerrar
import { XCircle } from "lucide-react"; // Icono para el error, puedes usar AlertCircle, XCircle, etc.

// 1. Crear el contexto
const ErrorContext = createContext(null);

// 2. Crear el hook personalizado para consumir el contexto
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

// 3. Crear el proveedor del contexto
export const ErrorProvider = ({ children }) => {
  const [error, setErrorState] = useState(null); // Usamos setErrorState para evitar conflicto con la función publica
  const timerRef = useRef(null); // Ref para el temporizador

  // Función para establecer el error y un temporizador para ocultarlo
  // Renombrada a `displayError` para mayor claridad en el uso público.
  const displayError = useCallback((errorMessage, duration = 5000) => {
    // Limpiar cualquier temporizador existente
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setErrorState(errorMessage);

    timerRef.current = setTimeout(() => {
      setErrorState(null); // Ocultar el error después de la duración
    }, duration);
  }, []);

  // Limpiar el temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Función para limpiar el error manualmente
  const clearError = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setErrorState(null);
  }, []);

  return (
    <ErrorContext.Provider
      value={{ error, setError: displayError, clearError }}
    >
      {children}
      {error && (
        // Contenedor fijo para posicionar la alerta en la esquina superior derecha
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in-down">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" /> {/* Icono de error */}
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              {/* Manejo para que el mensaje de error pueda ser un string o un objeto con 'message' */}
              {typeof error === "string"
                ? error
                : error.message || "Ha ocurrido un error inesperado."}
            </AlertDescription>
            {/* Botón para cerrar la alerta manualmente */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-red-700 hover:bg-red-100"
              onClick={clearError} // Usamos clearError para limpiar y quitar el temporizador
            >
              X
            </Button>
          </Alert>
        </div>
      )}
    </ErrorContext.Provider>
  );
};
