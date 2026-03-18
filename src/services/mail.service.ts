import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "williamkoerich17@gmail.com",
    pass: "vwxm rwsz tael iwiu",
  },
});

type OrderMailProps = {
  companyName: string;
  buyerName: string;
  cnpj: string;
  whatsapp: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export async function sendOrderMail(data: OrderMailProps) {
  const total = data.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  await transporter.sendMail({
    from: `"Loja Reuzze" <williamkoerich17@gmail.com>`,
    to: "williamkoerich17@gmail.com",
    subject: "🛒 Novo pedido recebido",
    html: `
      <h2>Novo Pedido</h2>

      <h3>Dados do cliente</h3>
      <p><strong>Empresa:</strong> ${data.companyName}</p>
      <p><strong>Comprador:</strong> ${data.buyerName}</p>
      <p><strong>CNPJ:</strong> ${data.cnpj}</p>
      <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>

      <h3>Itens</h3>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Produto</th>
          <th>Qtd</th>
          <th>Total</th>
        </tr>
        ${itemsHtml}
      </table>

      <h3>Total: R$ ${total.toFixed(2)}</h3>
    `,
  });
}