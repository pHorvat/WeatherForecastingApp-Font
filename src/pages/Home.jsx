// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import Sidebar from '../components/Location/Sidebar';
import {useNavigate} from "react-router-dom"; // Adjust the import path as required.

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        background: 'url(/path/to/your/background.jpg) no-repeat center center fixed',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
        marginLeft: '300px', // Reserve space for sidebar
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '15px',
        padding: theme.spacing(4),
        maxWidth: 600,
        width: '100%',
        boxShadow: theme.shadows[5],
        textAlign: 'center',
    },
    button: {
        margin: theme.spacing(2 , 0),
    },
    weatherIcon: {
        fontSize: 100,
    },
}));

const Home = () => {
    const classes = useStyles();
    const [userLocation, setUserLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('');
    const navigate = useNavigate();

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        try {
            const userResponse = await axios.get('http://localhost:4449/users/current', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!userResponse.data.location_id) {
                navigate('/location-select');
            } else {
                const location = userResponse.data.location_id;
                setUserLocation(location);
                const weatherResponse = await axios.get(`http://localhost:4449/weather/last/${location.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWeatherData(weatherResponse.data);
            }
        } catch (error) {
            navigate('/login');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [navigate]);

    const handleUpdateLocation = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:4449/users/updateLocation/${selectedLocation}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchUserData();
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'PPPpp'); // Customize the format string if required
    };

    const handleSelectCity = (locationId) => {
        setSelectedLocation(locationId);
        fetchWeatherData(locationId);
    };

    const fetchWeatherData = async (locationId) => {
        const token = localStorage.getItem('token');
        try {
            const weatherResponse = await axios.get(`http://localhost:4449/weather/last/${locationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWeatherData(weatherResponse.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <>
            <Sidebar onSelectCity={handleSelectCity} userLocationId={userLocation?.id} />
            <div className={classes.root}>
                <Container className={classes.card}>
                    {weatherData && (
                        <Box textAlign="center" my={4}>
                            <Typography variant="h3">{weatherData.location.name}</Typography>
                            <Typography variant="h4">{weatherData.temperature}°C</Typography>
                            <Typography variant="h6">{weatherData.conditions}</Typography>
                            <i className={`wi wi-day-sunny ${classes.weatherIcon}`}></i>
                            <Typography variant="h6">{formatTimestamp(weatherData.timestamp)}</Typography>
                        </Box>
                    )}
                    {selectedLocation && selectedLocation !== userLocation?.id && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateLocation}
                            className={classes.button}
                            fullWidth
                        >
                            Update Location
                        </Button>
                    )}
                </Container>
            </div>
        </>
    );
};

export default Home;