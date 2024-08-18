const express = require('express')
const router = express.Router()
const { sign } = require('../../signing/sign-message');

router.get('/message/:amount/:network', async (req, res) => {
    try {
        const {amount, network} = req.params;
        if (!amount || !network) {
           return res.status(400).send('Missing amount or network parameter');
        }
        const signature = await sign(amount, network)
        res.json(signature);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

module.exports = router
