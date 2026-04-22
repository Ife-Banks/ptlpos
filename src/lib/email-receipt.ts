import type { Sale } from "@/types/api";

interface EmailReceiptData {
  sale: Sale;
  customerEmail?: string;
}

export async function sendReceiptEmail(data: EmailReceiptData): Promise<{ success: boolean; error?: string }> {
  const { sale, customerEmail } = data;

  if (!customerEmail) {
    return { success: false, error: "No email address provided" };
  }

  const receiptHtml = generateEmailReceiptHtml(sale);
  const receiptText = generateEmailReceiptText(sale);

  try {
    const response = await fetch("/api/receipts/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: customerEmail,
        subject: `Receipt #${sale.saleNumber} - PTLPOS`,
        html: receiptHtml,
        text: receiptText,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Email receipt error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

function generateEmailReceiptText(sale: Sale): string {
  const lines = [
    "Dear Customer,",
    "",
    "Thank you for your purchase!",
    "",
    "Receipt Details:",
    `- Receipt #: ${sale.saleNumber}`,
    `- Date: ${new Date(sale.createdAt || "").toLocaleDateString()}`,
    `- Total: $${sale.total.toFixed(2)}`,
    "",
    "Items:",
    ...(sale.items?.map(item => 
      `  - ${item.product?.name} x${item.quantity} = $${item.total.toFixed(2)}`
    ) || []),
    "",
    `Subtotal: $${sale.subtotal.toFixed(2)}`,
    `Tax: $${sale.taxAmount.toFixed(2)}`,
    sale.discountAmount > 0 ? `Discount: -$${sale.discountAmount.toFixed(2)}` : "",
    `Total: $${sale.total.toFixed(2)}`,
    "",
    "Best regards,",
    "PTLPOS",
  ];

  return lines.filter(Boolean).join("\n");
}

function generateEmailReceiptHtml(sale: Sale): string {
  const itemsHtml = sale.items?.map(item => `
    <tr>
      <td>${item.product?.name} x${item.quantity}</td>
      <td style="text-align: right;">$${item.total.toFixed(2)}</td>
    </tr>
  `).join("") || "";

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
    .totals { margin-top: 20px; }
    .totals td { border-top: 2px solid #333; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PTLPOS</div>
      <p>123 Business Street<br>City, State 12345</p>
    </div>
    
    <h2>Receipt #${sale.saleNumber}</h2>
    <p>Date: ${new Date(sale.createdAt || "").toLocaleDateString()}</p>
    ${sale.customer ? `<p>Customer: ${sale.customer.name}</p>` : ""}
    
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot class="totals">
        <tr>
          <td>Subtotal</td>
          <td style="text-align: right;">$${sale.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Tax</td>
          <td style="text-align: right;">$${sale.taxAmount.toFixed(2)}</td>
        </tr>
        ${sale.discountAmount > 0 ? `
        <tr>
          <td>Discount</td>
          <td style="text-align: right; color: green;">-$${sale.discountAmount.toFixed(2)}</td>
        </tr>
        ` : ""}
        <tr>
          <td><strong>Total</strong></td>
          <td style="text-align: right;"><strong>$${sale.total.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>
    
    <div class="footer">
      <p>Thank you for your purchase!</p>
      <p>Please come again</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function generateReceiptPdf(sale: Sale): Promise<Blob> {
  const html = generateEmailReceiptHtml(sale);
  
  const response = await fetch("/api/receipts/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  return response.blob();
}