const express = require('express');
const router = express.Router();
const { 
  createDonation, 
  getAllDonations,
  getUserDonations 
} = require('../controllers/donationController');

router.post('/createdonation', createDonation);
router.get('/getdonation', getAllDonations);
router.post('/my-donations', getUserDonations);

module.exports = router;