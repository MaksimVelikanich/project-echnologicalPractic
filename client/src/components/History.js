import React from "react";
import '../css/History.css';

class History extends React.Component {
    state = {
        history: []
    };

    componentDidMount() {
        this.fetchHistory();
    }


    fetchHistory = async () => {
        const token = localStorage.getItem('token');
        const userId = this.getUserIdFromToken(token);
        
        if (!userId) {
            console.error('User ID not found');
            return;
        }
    
        try {
            const data = await this.loadHistoryFromServer(userId, token);
            this.processHistoryData(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    }
    
    loadHistoryFromServer = async (userId, token) => {
        const response = await fetch(`http://localhost:3000/api/transactions/history/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch history');
        }
    
        const data = await response.json();
        console.log('Data from server:', data);
        return data;
    }
    
    processHistoryData = (data) => {
        if (!data || data.length === 0) {
            console.error('No transaction history found');
            return;
        }
    
        this.setState({ history: data });
    }
    

    getUserIdFromToken = (token) => {
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded Token:', decodedToken); 
                return decodedToken.id;
            } catch (error) {
                console.error("Invalid token format");
            }
        }
        return null;
    }

    render() {
        const { history } = this.state;

        return (
            <div className='history'>
                <section id='history'>
                    <h4>Conversion History</h4>
                    <hr />
                    <table className='history-table'>
                        <thead>
                            <tr>
                                <th>Sum</th>
                                <th>From Currency</th>
                                <th>To Currency</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.amount}</td>
                                    <td>{entry.fromCurrency}</td>
                                    <td>{entry.toCurrency}</td>
                                    <td>{entry.convertedAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }
}

export default History;
