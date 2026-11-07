/**
 * Format numeric currency with commas and currency code
 */
export const formatCurrency = (amount, currency = 'ETB') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Contact for Price';
  }
  const formatted = Number(amount).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
  return `${formatted} ${currency}`;
};

/**
 * Generate a clean WhatsApp chat link
 */
export const buildWhatsAppLink = (phoneNumber, text) => {
  if (!phoneNumber) return '#';
  // Strip non-digits except leading +
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate a clean Telegram chat link
 */
export const buildTelegramLink = (usernameOrPhone, text) => {
  if (!usernameOrPhone) return '#';
  const cleanHandle = usernameOrPhone.replace(/^@/, '').trim();
  // If it looks like a username, open direct chat
  if (cleanHandle.match(/^[a-zA-Z0-9_]{4,}$/)) {
    // Note: t.me link with prefilled text parameter works on telegram web/app
    return `https://t.me/${cleanHandle}?text=${encodeURIComponent(text)}`;
  }
  // Fallback to general telegram share link
  return `https://t.me/share/url?url=${encodeURIComponent('https://t.me/' + cleanHandle)}&text=${encodeURIComponent(text)}`;
};

/**
 * Build pre-order instant messaging text for Telegram / WhatsApp
 */
export const buildPreOrderMessage = (order, storeSettings = {}) => {
  const code = order.orderCode || 'IMP-XXXX';
  const title = order.productTitle || 'Item';
  const qty = order.quantity || 1;
  const specs = order.selectedSpecsOrNotes || 'Standard Specs';
  const name = order.customerName || 'Customer';
  const phone = order.customerPhone || '';
  const city = order.deliveryAddressOrCity || 'Local Delivery';
  const price =
    order.unitPriceSnapshot !== null && order.unitPriceSnapshot !== undefined
      ? formatCurrency(order.unitPriceSnapshot, storeSettings.currency || 'ETB')
      : 'Price Inquire';

  return `Hello ${storeSettings.storeName || 'GlobalImport Hub'}! 👋\n` +
    `I placed Pre-Order #${code} on your website.\n\n` +
    `📦 Item: ${title}\n` +
    `🔢 Quantity: ${qty}\n` +
    `⚙️ Selected Specs / Notes: ${specs}\n` +
    `💰 Price Snapshot: ${price}\n` +
    `👤 Customer: ${name} (${phone})\n` +
    `📍 Delivery Area: ${city}\n\n` +
    `Please confirm the current import batch price, deposit details, and delivery timeline. Thank you!`;
};

/**
 * Build custom sourcing request instant messaging text
 */
export const buildCustomRequestMessage = (request, storeSettings = {}) => {
  const code = request.requestCode || 'REQ-XXXX';
  const item = request.itemNameOrModel || 'Custom Item';
  const category =
    request.category === 'raw_materials'
      ? 'Clothing & Raw Materials'
      : request.category === 'electronics'
      ? 'Electronics'
      : 'Special Import';
  const specs = request.desiredSpecsAndQuantity || 'N/A';
  const budget = request.targetBudget || 'Best available';
  const name = request.customerName || 'Customer';
  const phone = request.customerPhone || '';
  const refLink = request.referenceLinkOrImage ? `\n🔗 Reference: ${request.referenceLinkOrImage}` : '';

  return `Hello ${storeSettings.storeName || 'GlobalImport Hub'}! 👋\n` +
    `I submitted Custom Import Request #${code} on your website.\n\n` +
    `🎯 Item / Model: ${item}\n` +
    `📂 Category: ${category}\n` +
    `📝 Desired Specs & Quantity: ${specs}\n` +
    `💵 Target Budget: ${budget}${refLink}\n` +
    `👤 Requester: ${name} (${phone})\n\n` +
    `Please check availability with your global suppliers and provide an import quotation. Thanks!`;
};

