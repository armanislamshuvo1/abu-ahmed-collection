const nodemailer = require('nodemailer');

// Generate unique human-readable order ID: AAC-YYYY-XXXX
const generateOrderId = async (OrderModel) => {
  const currentYear = new Date().getFullYear();
  const count = await OrderModel.countDocuments();
  const sequential = String(count + 1).padStart(4, '0');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `AAC-${currentYear}-${sequential}${randomSuffix}`;
};

// Generate pre-filled WhatsApp message URL
const generateWhatsAppLink = (order, targetPhone) => {
  const itemsText = order.items
    .map((item, idx) => `${idx + 1}. ${item.name} x ${item.quantity} - ৳${item.price * item.quantity}`)
    .join('\n');

  const text = `👑 *ABU AHMED COLLECTION* - Order Invoice
━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${order.orderId}
*Customer Name:* ${order.customer.name}
*Phone:* ${order.customer.phone}
*Email:* ${order.customer.email}
*Delivery Address:* ${order.customer.address} (${order.customer.deliveryZoneName})
*Payment Method:* ${order.paymentMethod.name}${order.paymentMethod.transactionId ? ` (TrxID: ${order.paymentMethod.transactionId})` : ''}

*Order Items:*
${itemsText}

*Subtotal:* ৳${order.subtotal}
*Delivery Charge:* ৳${order.deliveryFee}
*Total Payable:* ৳${order.total}
*Status:* ${order.status}
━━━━━━━━━━━━━━━━━━━━
Thank you for choosing Abu Ahmed Collection!`;

  const cleanedPhone = (targetPhone || '8801700000000').replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
};

// Send email notification (gracefully logs if SMTP is not configured)
const sendOrderEmail = async (order, recipientEmail, isOwner = false) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Notification Service] SMTP not configured. Order notification recorded for ${recipientEmail}.`);
    return { success: false, reason: 'SMTP not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const subject = isOwner
      ? `🚨 New Order Alert #${order.orderId} - Abu Ahmed Collection`
      : `✨ Order Confirmation #${order.orderId} - Abu Ahmed Collection`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #d4af37; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0b0b0b; padding: 24px; text-align: center; color: #d4af37;">
          <h1 style="margin: 0; font-size: 24px;">ABU AHMED COLLECTION</h1>
          <p style="margin: 4px 0 0; color: #f5e6be; font-size: 13px; letter-spacing: 2px;">STYLE • QUALITY • TRUST</p>
        </div>
        <div style="padding: 24px; background-color: #fffdf9;">
          <h2 style="color: #0b0b0b; margin-top: 0;">Order #${order.orderId}</h2>
          <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
          <p><strong>Delivery Address:</strong> ${order.customer.address} [${order.customer.deliveryZoneName}]</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.name}</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #0b0b0b; text-align: left;">
                <th style="padding: 8px;">Item</th>
                <th style="padding: 8px;">Qty</th>
                <th style="padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  i => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px;">${i.name}</td>
                  <td style="padding: 8px;">${i.quantity}</td>
                  <td style="padding: 8px;">৳${i.price * i.quantity}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: right; line-height: 1.6;">
            <p style="margin: 4px 0;">Subtotal: <strong>৳${order.subtotal}</strong></p>
            <p style="margin: 4px 0;">Delivery Fee: <strong>৳${order.deliveryFee}</strong></p>
            <h3 style="margin: 8px 0; color: #b8860b;">Total: ৳${order.total}</h3>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Abu Ahmed Collection" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject,
      html
    });

    return { success: true };
  } catch (err) {
    console.error('[Notification Email Error]', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  generateOrderId,
  generateWhatsAppLink,
  sendOrderEmail
};
