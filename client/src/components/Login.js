import React from "react";
import { useNavigate } from 'react-router-dom'; 
import '../css/Login.css';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Login successful!');
                console.log(data);

                localStorage.setItem('token', data.token);
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                
                this.props.navigate('/');  
            } else {
                alert('Login failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    }

    render() {
        return (
            <div className='login'>
                <form onSubmit={this.handleSubmit} id="second">
                    <h2>Login Form</h2>
                    <hr />
                    <div className='form-group email'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' className='logi' id='email' name='email' onChange={this.handleChange} />
                    </div>
                    <div className='form-group password'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' className='logi' id='password' name='password' onChange={this.handleChange} />
                    </div>
                    <button type='submit'>Login</button>
                </form>
            </div>
        );
    }
}

function LoginWithNavigate(props) {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;