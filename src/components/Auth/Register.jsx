import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4449/auth/register', formData);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Container>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <TextField
                    label="Name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Surname"
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
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
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Register
                </Button>
                <Link component="button" variant="body2" onClick={handleLoginRedirect}>
                    Login
                </Link>
            </Box>
        </Container>
    );
};

export default Register;