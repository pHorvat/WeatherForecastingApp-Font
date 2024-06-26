import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, Paper, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
    sidebar: {
        height: 'calc(100vh - 64px)',
        width: '300px',
        marginTop: '64px',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0px 3px 6px #00000029',
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
        margin: '16px',
        padding: '16px',
        cursor: 'pointer',
    },
    selectedCard: {
        border: '2px solid #007BFF'
    },
    dropdownContainer: {
        margin: '16px',
        display: 'flex',
        justifyContent: 'center',
    },
    dropdown: {
        width: '100%',
    },
});

const Sidebar = ({ onSelectCity, userLocationId }) => {
    const classes = useStyles();
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const { t } = useTranslation();

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

                // Extract countries from the locations
                const uniqueCountries = [
                    ...new Set(citiesWithWeather.map(city => city.country))
                ];
                setCountries(uniqueCountries);
            } catch (error) {
                console.error('Error fetching locations or weather data:', error);
            }
        };

        fetchCitiesData();
    }, []);

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const filteredCities = selectedCountry
        ? cities.filter(city => city.country === selectedCountry)
        : cities;

    return (
        <Box className={classes.sidebar}>
            <Box className={classes.dropdownContainer}>
                <FormControl className={classes.dropdown}>
                    <InputLabel>{t('country')}</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        label={t('country')}
                    >
                        <MenuItem value="">
                            <em>{t('all_cities')}</em>
                        </MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country} value={country}>
                                {country}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <List>
                {filteredCities.map((city) => (
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
                                        ? `${city.weather.temperature}°C - ${t(city.weather.condition_code)}`
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
