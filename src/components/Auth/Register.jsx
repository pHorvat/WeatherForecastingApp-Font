import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import {toast, ToastContainer} from "react-toastify";
import {useTranslation} from "react-i18next";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        isAdmin: false,
    });

    const navigate = useNavigate();
    const { t } = useTranslation();

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
            toast.error(error.message)
            console.error('Registration error:', error);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Container>
            <ToastContainer/>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    {t("register")}
                </Typography>
                <TextField
                    label={t("name")}
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
                    label={t("last_name")}
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
                    label={t("username")}
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
                    label={t("email")}
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
                    {t("register")}
                </Button>
                <Link component="button" variant="body2" onClick={handleLoginRedirect}>
                    {t("login")}
                </Link>
            </Box>
        </Container>
    );
};

export default Register;