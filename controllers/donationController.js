const Donation = require('../models/Donation');


exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.json({ message: 'Get all donations' });
};



// Create a new donation
exports.createDonation = async (req, res) => {
  console.log("chl reha donation")
  try {
    const { name, amount, category, description } = req.body.product;
    console.log(`${name}, ${amount}, ${category}, ${description}, ${req.user.id}`); 
    
    // Create a new donation with the product structure
    const donation = await Donation.create({
      donor: req.user.id,
      product: {
        name,
        amount,
        category,
        description
      },
       // Optional message field
      transactionId: 'TXN_' + Date.now() // Unique transaction ID
    });

    console.log(donation); 

    res.status(201).json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserDonations = async (req, res) => {
  console.log('Fetching user donations...');

  try {
      // Ensure req.body contains user id
      const userId = req.body.userId;

      if (!userId) {
          return res.status(401).json({ success: false, message: "User ID not provided" });
      }

      console.log("User ID:", userId);

      // Fetch donations for the authenticated user
      const donations = await Donation.find({ donor: userId })
          .sort('-createdAt')
          .populate('product'); // Assuming donations have a product field to populate

      res.json({
          success: true,
          donations
      });

      console.log("User donations retrieved successfully:", donations);
  } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};
