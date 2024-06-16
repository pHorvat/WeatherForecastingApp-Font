import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Select, MenuItem, Box, InputLabel, FormControl } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        background: 'url(/path/to/your/background.jpg) no-repeat center center fixed',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
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
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 120,
    },
    button: {
        margin: theme.spacing(2, 0),
    },
    weatherIcon: {
        fontSize: 100,
    },
}));

const Home = () => {
    const classes = useStyles();
    const [userLocation, setUserLocation] = useState(null);
    const [locations, setLocations] = useState([]);
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
                setUserLocation(userResponse.data.location_id);
                const weatherResponse = await axios.get(`http://localhost:4449/weather/last/${userResponse.data.location_id.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWeatherData(weatherResponse.data);
            }

            const locationsResponse = await axios.get('http://localhost:4449/locations', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLocations(locationsResponse.data);
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

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'PPPpp'); // Customize the format string if required
    };

    return (
        <div className={classes.root}>
            <Container className={classes.card}>
                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                    <InputLabel>Select a City...</InputLabel>
                    <Select value={selectedLocation} onChange={handleLocationChange} label="Select a City...">
                        {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                                {location.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {weatherData && (
                    <Box textAlign="center" my={4}>
                        <Typography variant="h3">{weatherData.city}</Typography>
                        <Typography variant="h4">{weatherData.temperature}°C</Typography>
                        <Typography variant="h6">{weatherData.conditions}</Typography>
                        <i className={`wi wi-day-sunny ${classes.weatherIcon}`}></i>
                        <Typography variant="h6">{formatTimestamp(weatherData.timestamp)}</Typography>
                    </Box>
                )}
                <Button variant="contained" color="primary" onClick={handleUpdateLocation} className={classes.button} fullWidth>
                    Update Location
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleLogout} className={classes.button} fullWidth>
                    Logout
                </Button>
            </Container>
        </div>
    );
};

export default Home;