"use client"
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export function ExportButton({ data, filename }: { data: any[], filename: string }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
       alert("No data available to export.");
       return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 hover:text-emerald-400 px-4 py-2 rounded-lg transition-colors text-sm font-semibold border border-emerald-500/20 shadow-sm"
    >
      <Download className="w-4 h-4" />
      Export Excel
    </button>
  )
}
