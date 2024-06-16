// LocationPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LocationSelect = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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
                // Handle error (e.g., show error message to user)
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
            alert('Location updated successfully!');
            navigate('/');
            // Optionally, redirect or perform any other action after location update
        } catch (error) {
            console.error('Error updating location:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <div>
            <h1>Location Selection Page</h1>
            {isLoading ? (
                <p>Loading locations...</p>
            ) : (
                <>
                    <select value={selectedLocation} onChange={handleLocationChange}>
                        <option value="">Select Location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}, {location.country}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleLocationSubmit}>Submit</button>
                </>
            )}
        </div>
    );
};

export default LocationSelect;
