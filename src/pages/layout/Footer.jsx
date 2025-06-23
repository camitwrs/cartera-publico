export default function Footer() {
  return (
    <footer className="bg-[#2E5C8A] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-6">
        {/* Primera fila de logos (Facultad + Escudo/PUCV) */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          {/* Escudo PUCV y Texto (como una unidad) */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/Escudo-PUCV.svg"
              alt="Escudo PUCV"
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Línea divisoria (opcional, si quieres un separador visual más fuerte) */}
        {/* <div className="w-24 border-t border-blue-400 my-4"></div> */}

        {/* Segunda fila de logos (Acreditación y G9) */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-6 md:mt-0">
          {/* Escudo PUCV (repetido para la fila de abajo, si es el caso) */}
          <img
            src="/images/Escudo-PUCV.svg"
            alt="Escudo PUCV"
            className="h-10 w-auto"
          />

          {/* Recurso-1pucv_AC.svg (Acreditación) */}
          <img
            src="/images/Recurso-1pucv_AC.svg"
            alt="Comisión Nacional de Acreditación"
            className="h-10 w-auto"
          />

          {/* Recurso-1pucv.svg (Otro recurso PUCV) */}
          <img
            src="/images/Recurso-1pucv.svg"
            alt="Otro Recurso PUCV"
            className="h-10 w-auto"
          />

          {/* LOGO_G9.svg (G9) */}
          <img
            src="/images/LOGO_G9.svg"
            alt="Universidades del G9"
            className="h-10 w-auto"
          />
        </div>

        {/* Texto de derechos de autor (si va al final, como en el diseño original de la landing) */}
        {/* <p className="text-blue-100 text-sm mt-8">
          © {new Date().getFullYear()} Formulación de Proyectos I+D, Facultad
          de Ingeniería PUCV.
        </p> */}
      </div>
    </footer>
  );
}
