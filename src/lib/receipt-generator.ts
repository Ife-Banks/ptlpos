import type { Sale } from "@/types/api";
import { formatCurrency, formatDate } from "./utils";

type ReceiptTemplate = "40mm" | "80mm" | "A4";

const TEMPLATE_WIDTHS: Record<ReceiptTemplate, number> = {
  "40mm": 40,
  "80mm": 80,
  "A4": 210,
};

export function generatePrintReceipt(sale: Sale, template: ReceiptTemplate = "80mm"): string {
  const width = TEMPLATE_WIDTHS[template];
  const lineChar = "-".repeat(width);

  const formatLine = (left: string, right: string, totalWidth = width): string => {
    const padding = totalWidth - left.length - right.length;
    return left + " ".repeat(Math.max(1, padding)) + right;
  };

  const itemsHtml = sale.items?.map(item => `
    <div>${item.product?.name} x${item.quantity}</div>
    <div class="text-right">${formatCurrency(item.total)}</div>
  `).join("") || "";

  const paymentsHtml = sale.payments && sale.payments.length > 0 ? `
  <div class="border-t my-2">
    ${sale.payments.map(p => `
      <div>${formatLine(p.method, formatCurrency(p.amount), width)}</div>
    `).join("")}
  </div>
  ` : "";

  const discountHtml = sale.discountAmount > 0 ? `
    <div>${formatLine("Discount", "-" + formatCurrency(sale.discountAmount), width)}</div>
  ` : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt ${sale.saleNumber}</title>
  <style>
    @page { margin: 0; }
    body { 
      font-family: 'Courier New', monospace; 
      font-size: ${template === "A4" ? "14px" : "10px"};
      width: ${width}mm;
      padding: 5mm;
      margin: 0;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .border-t { border-top: 1px dashed #000; }
    .border-b { border-bottom: 1px dashed #000; }
    .bold { font-weight: bold; }
    .my-2 { margin: 2mm 0; }
  </style>
</head>
<body>
  <div class="text-center bold my-2">PTLPOS</div>
  <div class="text-center">123 Business Street</div>
  <div class="text-center">City, State 12345</div>
  
  <div class="border-t border-b my-2">
    <div>Receipt: ${sale.saleNumber}</div>
    <div>Date: ${formatDate(sale.createdAt || "", "long")}</div>
    ${sale.customer ? `<div>Customer: ${sale.customer.name}</div>` : ""}
  </div>
  
  <div class="my-2">
    ${itemsHtml}
  </div>
  
  <div class="border-t my-2">
    <div>${formatLine("Subtotal", formatCurrency(sale.subtotal), width)}</div>
    <div>${formatLine("Tax", formatCurrency(sale.taxAmount), width)}</div>
    ${discountHtml}
    <div class="bold text-right my-2">TOTAL: ${formatCurrency(sale.total)}</div>
  </div>
  
  ${paymentsHtml}
  
  <div class="text-center my-2">
    <div>Thank you!</div>
    <div>Please come again</div>
  </div>
</body>
</html>
  `.trim();
}

export function printReceipt(sale: Sale, template: ReceiptTemplate = "80mm"): void {
  const html = generatePrintReceipt(sale, template);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}