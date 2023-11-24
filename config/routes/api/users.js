const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// @route   GET api/users
// @desc    Test route
// @access  public
router.get('/', (req,res) => res.send('User route'));


// @route   POST api/users
// @desc    Reguster a user
// @access  public
router.post('/', [
    check('name', 'Name is required').not().isEmpty()
], (req,res) => {
    console.log(req.body);  // Object of data that's gonna be sent to this route, this appears in the console 
    
    res.send('User route') // this appears in the browser after sending POST request with Postman
});

module.exports = router;
