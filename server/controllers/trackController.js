const dataAccess = require('../data/dataAccess');

const ORDER_STEPS = [
  {
    key: 'pending_confirmation',
    title: 'Pre-Order Received',
    description: 'Order logged. Awaiting buyer confirmation via Telegram or WhatsApp.',
  },
  {
    key: 'deposit_paid',
    title: 'Deposit Paid & Sourced',
    description: 'Deposit verified. Item allocated with international supplier/batch.',
  },
  {
    key: 'in_transit',
    title: 'International Transit',
    description: 'Item dispatched via air freight / shipping to domestic destination.',
  },
  {
    key: 'arrived',
    title: 'Arrived at Local Hub',
    description: 'Cleared customs and inspected at our local hub. Ready for dispatch.',
  },
  {
    key: 'delivered',
    title: 'Delivered / Handed Over',
    description: 'Successfully delivered to customer address or picked up.',
  },
];

const CUSTOM_REQUEST_STEPS = [
  {
    key: 'new',
    title: 'Request Received',
    description: 'Our sourcing team is querying global suppliers for your requested item.',
  },
  {
    key: 'quoted',
    title: 'Pricing & Batch Quoted',
    description: 'Import quotation provided to customer with estimated timeline.',
  },
  {
    key: 'accepted',
    title: 'Quote Accepted & Deposit Paid',
    description: 'Customer approved quote. Order scheduled for import batch dispatch.',
  },
  {
    key: 'closed',
    title: 'Import Fulfilled / Completed',
    description: 'Request completed and item dispatched or delivered.',
  },
];

exports.trackCode = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid tracking reference code.',
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if it's an order or custom request
    let order = await dataAccess.getOrderByCode(cleanCode);
    let customRequest = null;

    if (!order) {
      customRequest = await dataAccess.getCustomRequestByCode(cleanCode);
    }

    if (!order && !customRequest) {
      return res.status(404).json({
        success: false,
        message: `No record found for code "${cleanCode}". Please verify your reference code (e.g. IMP-1024 or REQ-5012).`,
      });
    }

    if (order) {
      const currentStatus = order.status;
      const isCancelled = currentStatus === 'cancelled';

      const currentIdx = ORDER_STEPS.findIndex((s) => s.key === currentStatus);

      const timeline = ORDER_STEPS.map((step, idx) => ({
        stepNumber: idx + 1,
        key: step.key,
        title: step.title,
        description: step.description,
        isCompleted: !isCancelled && currentIdx >= idx,
        isCurrent: !isCancelled && currentIdx === idx,
      }));

      return res.json({
        success: true,
        type: 'order',
        code: order.orderCode,
        status: order.status,
        isCancelled,
        title: order.productTitle,
        category: order.productCategory,
        quantity: order.quantity,
        price: order.unitPriceSnapshot,
        customerName: order.customerName,
        deliveryAddress: order.deliveryAddressOrCity,
        specsOrNotes: order.selectedSpecsOrNotes,
        createdAt: order.createdAt,
        timeline,
        record: order,
      });
    }

    if (customRequest) {
      const currentStatus = customRequest.status;
      const currentIdx = CUSTOM_REQUEST_STEPS.findIndex((s) => s.key === currentStatus);

      const timeline = CUSTOM_REQUEST_STEPS.map((step, idx) => ({
        stepNumber: idx + 1,
        key: step.key,
        title: step.title,
        description: step.description,
        isCompleted: currentIdx >= idx,
        isCurrent: currentIdx === idx,
      }));

      return res.json({
        success: true,
        type: 'custom_request',
        code: customRequest.requestCode,
        status: customRequest.status,
        title: customRequest.itemNameOrModel,
        category: customRequest.category,
        customerName: customRequest.customerName,
        desiredSpecs: customRequest.desiredSpecsAndQuantity,
        targetBudget: customRequest.targetBudget,
        referenceLinkOrImage: customRequest.referenceLinkOrImage,
        createdAt: customRequest.createdAt,
        timeline,
        record: customRequest,
      });
    }
  } catch (error) {
    console.error('Error tracking code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to look up tracking details',
      error: error.message,
    });
  }
};

