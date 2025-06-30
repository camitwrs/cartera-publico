import { jsPDF } from 'jspdf';

// Función para obtener los datos de los proyectos (simulados para el ejemplo)
function getProjectData() {
  return [
    {
      title: 'Centro de Innovación Tecnológica para el Almacenamiento de Energía Resiliente',
      faculty: 'Escuela de Ingeniería Mecánica',
      status: 'Postulado',
      principal_academic: 'Yunesky Masip',
      amount: '$0',
      postulation_date: '31 de diciembre de 2024',
      convocation_type: 'Centros Tecnológicos para la Innovación',
      convocation_name: 'ANID',
      convoking_institution: 'ANID',
      support_type: 'Parcial',
      support_detail: 'Modelo asociativo y gobernanza',
      thematic: 'Almacenamiento Energía',
      comments: '',
    },
    {
      title: 'Centro Tecnológico para la Innovación en Hidrógeno Verde en Magallanes',
      faculty: 'Facultad de Ingeniería',
      status: 'Perfil',
      principal_academic: 'Gianni Guliano Olguín',
      amount: '$8.730.300',
      postulation_date: '17 de septiembre de 2024',
      convocation_type: 'Centros Tecnológicos para la Innovación',
      convocation_name: 'CORFO',
      convoking_institution: 'CORFO',
      support_type: 'Total',
      support_detail: 'Total',
      thematic: 'Hidrógeno',
      comments: '',
    },
    {
      title: 'Contaminación lumínica y medición rango espectral',
      faculty: 'Escuela de Ingeniería Eléctrica',
      status: 'Perfil',
      principal_academic: 'Iván Kopaitic',
      other_academics: 'Sebastián Carlos Fingerhuth',
      amount: '$0',
      postulation_date: '24 de mayo de 2025',
      convocation_type: '', // Tipo de convocatoria faltante
      convocation_name: 'CORFO',
      convoking_institution: 'CORFO',
      support_type: 'Parcial',
      support_detail: 'Perfilamiento, levantamiento de oportunidades',
      thematic: 'Contaminación Lumínica',
      comments: 'Perfil de proyecto realizado, en busqueda de opciones',
    },
    {
      title: 'Diplomado Evaluación Ambiental de Proyectos de Hidrógeno Verde',
      faculty: 'Facultad de Ingeniería',
      status: 'Perfil',
      principal_academic: 'Sebastián Carlos Fingerhuth',
      amount: '$0',
      postulation_date: '31 de agosto de 2024',
      convocation_type: 'Programa de Formación para la competividad',
      convocation_name: 'PRIVADA',
      convoking_institution: 'CODESSER',
      support_type: 'Total',
      support_detail: 'Total',
      thematic: 'Hidrógeno',
      comments: '',
    },
    {
      title: 'Dron para el monitoreo de relaves mineros',
      faculty: 'Escuela de Ingeniería Informática',
      status: 'Perfil',
      principal_academic: 'Ricardo J. Soto',
      amount: '$0',
      postulation_date: 'N/A',
      convocation_type: '',
      convocation_name: 'CORFO',
      convoking_institution: 'CORFO',
      support_type: 'Parcial',
      support_detail: 'Perfilamiento proyecto',
      thematic: 'Minería',
      comments: 'Proyecto considerado en Academia EBCT',
    },
    {
      title: 'Fortalecimiento de Investigaciones Biotecnológicas en la región de Valparaíso: Implementación de tecnología avanzada y alta resolución de citometría de flujo espectral.',
      faculty: 'Escuela de Ingeniería Bioquímica',
      status: 'Adjudicado',
      principal_academic: 'Claudia Altamirano',
      amount: '$0',
      postulation_date: '1 de mayo de 2024',
      convocation_type: 'FONDEQUIP 2024',
      convocation_name: 'ANID',
      convoking_institution: 'ANID',
      support_type: 'Parcial',
      support_detail: 'Perfilamiento, determinación irl, modelo de negocios',
      thematic: 'Biotecnología',
      comments: 'Adjudicado (EQM240055) Apoyo en modelo de negocios',
    },
    {
      title: 'Herramienta de planificación conjunta de sistemas eléctricos e hidrógeno verde centrada en la descarbonización del sector minero del norte de Chile',
      faculty: 'Escuela de Ingeniería Eléctrica',
      status: 'Perfil',
      principal_academic: 'Sebastián Oliva',
      amount: '$0',
      postulation_date: 'N/A',
      convocation_type: '',
      convocation_name: 'CORFO',
      convoking_institution: 'CORFO',
      support_type: 'Parcial',
      support_detail: 'Articulación con institución pública',
      thematic: 'Hidrógeno',
      comments: 'Académico es apoyado mediante la conexión con Agencia de Sostenibilidad Energética',
    },
    {
      title: 'Precipitación Quimica de Litio desde salmuera',
      faculty: 'Escuela de Ingeniería Química',
      status: 'Postulado',
      principal_academic: 'Carlos Javier Carlesi',
      other_academics: 'Gianni Guliano Olguín',
      amount: '$279.000.000',
      postulation_date: '2 de octubre de 2024',
      convocation_type: 'Invitación privada',
      convocation_name: 'PRIVADA',
      convoking_institution: 'SQM',
      support_type: 'Parcial',
      support_detail: 'Perfilamiento proyecto',
      thematic: 'Litio',
      comments: 'Ninguno',
    },
    {
      title: 'Transporte Selectivo de Iones en GOM para recuperación de Litio',
      faculty: 'Escuela de Ingeniería Química',
      status: 'Perfil',
      principal_academic: 'Carlos Javier Carlesi',
      other_academics: 'Gianni Guliano Olguín',
      amount: '$0',
      postulation_date: '30 de septiembre de 2024',
      convocation_type: 'Invitación privada',
      convocation_name: 'PRIVADA',
      convoking_institution: 'SQM',
      support_type: 'Parcial',
      support_detail: 'Perfilamiento proyecto',
      thematic: 'Litio',
      comments: '',
    },
  ];
}

// Función para generar el PDF
async function generateProjectsReport() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = doc.internal.pageSize.height;
  let y = 0; // Coordenada Y actual

  // --- Colores y Estilos ---
  const primaryColor = '#2C3E50'; // Un azul oscuro
  const accentColor = '#3498DB'; // Un azul más claro para acentos
  const lightGrey = '#F8F8F8'; // Fondo de tarjeta
  const textGrey = '#6C7A89'; // Texto secundario
  const white = '#FFFFFF';

  // --- Íconos (simulados con texto para JSPDF) ---
  const icons = {
    faculty: '🎓',
    status: '📊', // O ⏳ para Postulado, ✅ para Adjudicado, 📝 para Perfil
    academic: '🧑‍🏫',
    amount: '💰',
    date: '🗓️',
    convocationType: '💡',
    supportType: '✨',
    comments: '💬',
    thematic: '🏷️', // Genérico, podrías tener específicos
    institution: '🏢', // Genérico
  };

  // Función auxiliar para dibujar badges (etiquetas)
  const drawBadge = (
    text,
    x,
    y,
    textColor,
    bgColor,
    icon = null,
    fontSize = 7
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    const textWidth = doc.getTextWidth(text);
    const padding = 2;
    const badgeWidth = textWidth + padding * 2 + (icon ? 3 : 0); // + espacio para el ícono
    const badgeHeight = fontSize * 0.9 + padding * 2;

    doc.setFillColor(bgColor);
    doc.roundedRect(x, y, badgeWidth, badgeHeight, 2, 2, 'F'); // Fondo del badge (sin sombra)
    doc.setTextColor(textColor);
    if (icon) {
      doc.text(icon, x + padding, y + badgeHeight - padding - 0.5); // Ajustar Y del ícono
      doc.text(text, x + padding + 3, y + badgeHeight - padding - 0.5); // Ajustar Y del texto
    } else {
      doc.text(text, x + padding, y + badgeHeight - padding - 0.5);
    }
  };

  // --- Cabecera (Header) ---
  const drawHeader = (doc, pageNum) => {
    // Rectángulo para simular degradado (usaremos un color plano fuerte)
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(white);
    doc.text('INFORME DETALLADO DE PROYECTOS', doc.internal.pageSize.width / 2, 12, {
      align: 'center',
    });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(white);
    doc.text('Generado el 30-06-2025', doc.internal.pageSize.width / 2, 18, {
      align: 'center',
    });

    // Simulando logo (si tuvieras una imagen base64 o URL)
    // const logoURL = 'tu_logo_base64_o_url';
    // if (logoURL) {
    //   doc.addImage(logoURL, 'PNG', 180, 5, 20, 20); // Ajustar tamaño y posición
    // }

    // Número de página
    doc.setFontSize(8);
    doc.setTextColor(white);
    doc.text(`Página ${pageNum}`, doc.internal.pageSize.width - 20, 25, {
      align: 'right',
    });

    y = 35; // Establecer Y después del header
  };

  // Dibujar la cabecera en la primera página
  drawHeader(doc, 1);

  const projects = getProjectData();
  const cardPadding = 10;
  const cardMarginBottom = 15;
  const contentStartX = 20; // Margen izquierdo para el contenido de la tarjeta
  const cardWidth = doc.internal.pageSize.width - contentStartX * 2;

  // --- Dibujar proyectos ---
  for (const project of projects) {
    // Verificar si necesitamos una nueva página antes de dibujar el siguiente proyecto
    const projectCardHeightEstimate = 120; // Estimado, ajusta según el contenido real
    if (y + projectCardHeightEstimate + cardMarginBottom > pageHeight) {
      doc.addPage();
      drawHeader(doc, doc.internal.pageNumber); // Redibujar cabecera en la nueva página
    }

    // Dibujar el fondo de la tarjeta (simulando sombra con un borde oscuro)
    doc.setFillColor(lightGrey);
    // doc.setDrawColor('#DDDDDD'); // Simula una sombra sutil
    // doc.roundedRect(contentStartX - 1, y - 1, cardWidth + 2, projectCardHeightEstimate + 2, 3, 3, 'FD'); // Para la sombra

    doc.setDrawColor('#CCCCCC'); // Color del borde de la tarjeta
    doc.setFillColor(white);
    doc.roundedRect(contentStartX, y, cardWidth, projectCardHeightEstimate, 3, 3, 'FD'); // Fondo blanco de la tarjeta

    let currentYInCard = y + cardPadding;

    // Título del proyecto
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    const projectTitleLines = doc.splitTextToSize(project.title, cardWidth - cardPadding * 2);
    doc.text(projectTitleLines, contentStartX + cardPadding, currentYInCard);
    currentYInCard += projectTitleLines.length * 5 + 5; // Espacio después del título

    // Badges (Temática e Institución)
    const badgeXStart = contentStartX + cardPadding;
    drawBadge(
      project.thematic,
      badgeXStart,
      currentYInCard,
      white,
      accentColor,
      icons.thematic
    ); // Temática
    drawBadge(
      project.convoking_institution,
      badgeXStart + doc.getTextWidth(project.thematic) + 30, // Ajustar espaciado
      currentYInCard,
      primaryColor,
      '#ECF0F1', // Gris muy claro para fondo de institución
      icons.institution
    );
    currentYInCard += 10 + 5; // Espacio después de los badges

    // Separador
    doc.setDrawColor('#E0E0E0');
    doc.line(
      contentStartX + cardPadding,
      currentYInCard,
      contentStartX + cardWidth - cardPadding,
      currentYInCard
    );
    currentYInCard += 5; // Espacio después del separador

    // Detalles del proyecto (dos columnas simuladas)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textGrey);

    const col1X = contentStartX + cardPadding;
    const col2X = contentStartX + cardWidth / 2 + 5; // Posición de la segunda columna

    let lineHeight = 5; // Altura de línea
    let col1Y = currentYInCard;
    let col2Y = currentYInCard;

    // Columna 1
    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.faculty} Facultad:`, col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.faculty, col1X + 25, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.status} Estatus:`, col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.status, col1X + 25, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.academic} Académico principal:`, col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    const academicTextWidth = doc.getTextWidth('Académico principal:');
    doc.text(project.principal_academic, col1X + 25 + academicTextWidth - 12, col1Y);
    col1Y += lineHeight;

    if (project.other_academics) {
      doc.setFont('helvetica', 'bold');
      doc.text(`  Otros académicos:`, col1X, col1Y); // Sin ícono para otros
      doc.setFont('helvetica', 'normal');
      doc.text(project.other_academics, col1X + 25 + academicTextWidth - 12, col1Y);
      col1Y += lineHeight;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.amount} Monto:`, col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.amount, col1X + 25, col1Y);
    col1Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.date} Fecha de postulación:`, col1X, col1Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.postulation_date, col1X + 45, col1Y);
    col1Y += lineHeight + 5; // Pequeño espacio extra

    // Columna 2
    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.convocationType} Tipo de convocatoria:`, col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    const convocationTypeLines = doc.splitTextToSize(project.convocation_type || 'N/A', cardWidth / 2 - cardPadding * 2);
    doc.text(convocationTypeLines, col2X + 45, col2Y);
    col2Y += convocationTypeLines.length * lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`  Nombre convocatoria:`, col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.convocation_name, col2X + 45, col2Y);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.institution} Institución convocante:`, col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.convoking_institution, col2X + 45, col2Y);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`${icons.supportType} Tipo de apoyo:`, col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    doc.text(project.support_type, col2X + 45, col2Y);
    col2Y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text(`  Detalle de apoyo:`, col2X, col2Y);
    doc.setFont('helvetica', 'normal');
    const supportDetailLines = doc.splitTextToSize(project.support_detail || 'N/A', cardWidth / 2 - cardPadding * 2);
    doc.text(supportDetailLines, col2X + 45, col2Y);
    col2Y += supportDetailLines.length * lineHeight + 5; // Espacio extra

    // Comentarios (en una sola columna al final, debajo de las dos columnas)
    currentYInCard = Math.max(col1Y, col2Y); // Ajustar Y al más bajo de las dos columnas
    doc.setDrawColor('#E0E0E0');
    doc.line(
      contentStartX + cardPadding,
      currentYInCard,
      contentStartX + cardWidth - cardPadding,
      currentYInCard
    );
    currentYInCard += 5;

    if (project.comments) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${icons.comments} Comentarios:`, contentStartX + cardPadding, currentYInCard);
      doc.setFont('helvetica', 'normal');
      const commentLines = doc.splitTextToSize(project.comments, cardWidth - cardPadding * 2 - 20); // Ancho para comentarios
      doc.text(commentLines, contentStartX + cardPadding + 25, currentYInCard);
      currentYInCard += commentLines.length * lineHeight + 5;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text(`${icons.comments} Comentarios:`, contentStartX + cardPadding, currentYInCard);
      doc.setFont('helvetica', 'normal');
      doc.text('Ninguno', contentStartX + cardPadding + 25, currentYInCard);
      currentYInCard += lineHeight + 5;
    }

    // Actualizar la altura estimada de la tarjeta para la próxima iteración
    const actualCardHeight = currentYInCard - y + cardPadding;
    doc.setDrawColor('#CCCCCC'); // Resetear el color del borde de la tarjeta
    doc.setFillColor(white);
    doc.roundedRect(contentStartX, y, cardWidth, actualCardHeight, 3, 3, 'FD'); // Redibujar con altura correcta

    y += actualCardHeight + cardMarginBottom; // Actualizar Y global para el siguiente proyecto
  }

  // --- Resumen Estadístico ---
  doc.addPage();
  drawHeader(doc, doc.internal.pageNumber);
  y = 40; // Reiniciar Y para la nueva página

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('RESUMEN ESTADÍSTICO', doc.internal.pageSize.width / 2, y, {
    align: 'center',
  });
  y += 10;

  // Información general
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor);
  doc.text(`• Total de proyectos: ${projects.length}`, contentStartX, y);
  y += 7;
  const totalAmount = projects.reduce((sum, p) => {
    const amountNum = parseFloat(p.amount.replace('$', '').replace(/\./g, ''));
    return sum + (isNaN(amountNum) ? 0 : amountNum);
  }, 0);
  doc.text(
    `• Inversión total: $${totalAmount.toLocaleString('es-CL')}`,
    contentStartX,
    y
  );
  y += 7;
  const uniqueFaculties = new Set(projects.map((p) => p.faculty));
  doc.text(
    `• Total de facultades distintas: ${uniqueFaculties.size}`,
    contentStartX,
    y
  );
  y += 15;

  // Tabla de facultades y proyectos
  const tableX = contentStartX + 10;
  const tableY = y;
  const cellWidth = 70;
  const cellHeight = 8;
  const headerBgColor = primaryColor;
  const headerTextColor = white;
  const row1Bg = '#F2F2F2'; // Gris claro
  const row2Bg = white;

  // Obtener conteo por facultad
  const facultyCounts = projects.reduce((acc, project) => {
    acc[project.faculty] = (acc[project.faculty] || 0) + 1;
    return acc;
  }, {});

  // Encabezados de tabla
  doc.setFillColor(headerBgColor);
  doc.roundedRect(tableX, tableY, cellWidth * 2, cellHeight, 2, 2, 'F'); // Fondo redondeado
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(headerTextColor);
  doc.text('Facultad', tableX + cellWidth / 2, tableY + cellHeight / 2 + 1, {
    align: 'center',
  });
  doc.text('Proyectos', tableX + cellWidth + cellWidth / 2, tableY + cellHeight / 2 + 1, {
    align: 'center',
  });

  let currentTableY = tableY + cellHeight;
  let rowCount = 0;

  // Filas de datos
  for (const faculty in facultyCounts) {
    const bgColor = rowCount % 2 === 0 ? row2Bg : row1Bg; // Alternar colores
    doc.setFillColor(bgColor);
    doc.roundedRect(tableX, currentTableY, cellWidth * 2, cellHeight, 2, 2, 'F'); // Fondo de fila

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textGrey);

    doc.text(faculty, tableX + 5, currentTableY + cellHeight / 2 + 1); // Contenido de Facultad
    doc.text(
      String(facultyCounts[faculty]),
      tableX + cellWidth + cellWidth / 2,
      currentTableY + cellHeight / 2 + 1,
      {
        align: 'center',
      }
    ); // Contenido de Proyectos

    currentTableY += cellHeight;
    rowCount++;
  }

  // --- Guardar PDF ---
  doc.save('Informe_Detallado_Proyectos_Rediseñado.pdf');
}

// Para ejecutarlo en un navegador, puedes añadir un botón:
// document.body.innerHTML = '<button id="generatePdf">Generar Informe PDF</button>';
// document.getElementById('generatePdf').addEventListener('click', generateProjectsReport);

// O simplemente llamarlo si lo estás ejecutando en un entorno Node con JSDOM o similar.
// generateProjectsReport();

// Exportar la función para que pueda ser llamada desde otro script si es necesario
export { generateProjectsReport };