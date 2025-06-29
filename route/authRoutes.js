const express = require('express');
const axios = require('axios');
const router = express.Router();

const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;
const TEMPLATE_ID = process.env.TEMPLATE_ID;


// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    await axios.post('https://api.msg91.com/api/v5/otp', {
      mobile: `91${phone}`,
      otp,
      template_id: TEMPLATE_ID,
    }, {
      headers: {
        authkey: MSG91_AUTHKEY,
        'Content-Type': 'application/json',
      }
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const verifyRes = await axios.get(
      `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=91${phone}`,
      { headers: { authkey: MSG91_AUTHKEY } }
    );

    if (verifyRes.data.message === 'OTP verified success') {
      res.status(200).json({ success: true, message: 'OTP verified' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
