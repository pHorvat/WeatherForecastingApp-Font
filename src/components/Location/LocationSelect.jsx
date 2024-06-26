import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Box,
    FormControl,
    InputLabel,
} from '@mui/material';
import {useTranslation} from "react-i18next";

const LocationSelect = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4449/locations', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLocations(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching locations:', error);
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    };

    const handleLocationSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:4449/users/updateLocation/${selectedLocation}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('location_selection')}
                </Typography>
                <Typography variant="subtitle" gutterBottom>
                    {t('location_selection_subtitle')}
                </Typography>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box mt={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="location-select-label">{t('select_location')}</InputLabel>
                            <Select
                                labelId="location-select-label"
                                value={selectedLocation}
                                onChange={handleLocationChange}
                                label={t('location_selection_subtitle')}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.name}, {location.country}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLocationSubmit}
                                disabled={!selectedLocation}
                            >
                                {t('save')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default LocationSelect;
