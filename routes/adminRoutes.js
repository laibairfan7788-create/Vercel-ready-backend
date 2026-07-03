const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const Project = require('../models/Project');
    const Contact = require('../models/Contact');
    const Gallery = require('../models/Gallery');
    
    const [projects, contacts, gallery] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments(),
      Gallery.countDocuments()
    ]);
    
    res.json({
      success: true,
      data: { projects, contacts, gallery }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { auth, admin } = require('../middleware/auth');
// const adminController = require('../controllers/adminController');

// // Dashboard stats
// router.get('/stats', auth, admin, adminController.getDashboardStats);

// // User management
// router.get('/users', auth, admin, adminController.getAllUsers);
// router.get('/users/:id', auth, admin, adminController.getUserById);
// router.put('/users/:id', auth, admin, adminController.updateUser);
// router.delete('/users/:id', auth, admin, adminController.deleteUser);

// // Contact management
// router.get('/contacts', auth, admin, adminController.getAllContacts);
// router.get('/contacts/:id', auth, admin, adminController.getContactById);
// router.put('/contacts/:id', auth, admin, adminController.updateContactStatus);
// router.delete('/contacts/:id', auth, admin, adminController.deleteContact);

// // FAQ management
// router.get('/faqs', auth, admin, adminController.getAllFAQs);
// router.get('/faqs/:id', auth, admin, adminController.getFAQById);
// router.post('/faqs', auth, admin, adminController.createFAQ);
// router.put('/faqs/:id', auth, admin, adminController.updateFAQ);
// router.delete('/faqs/:id', auth, admin, adminController.deleteFAQ);

// // Distributor management
// router.get('/distributors', auth, admin, adminController.getAllDistributors);
// router.get('/distributors/:id', auth, admin, adminController.getDistributorById);
// router.post('/distributors', auth, admin, adminController.createDistributor);
// router.put('/distributors/:id', auth, admin, adminController.updateDistributor);
// router.delete('/distributors/:id', auth, admin, adminController.deleteDistributor);

// // Settings (if you create a Settings model later)
// router.get('/settings', auth, admin, adminController.getSettings);
// router.put('/settings', auth, admin, adminController.updateSettings);

// module.exports = router;