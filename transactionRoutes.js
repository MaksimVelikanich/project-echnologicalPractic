const express = require('express');
const router = express.Router();
const Transaction = require('./models/Transaction');
const User = require('./models/User');

router.post('/save', async (req, res) => {
    const { amount, fromCurrency, toCurrency, convertedAmount, userId } = req.body;

    console.log("Received transaction data:", { amount, fromCurrency, toCurrency, convertedAmount, userId });

    if (!amount || !fromCurrency || !toCurrency || !convertedAmount || !userId) {
        console.log("Missing required fields");
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const transaction = new Transaction({ 
            amount, 
            fromCurrency, 
            toCurrency, 
            convertedAmount, 
            user: userId 
        });
        await transaction.save();
        console.log("Transaction saved to database:", transaction);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { transactions: transaction._id } },
            { new: true }
        );
        console.log("Updated user with transaction:", updatedUser);

        if (!updatedUser) {
            console.log("User not found, ID:", userId);
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json({ message: 'Transaction saved successfully!', transaction });
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ error: 'Error saving transaction' });
    }
});

router.get('/history/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const transactions = await Transaction.find({ user: userId });
        if (transactions.length === 0) {
            return res.status(404).json({ error: 'No transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
});

module.exports = router;