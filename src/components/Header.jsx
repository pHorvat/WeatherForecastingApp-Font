// src/components/Header.jsx
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext'; // Adjust the import path as required

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        flexGrow: 1,
        cursor: 'pointer', // Change cursor to indicate it's clickable
    },
}));

const Header = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Box onClick={handleHomeClick} className={classes.title}>
                    <Typography variant="h6">
                        Weather App
                    </Typography>
                </Box>
                <Box>
                    {user && (
                        <>
                            <Button color="inherit" onClick={handleProfileClick}>
                                {user.username}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;