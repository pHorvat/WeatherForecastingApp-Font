// src/components/Location/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    sidebar: {
        height: 'calc(100vh - 64px)', // Adjust height to account for header
        width: '300px',
        marginTop: '64px', // Push down below header
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: theme.shadows[5],
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
    },
    cityCard: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        cursor: 'pointer',
    },
    selectedCard: {
        border: '2px solid #007BFF'
    },
}));

const Sidebar = ({ onSelectCity, userLocationId }) => {
    const classes = useStyles();
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCitiesData = async () => {
            const token = localStorage.getItem('token');
            try {
                const locationsResponse = await axios.get('http://localhost:4449/locations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const locations = locationsResponse.data;

                const weatherPromises = locations.map((location) =>
                    axios.get(`http://localhost:4449/weather/last/${location.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((response) => {
                        return { ...location, weather: response.data };
                    })
                );

                const citiesWithWeather = await Promise.all(weatherPromises);
                setCities(citiesWithWeather);
            } catch (error) {
                console.error('Error fetching locations or weather data:', error);
            }
        };

        fetchCitiesData();
    }, []);

    return (
        <Box className={classes.sidebar}>
            <List>
                {cities.map((city) => (
                    <Paper
                        key={city.id}
                        className={`${classes.cityCard} ${userLocationId === city.id ? classes.selectedCard : ''}`}
                        onClick={() => onSelectCity(city.id)}
                        elevation={3}
                    >
                        <ListItem>
                            <ListItemText
                                primary={city.name}
                                secondary={
                                    city.weather
                                        ? `${city.weather.temperature}°C - ${city.weather.conditions}`
                                        : 'Loading...'
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;