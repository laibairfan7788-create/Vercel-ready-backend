const User = require('../models/User');
const Project = require('../models/Project');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');
const FAQ = require('../models/FAQ');
const Distributor = require('../models/Distributor');

// ==================== DASHBOARD STATS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProjects, totalGallery, totalContacts, totalFAQs, totalDistributors] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      FAQ.countDocuments(),
      Distributor.countDocuments()
    ]);

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent projects
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pending contacts count
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProjects,
          totalGallery,
          totalContacts,
          totalFAQs,
          totalDistributors,
          pendingContacts
        },
        recentContacts,
        recentProjects
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== USER MANAGEMENT ====================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    user.updatedAt = Date.now();

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== CONTACT MANAGEMENT ====================
exports.getAllContacts = async (req, res) => {
  try {
    const { status, limit } = req.query;
    let query = {};
    if (status) query.status = status;

    let contactsQuery = Contact.find(query).sort({ createdAt: -1 });
    if (limit) contactsQuery = contactsQuery.limit(parseInt(limit));

    const contacts = await contactsQuery;

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        updatedAt: Date.now() 
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== FAQ MANAGEMENT ====================
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    const faq = new FAQ({
      question,
      answer,
      category: category || 'general',
      order: order || 0,
      isActive: true
    });
    await faq.save();
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (order !== undefined) faq.order = order;
    if (isActive !== undefined) faq.isActive = isActive;
    faq.updatedAt = Date.now();

    await faq.save();

    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DISTRIBUTOR MANAGEMENT ====================
exports.getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: distributors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDistributorById = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: 'Distributor not found'
      });
    }
    res.json({
      success: true,
      data: distributor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createDistributor = async (req, res) => {
  try {
    const distributor = new Distributor(req.body);
    await distributor.save();
    res.status(201).json({
      success: true,
      message: 'Distributor created successfully',
      data: distributor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: 'Distributor not found'
      });
    }

    res.json({
      success: true,
      message: 'Distributor updated successfully',
      data: distributor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndDelete(req.params.id);
    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: 'Distributor not found'
      });
    }
    res.json({
      success: true,
      message: 'Distributor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== SYSTEM SETTINGS ====================
exports.getSettings = async (req, res) => {
  try {
    // You can add settings model or return default settings
    const settings = {
      siteName: 'GARS Industries',
      phone1: '+92 309 7770664',
      phone2: '+92 309 7770665',
      email: 'garspakistan@gmail.com',
      address: '36 KM, Main Multan Rd, Shamkay Bhattian, Lahore, 54000, Pakistan',
      whatsapp: '+92 309 7770663',
      workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      socialMedia: {
        facebook: '#',
        instagram: '#',
        youtube: '#'
      }
    };
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    // Update settings logic here
    // You can create a Settings model for database storage
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};