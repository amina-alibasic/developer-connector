import { Router } from 'express';
const router = Router();

// @route   GET api/auth
// @desc    Test route
// @access  public
router.get('/', (req,res) => res.send('Auth route'));

export default router;