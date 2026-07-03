
// const Contact = require('../models/Contact');

// exports.submitContact = async (req, res) => {
//   try {
//     const contact = new Contact(req.body);
//     await contact.save();
//     res.status(201).json({ success: true, message: 'Message sent successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: contacts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.updateContactStatus = async (req, res) => {
//   try {
//     const contact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
//     res.json({ success: true, data: contact });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
const Contact = require('../models/Contact');

// ─── Public: submit a contact message ─────────────────────────────
exports.submitContact = async (req, res) => {
  try {
    const { name, phone, email, requirement, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required',
      });
    }

    const contact = new Contact({
      name,
      phone: phone || '',
      email,
      requirement: requirement || '',
      message,
      status: 'pending',
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.',
    });
  }
};

// ─── Admin: get all contacts ──────────────────────────────────────
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: update contact status ─────────────────────────────────
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};