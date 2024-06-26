import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from './AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import {useTranslation} from "react-i18next";

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const { fetchUserData } = useContext(AuthContext);
    const { t } = useTranslation();

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
            await fetchUserData();
            isAdmin ? navigate('/dashboard') : navigate('/');
        } catch (error) {
            toast.error(error.message);
            console.error('Login error:', error);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <Container>
            <ToastContainer />
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    {t("login")}
                </Typography>
                <TextField
                    label={t('username')}
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
                    label={t("password")}
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
                    {t("login")}
                </Button>
                <Link component="button" variant="body2" onClick={handleRegisterRedirect}>
                    {t("register")}
                </Link>
            </Box>
        </Container>
    );
};

export default Login;