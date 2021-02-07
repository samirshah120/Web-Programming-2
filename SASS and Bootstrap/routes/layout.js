const express = require('express');
const router = express.Router();
router.get('/', async (req,res) => {
    try { 
        return res.status(200).render("home", {title:"Movies Page"});
    } catch (e) {
        res.status(404).json({error: e.message});
    }
})
module.exports = router;