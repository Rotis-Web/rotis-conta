import { format } from "date-fns";
import { ro } from "date-fns/locale";

export const useExportCSV = () => {
  const authStore = useAuthStore();

  /**
   * Creates a CSV header with PFA information
   */
  const createPFAHeader = (registryTitle: string, year: number): string[] => {
    const pfaData = authStore.user?.pfaData;

    const header = [
      `"${registryTitle}"`,
      `"Anul: ${year}"`,
      "",
      `"Denumire: ${pfaData?.denumire || "N/A"}"`,
      `"CUI: ${pfaData?.cui || "N/A"}"`,
      `"Nr. Reg. Com.: ${pfaData?.nrRegCom || "N/A"}"`,
      `"Adresă: ${pfaData?.adresa || "N/A"}"`,
      "",
      "",
    ];

    return header;
  };

  /**
   * Escapes CSV cell content
   */
  const escapeCSVCell = (cell: any): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (str.includes('"') || str.includes(",") || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  /**
   * Exports Registru Încasări și Plăți to CSV
   */
  const exportIncasariPlatiCSV = (
    entries: any[],
    year: number,
    totals: { incasari: number; plati: number; sold: number }
  ) => {
    // PFA Header
    const header = createPFAHeader("REGISTRU DE ÎNCASĂRI ȘI PLĂȚI", year);

    // Column headers
    const columns = [
      "Nr. Crt.",
      "Data",
      "Tip Document",
      "Nr. Document",
      "Felul Operațiunii",
      "Încasări (RON)",
      "Plăți (RON)",
    ];

    // Data rows
    const rows = entries.map((entry: any) => [
      entry.nrCrt || "",
      entry.data
        ? format(new Date(entry.data), "dd.MM.yyyy", { locale: ro })
        : "",
      entry.document?.tip || "",
      entry.document?.numar || "",
      entry.felulOperatiunii || "",
      entry.tip === "incasare" ? formatNumber(entry.suma) : "",
      entry.tip === "plata" ? formatNumber(entry.suma) : "",
    ]);

    // Totals row
    const totalsRow = [
      "",
      "",
      "",
      "",
      "TOTAL:",
      formatNumber(totals.incasari),
      formatNumber(totals.plati),
    ];

    // Sold row
    const soldRow = ["", "", "", "", "SOLD:", "", formatNumber(totals.sold)];

    // Combine all parts
    const csvContent = [
      ...header,
      columns.map(escapeCSVCell).join(","),
      ...rows.map((row) => row.map(escapeCSVCell).join(",")),
      "",
      totalsRow.map(escapeCSVCell).join(","),
      soldRow.map(escapeCSVCell).join(","),
    ].join("\n");

    downloadCSV(csvContent, `registru-incasari-plati-${year}.csv`);
  };

  /**
   * Exports Registru Intrare-Ieșire to CSV
   */
  const exportIntrareIesireCSV = (entries: any[], year: number) => {
    // PFA Header
    const header = createPFAHeader("REGISTRU DE INTRARE-IEȘIRE", year);

    // Column headers
    const columns = [
      "Nr. Înregistrare",
      "Data Înregistrării",
      "Nr. Document",
      "Data Document",
      "Emitent",
      "Conținut Document",
      "Compartiment și Semnătură",
      "Data Expedierii",
      "Destinatar",
    ];

    // Data rows
    const rows = entries.map((entry: any) => [
      entry.nrInregistrare || "",
      entry.dataInregistrarii
        ? format(new Date(entry.dataInregistrarii), "dd.MM.yyyy", {
            locale: ro,
          })
        : "",
      entry.nrSiDataDocument?.numar || "",
      entry.nrSiDataDocument?.data
        ? format(new Date(entry.nrSiDataDocument.data), "dd.MM.yyyy", {
            locale: ro,
          })
        : "",
      entry.emitent || "",
      entry.continutPeScurt || "",
      entry.compartimentSiSemnatura || "",
      entry.dataExpedierii
        ? format(new Date(entry.dataExpedierii), "dd.MM.yyyy", { locale: ro })
        : "",
      entry.destinatar || "",
    ]);

    // Combine all parts
    const csvContent = [
      ...header,
      columns.map(escapeCSVCell).join(","),
      ...rows.map((row) => row.map(escapeCSVCell).join(",")),
    ].join("\n");

    downloadCSV(csvContent, `registru-intrare-iesire-${year}.csv`);
  };

  /**
   * Exports Registru Evidență Fiscală to CSV
   */
  const exportEvidentaFiscalaCSV = (
    year: number,
    totals: { venituri: number; cheltuieli: number; profit: number },
    taxe: any
  ) => {
    // PFA Header
    const header = createPFAHeader("REGISTRU DE EVIDENȚĂ FISCALĂ", year);

    // Report sections
    const reportContent = [
      "",
      '"RAPORT ANUAL"',
      "",
      '"VENITURI"',
      `"Total venituri:",${escapeCSVCell(formatCurrency(totals.venituri))}`,
      "",
      '"CHELTUIELI DEDUCTIBILE"',
      `"Total cheltuieli:",${escapeCSVCell(formatCurrency(totals.cheltuieli))}`,
      "",
      `"Profit Net:",${escapeCSVCell(formatCurrency(totals.profit))}`,
      "",
      "",
      '"OBLIGAȚII FISCALE ESTIMATE"',
      "",
    ];

    // Tax information
    const taxInfo = [
      `"Prag CAS:",${escapeCSVCell(formatCurrency(taxe.pragCas))}`,
      `"Prag CASS:",${escapeCSVCell(formatCurrency(taxe.pragCass))}`,
      `"Salariu minim brut:",${escapeCSVCell(
        formatCurrency(taxe.salariuMinim)
      )}`,
      "",
      `"CAS (25%):",${escapeCSVCell(formatCurrency(taxe.cas))},"${
        taxe.casApplicabil ? "Aplicabil" : "Sub prag - Nu se aplică"
      }"`,
      `"CASS (10%):",${escapeCSVCell(formatCurrency(taxe.cass))},"${
        taxe.cassApplicabil ? "Aplicabil" : "Sub prag - Nu se aplică"
      }"`,
      `"Impozit pe venit (10%):",${escapeCSVCell(
        formatCurrency(taxe.impozit)
      )},"Aplicabil"`,
      "",
      `"TOTAL TAXE:",${escapeCSVCell(formatCurrency(taxe.total))}`,
      "",
      "",
      '"NOTĂ: Calculele sunt orientative. CAS și CASS se calculează doar dacă venitul depășește pragurile legale."',
      '"Consultați un contabil pentru valori exacte și cazuri specifice."',
    ];

    // Combine all parts
    const csvContent = [...header, ...reportContent, ...taxInfo].join("\n");

    downloadCSV(csvContent, `registru-evidenta-fiscala-${year}.csv`);
  };

  /**
   * Helper function to format numbers for CSV
   */
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  /**
   * Helper function to format currency for CSV
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(value);
  };

  /**
   * Downloads CSV file
   */
  const downloadCSV = (content: string, filename: string) => {
    // Add BOM for proper Excel UTF-8 encoding
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + content], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return {
    exportIncasariPlatiCSV,
    exportIntrareIesireCSV,
    exportEvidentaFiscalaCSV,
  };
};
