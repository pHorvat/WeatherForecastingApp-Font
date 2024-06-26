import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await axios.get('http://localhost:4449/users/current', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, fetchUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};