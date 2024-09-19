const express = require('express');
const path = require('path');
const CurrencyConverter = require('currency-converter-lt');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
require('./db.js'); 

app.use(cors());
app.use(express.json());
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/convert', async (req, res) => { 
    const { amount, fromCurrency, toCurrency } = req.query;

    if (!amount || isNaN(parseFloat(amount)) || !fromCurrency?.trim() || !toCurrency?.trim()) {
        return res.status(400).json({ error: "Invalid parameters provided." });
    }

    try {
        const currencyConverter = new CurrencyConverter({ from: fromCurrency.trim(), to: toCurrency.trim(), amount: parseFloat(amount) });
        const convertedAmount = await currencyConverter.convert();
        res.json({ convertedAmount });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during conversion. Please try again later.' });
    }
});

app.get('/api/transactions/history/:userId', async (req, res) => {
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});
