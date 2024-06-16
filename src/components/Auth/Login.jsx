import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4449/auth/login', formData);
            const { jwtToken, isAdmin } = response.data;
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('isAdmin', isAdmin);
            isAdmin ? navigate('/dashboard') : navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <Container>
            <Box component="form"  onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Username"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Login
                </Button>
                <Link component="button" variant="body2" onClick={handleRegisterRedirect}>
                    Register
                </Link>
            </Box>
        </Container>
    );
};

export default Login;