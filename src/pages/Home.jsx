import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import Sidebar from '../components/Location/Sidebar';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
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
        margin: theme.spacing(2, 0),
    },
    weatherIcon: {
        fontSize: 100,
    },
    forecastContainer: {
        display: 'flex',
        padding: theme.spacing(2, 0),
    },
    forecastBox: {
        minWidth: 150,
        marginRight: theme.spacing(2),
        padding: theme.spacing(2),
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'left',
    },
}));

const Home = () => {
    const classes = useStyles();
    const [userLocation, setUserLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                await fetchForecastData(location.id); // Fetch forecast data after setting user location
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

    const fetchForecastData = async (locationId, days = 5) => {
        const token = localStorage.getItem('token');
        try {
            const forecastResponse = await axios.get(`http://localhost:4449/forecasts/next/${locationId}/${days}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForecastData(forecastResponse.data);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
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
            await fetchForecastData(locationId); // Fetch forecast data for the new location
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
                            <Typography variant="h6">{weatherData.condition_code}</Typography>
                            <i className={`wi wi-day-sunny ${classes.weatherIcon}`}></i>
                            <Typography variant="h6">{formatTimestamp(weatherData.timestamp)}</Typography>
                        </Box>
                    )}
                    {forecastData.length > 0 && (
                        <Box textAlign="center" my={4}>
                            <Typography variant="h4" gutterBottom>Forecast</Typography>
                            <Box className={classes.forecastContainer}>
                                {forecastData.map((forecast) => (
                                    <Box key={forecast.id} className={classes.forecastBox}>
                                        <Typography >{format(new Date(forecast.forecast_date), 'PPP')}</Typography>
                                        <Typography >Max Temp: {forecast.temp_max}°C</Typography>
                                        <Typography >Min Temp: {forecast.temp_min}°C</Typography>
                                        <Typography >Chance of Rain: {forecast.chance_of_rain}%</Typography>
                                        <Typography >Conditions: {forecast.conditions}</Typography>
                                        <Typography >Conditions code: {forecast.condition_code}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    {selectedLocation && selectedLocation !== userLocation?.id && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateLocation}
                            className={classes.button}
                            fullWidth>
                            Set My Location
                        </Button>
                    )}
                </Container>
            </div>
        </>
    );
};

export default Home;