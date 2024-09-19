import React from "react";
import '../css/Register.css'; 

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        
        if (this.state.password !== this.state.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', { 
                                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Registration successful!');
                console.log(data);
            } else {
                alert('Registration failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again.');
        }
    }

    render() {
        return (
            <div className='register'>
                <form onSubmit={this.handleSubmit}>
                <h2>Register Form</h2>
                <hr></hr>
                    <div className='form-group name'>
                        <label htmlFor='username'>Username</label>
                        <input className='regi us' type='text' id='username' name='username' onChange={this.handleChange} />
                    </div>
                    <div className='form-group email'>
                        <label htmlFor='email'>Email</label>
                        <input className='regi' type='email' id='email' name='email' onChange={this.handleChange} />
                    </div>
                    <div className='form-group password'>
                        <label htmlFor='password'>Password</label>
                        <input className='regi' type='password' id='password' name='password' onChange={this.handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='confirmPassword confirm'>Confirm Password</label>
                        <input className='regi' type='password' id='confirmPassword' name='confirmPassword' onChange={this.handleChange} />
                    </div>
                    <button type='submit'>Register</button>
                </form>
            </div>
        );
    }
}
export default Register;
