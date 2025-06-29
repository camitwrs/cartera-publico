// src/hooks/useExportData.js
import { useState, useCallback } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import funcionesService from "../api/funciones.js";
import { useError } from "@/contexts/ErrorContext";


export const useExportData = () => {
  const [loadingExportPDF, setLoadingExportPDF] = useState(false);
  const [loadingExportExcel, setLoadingExportExcel] = useState(false);

  const { setError } = useError();
  // **** ELIMINADO: Ya no usamos setGlobalLoading ****
  // const { setLoading: setGlobalLoading } = useLoading(); 

  // --- Funciones de Formato (sin cambios, ya están bien) ---
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "Fecha Inválida";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("es-CL", options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha Inválida";
    }
  }, []);

  const formatCurrency = useCallback((amount) => {
    // Asegurarse de que el monto es un número. Si viene como string con "$", ".", ","
    let numericAmount = parseFloat(String(amount).replace(/[^0-9,-]/g, '').replace(',', '.'));
    if (isNaN(numericAmount)) {
      console.warn("Monto inválido para formatear:", amount);
      return "$0";
    }

    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  }, []);

  // --- Funciones para obtener datos (sin cambios) ---
  const getProyectosData = useCallback(async () => {
    try {
      const response = await funcionesService.getDataInterseccionProyectos();
      return Array.isArray(response) ? response : [];
    } catch (err) {
      console.error("Error al obtener datos de proyectos:", err);
      setError(err.message || "Error al cargar los datos de proyectos para exportar.");
      return [];
    }
  }, [setError]);

  const getAcademicosXProyecto = useCallback(async () => {
    try {
      const response = await funcionesService.getAcademicosPorProyecto();
      return Array.isArray(response) ? response : [];
    } catch (err) {
      console.error("Error al obtener académicos por proyecto:", err);
      setError(err.message || "Error al cargar datos de académicos para exportar.");
      return [];
    }
  }, [setError]);

  // --- Lógica de Exportación a PDF ---
  const generarPDF = useCallback(async () => {
    setLoadingExportPDF(true);
    // **** ELIMINADO: No usamos setGlobalLoading aquí ****
    // setGlobalLoading(true);
    setError(null);
    try {
      const proyectos = await getProyectosData();

      if (proyectos.length === 0) {
        setError("No hay proyectos para exportar a PDF.");
        return;
      }

      // Asegúrate de que jsPDF se importa y usa correctamente.
      // A veces, el problema "autoTable no es una función" es que la extensión no se adjuntó.
      // Esto suele suceder automáticamente con "import 'jspdf-autotable';"
      // Si persiste, verifica que jspdf-autotable es compatible con tu versión de jspdf.
      const doc = new jsPDF(); 

      const now = new Date();
      const formattedDateForTitle = now.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedDateForFilename = now.toISOString().slice(0, 10); 

      doc.setFontSize(18);
      doc.text(`Cartera de Proyectos`, 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${formattedDateForTitle}`, 14, 30); 

      const tableColumn = ["Título", "Estatus", "Líder", "Monto", "Fecha Postulación"];
      const tableRows = proyectos.map(p => [
        doc.splitTextToSize(p.title || "N/A", 60),
        p.status || "N/A",
        p.leader || "N/A",
        formatCurrency(p.amount),
        formatDate(p.applicationDate),
      ]);

      autoTable(doc, { // <-- Aquí es donde autoTable es llamado
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          valign: 'middle',
          halign: 'left',
          lineColor: [220, 220, 220],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [46, 92, 138],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
        },
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      });

      doc.save(`informe_proyectos_${formattedDateForFilename}.pdf`);

    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError(err.message || "Error desconocido al generar el PDF.");
    } finally {
      setLoadingExportPDF(false);
      // **** ELIMINADO: No usamos setGlobalLoading aquí ****
      // setGlobalLoading(false);
    }
  }, [getProyectosData, setError, formatCurrency, formatDate]); // Eliminado setGlobalLoading de las dependencias

  // --- Lógica de Exportación a Excel ---
  const generarExcel = useCallback(async () => {
    setLoadingExportExcel(true);
    // **** ELIMINADO: No usamos setGlobalLoading aquí ****
    // setGlobalLoading(true);
    setError(null);
    try {
      const [proyectos, academicosPorProyecto] = await Promise.all([
        getProyectosData(),
        getAcademicosXProyecto(),
      ]);

      if (proyectos.length === 0) {
        setError("No hay proyectos para exportar a Excel.");
        return;
      }
      
      const now = new Date();
      const formattedDateForFilename = now.toISOString().slice(0, 10);

      const wsProyectosData = proyectos.map(p => ({
        ID: p.id,
        Titulo: p.title,
        Estatus: p.status,
        Tematica: p.theme,
        'Unidad Académica': p.academicUnit,
        Líder: p.leader,
        Monto: formatCurrency(p.amount),
        'Tipo de Apoyo': p.supportType,
        'Fecha de Postulación': formatDate(p.applicationDate),
        Convocatoria: p.call,
        Comentarios: p.comments,
        'Última Actualización': formatDate(p.lastUpdate)
      }));
      const wsProyectos = XLSX.utils.json_to_sheet(wsProyectosData);

      const wsAcademicosData = academicosPorProyecto.map(a => ({
        'ID Proyecto': a.projectId,
        'Nombre Proyecto': a.projectName,
        'Académicos': (a.academics && Array.isArray(a.academics) ? a.academics.join(', ') : 'N/A')
      }));
      const wsAcademicos = XLSX.utils.json_to_sheet(wsAcademicosData);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsProyectos, "Proyectos");
      XLSX.utils.book_append_sheet(wb, wsAcademicos, "Academicos por Proyecto");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(data, `informe_proyectos_${formattedDateForFilename}.xlsx`);

    } catch (err) {
      console.error("Error al generar Excel:", err);
      setError(err.message || "Error desconocido al generar el archivo Excel.");
    } finally {
      setLoadingExportExcel(false);
      // **** ELIMINADO: No usamos setGlobalLoading aquí ****
      // setGlobalLoading(false);
    }
  }, [getProyectosData, getAcademicosXProyecto, setError, formatCurrency, formatDate]); // Eliminado setGlobalLoading de las dependencias

  return {
    loadingExportPDF,
    loadingExportExcel,
    generarPDF,
    generarExcel,
  };
};