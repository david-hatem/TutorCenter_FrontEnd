import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Print the content of a specified div as a PDF.
 *
 * @param divId - The ID of the div to print as a PDF.
 */
const printDivAsPDF = (divId: string): void => {
  // Find the div element by ID
  const input = document.getElementById(divId);

  if (!input) {
    console.error("Div not found!");
    return;
  }

  // Use html2canvas to capture the div content
  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Create a jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait", // 'portrait' or 'landscape'
        unit: "px", // Measurement unit
        format: [canvas.width, canvas.height], // Auto-adjust PDF size to content
      });

      // Add the captured image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Save the PDF with a default filename
      pdf.save("download.pdf");
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
};

export const generatePDF = async () => {
  const element = document.getElementById("pdf-table");
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 190; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 10; // Initial top margin
  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight; // Adjust position
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("table.pdf");
};
import * as XLSX from "xlsx";

/**
 * Export nested data to an Excel file with headers.
 *
 * @param data - The array of nested data records to export.
 * @param fileName - The name of the Excel file to save.
 */
export const exportNestedDataToExcel = (
  data: any[],
  fileName: string = "nested_data.xlsx"
): void => {
  // Flatten the nested data with only essential columns
  const flattenedData = data.map((item) => ({
    "Professeur": `${item.professeur?.prenom} ${item.professeur?.nom}`,
    "Étudiant": `${item.etudiant?.prenom} ${item.etudiant?.nom}`,
    "Groupe": item.groupe?.nom_groupe,
    "Niveau": item.groupe?.niveau_info?.nom_niveau || '',
    "Filière": item.groupe?.filiere_info?.nom_filiere || '',
    "Montant": item.montant,
    "Date": new Date(item.date_comission).toLocaleDateString('fr-FR'),
    "Mois": item.month_name,
    "Statut": item.statut_comission.toLowerCase()
  }));

  // Create worksheet from flattened data
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commissions");

  // Save the Excel file
  XLSX.writeFile(workbook, fileName);
};

export default printDivAsPDF;
