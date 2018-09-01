import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            message: '',
        };
    }

    registerUser = (event) => {
        event.preventDefault();

        if (this.state.username === '' || this.state.password === '') {
            this.setState({
                message: 'Enter a username and password!',
            });
        } else {
            const body = {
                username: this.state.username,
                password: this.state.password,
            };

            axios.post('/api/user/register/', body)
                .then((response) => {
                    if (response.status === 201) {
                        this.props.history.push('/home');
                    } else {
                        this.setState({
                            message: 'Try again! That username might already be taken!',
                        });
                    }
                })
                .catch(() => {
                    this.setState({
                        message: 'Uh oh! Something went wrong!',
                    });
                });
        }
    }

    handleInputChangeFor = propertyName => (event) => {
        this.setState({
            [propertyName]: event.target.value,
        });
    }

    renderAlert() {
        if (this.state.message !== '') {
            return (
                <h2
                    className="alert"
                    role="alert"
                >
                    {this.state.message}
                </h2>
            );
        }
        return (<span />);
    }
    
    render() {
        return (
            <div>
                {this.renderAlert()}
                <form onSubmit={this.registerUser}>
                    <h1>Register here!</h1>
                    <div>
                        <label htmlFor="username">
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChangeFor('username')}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="password">
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChangeFor('password')}
                            />
                        </label>
                    </div>
                    <div>
                        <input
                            type="submit"
                            name="submit"
                            value="Register"
                        />
                        <Link to="/home">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default RegisterPage;