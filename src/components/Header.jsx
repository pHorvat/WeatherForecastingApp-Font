import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher.jsx"; // Adjust the import path as required

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
        console.log(user);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="fixed" style={{ zIndex: 1201 }}>
            <Toolbar>
                <Box onClick={handleHomeClick} style={{ flexGrow: 1, cursor: 'pointer' }}>
                    <Typography variant="h6">
                        Weather App
                    </Typography>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageSwitcher style={{ marginRight: '16px' }} />
                    {user && (
                        <>
                            {user.roles.includes('ROLE_ADMIN') &&
                                <Button color="inherit" onClick={handleDashboardClick} style={{ marginRight: '8px' }}>
                                    {t('dashboard')}
                                </Button>
                            }
                            <Button color="inherit" onClick={handleProfileClick} style={{ marginRight: '8px' }}>
                                {user.username}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                {t('logout')}
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
