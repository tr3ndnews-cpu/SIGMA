export function printSection(elementId: string, title: string, rppData: any) {
  const contentEl = document.getElementById(elementId);
  if (!contentEl) return;
  const content = contentEl.innerHTML;

  const parseName = (s: string) => s.includes('/') ? s.split('/')[0].trim() : s.trim();
  const titleName = `${title} - ${rppData.mapel} ${parseName(rppData.namaGuru)}`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>${titleName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 2cm; }
          body { font-family: 'Inter', system-ui, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
          th { background-color: #f9fafb; font-weight: 600; }
        </style>
      </head>
      <body>
        <h2 class="text-2xl font-bold uppercase">${title}</h2>
        <h3 class="text-xl font-medium text-gray-800">${rppData.mapel}</h3>
        <h4 class="text-lg text-gray-600 mb-8">${rppData.namaSekolah}</h4>
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 500);
}
