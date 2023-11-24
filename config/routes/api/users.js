const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  public
router.get('/', (req,res) => res.send('User route'));


// @route   POST api/users
// @desc    Reguster a user
// @access  public
router.post('/', (req,res) => {
    console.log(req.body);  // Object of data that's gonna be sent to this route 
    
    res.send('User route')
});

module.exports = router;
