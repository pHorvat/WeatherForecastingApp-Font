import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import Sidebar from '../components/Location/Sidebar';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import ReactTimeAgo from "react-time-ago";
import i18n from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloudRain, faCloudSunRain, faTemperatureHigh, faTemperatureLow} from "@fortawesome/free-solid-svg-icons";
import backgroundImage from '../pexels-brett-sayles-1431822.jpg';

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
    const [langLocale, setLangLocale] = useState('en');

    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        //document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundRepeat = '';
        };
    }, []);

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
                await fetchForecastData(location.id);
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

    useEffect(() => {
        const handleLanguageChange = (lng) => {
            console.log("Language changed to:", lng);
            setLangLocale(lng);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    return (
        <>
            <Sidebar onSelectCity={handleSelectCity} userLocationId={userLocation?.id} />
            <div className={classes.root}>
                <Container className={classes.card}>
                    {weatherData && (
                        <Box textAlign="center" my={4}>
                            <Typography variant="h3">{weatherData.location.name}</Typography>
                            <Typography variant="h4">{weatherData.temperature}°C</Typography>
                            <Typography variant="h6">{t(weatherData.condition_code)}</Typography>
                            <ReactTimeAgo date={weatherData.timestamp} locale={langLocale}/>
                        </Box>
                    )}
                    {forecastData.length > 0 && (
                        <Box textAlign="center" my={4}>
                            <Typography variant="h4" gutterBottom>{t('forecast')}</Typography>
                            <Box className={classes.forecastContainer}>
                                {forecastData.map((forecast) => (
                                    <Box key={forecast.id} className={classes.forecastBox}>
                                        <Typography variant="h6" style={{textTransform: 'capitalize'}} >{new Date(forecast.forecast_date).toLocaleString(langLocale, { weekday: "long" })}</Typography>
                                        <Typography >{format(new Date(forecast.forecast_date), 'dd.M.yyyy.')}</Typography>
                                        <Typography ><FontAwesomeIcon icon={faTemperatureHigh} /> {forecast.temp_max}°C</Typography>
                                        <Typography ><FontAwesomeIcon icon={faTemperatureLow} /> {forecast.temp_min}°C</Typography>
                                        <Typography ><FontAwesomeIcon icon={faCloudRain} /> {forecast.chance_of_rain}%</Typography>
                                        <Typography ><FontAwesomeIcon icon={faCloudSunRain} /> {t(forecast.condition_code)}</Typography>
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
                            {t('set_my_location')}
                        </Button>
                    )}
                </Container>
            </div>
        </>
    );
};

export default Home;