import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, CardActions, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { AuthContext } from '../components/Auth/AuthContext'; // Adjust the import path as required
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const { user, fetchUserData } = useContext(AuthContext);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        lastName: '',
        email: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleEditOpen = () => {
        if (user) {
            setEditFormData({
                name: user.name,
                lastName: user.lastName,
                email: user.email
            });
        }
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:4449/users/current', {
                name: editFormData.name,
                surname: editFormData.lastName, // Use `surname` instead of `lastName`
                username: user.username, // Assuming username should also be sent
                email: editFormData.email,
                password: user.password // Assuming password is required and unchanged
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchUserData();
            toast.success('Profile updated successfully');
            handleEditClose();
        } catch (error) {
            toast.error('Error updating profile');
            console.error('Edit error:', error);
        }
    };

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Container>
            <ToastContainer />
            <Box my={4}>
                <Typography variant="h4" gutterBottom>Profile</Typography>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h6">Username:</Typography>
                        <Typography variant="body1" gutterBottom>{user.username}</Typography>

                        <Typography variant="h6">Name:</Typography>
                        <Typography variant="body1" gutterBottom>{user.name} {user.lastName}</Typography>

                        <Typography variant="h6">Email:</Typography>
                        <Typography variant="body1" gutterBottom>{user.email}</Typography>

                        <Typography variant="h6">Location:</Typography>
                        <Typography variant="body1" gutterBottom>{user.location_id.name}, {user.location_id.country}</Typography>

                        <Typography variant="h6">Roles:</Typography>
                        <Typography variant="body1">{user.roles.join(', ')}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={handleEditOpen}>
                            Edit
                        </Button>
                    </CardActions>
                </Card>
            </Box>

            <Dialog open={editModalOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update your profile information below.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editFormData.name}
                        onChange={handleEditChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={editFormData.lastName}
                        onChange={handleEditChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editFormData.email}
                        onChange={handleEditChange}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Profile;