import React from "react";
import '../css/Convert.css';
import { jwtDecode } from 'jwt-decode';

class Convert extends React.Component {
    state = {
        amount: '',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        convertedAmount: '',
        currencies: ['USD', 'EUR', 'GBP', 'UAH', 'JPY', 'CAD']
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { amount, fromCurrency, toCurrency } = this.state;

        if (!fromCurrency.trim() || !toCurrency.trim()) {
            console.error("Currency codes cannot be empty.");
            return;
        }

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            console.error("Amount should be a valid positive number.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/convert?amount=${encodeURIComponent(amount)}&fromCurrency=${encodeURIComponent(fromCurrency)}&toCurrency=${encodeURIComponent(toCurrency)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ convertedAmount: data.convertedAmount });

            await this.saveTransaction(amount, fromCurrency, toCurrency, data.convertedAmount);
        } catch (error) {
            console.error("Error fetching conversion or saving transaction:", error);
        }
    }

    saveTransaction = async (amount, fromCurrency, toCurrency, convertedAmount) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error("No token found for saving transaction");
            return;
        }
    
        try {
            const decodedToken = jwtDecode(token); 
            const userId = decodedToken.id; 
            const response = await fetch(`http://localhost:3000/api/transactions/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    fromCurrency,
                    toCurrency,
                    convertedAmount,
                    userId 
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save transaction');
            }
    
            console.log("Transaction saved successfully");
        } catch (error) {
            console.error("Error saving transaction:", error);
        }
    }

    render() {
        const { amount, fromCurrency, toCurrency, convertedAmount, currencies } = this.state;
        const formClass = convertedAmount ? 'convert expanded' : 'convert';

        return (
            <div className={formClass}>
                <section id='convert'>
                    <h3>Convert</h3>
                    <hr />
                    <div className='form-group amount'>
                        <label htmlFor='amount' className="conver">Sum</label>
                        <input
                            type='text'
                            id='amount'
                            name='amount'
                            value={amount}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='form-group fromCurrency'>
                        <label htmlFor='fromCurrency' className="conver">From Currency</label>
                        <select
                            id='fromCurrency'
                            name='fromCurrency'
                            value={fromCurrency}
                            onChange={this.handleChange}
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group toCurrency'>
                        <label htmlFor='toCurrency' className="conver">To Currency</label>
                        <select
                            id='toCurrency'
                            name='toCurrency'
                            className="label-input"
                            value={toCurrency}
                            onChange={this.handleChange}
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type='submit' onClick={this.handleSubmit} id='conv'>Convert</button>
                    {convertedAmount && (
                        <div className="result">
                            Converted Amount: {convertedAmount}
                        </div>
                    )}
                </section>
            </div>
        );
    }
}

export default Convert;
