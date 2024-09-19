const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/MoneyExchange';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));
