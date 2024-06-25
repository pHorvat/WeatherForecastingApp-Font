import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, CardActions, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AuthContext } from '../components/Auth/AuthContext'; // Adjust the import path as required
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles({
    profileCard: {
        position: 'relative',
        textAlign: 'center',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto',
    },
    avatar: {
        width: '150px',
        height: '150px',
        margin: '0 auto',
        border: '4px solid white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        top: '-75px',
        zIndex: 1,
    },
    cardContent: {
        paddingTop: '75px',
    },
    button: {
        marginTop: '20px',
    },
    icon: {
        marginRight: '10px',
    }
});

const Profile = () => {
    const { user, fetchUserData } = useContext(AuthContext);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', lastName: '', email: '', username: '' });
    const classes = useStyles();

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleEditOpen = () => {
        if (user) {
            setEditFormData({ name: user.name, lastName: user.lastName, email: user.email, username: user.username });
        }
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:4449/users/${user.id}`, {
                name: editFormData.name,
                surname: editFormData.lastName, // Use `surname` instead of `lastName`
                email: editFormData.email,
                username: editFormData.username
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
                <Card elevation={3} className={classes.profileCard}>
                    <CardContent className={classes.cardContent}>
                        <Typography variant="h4" gutterBottom>
                            <FontAwesomeIcon icon={faUser} className={classes.icon} /> {user.name} {user.lastName}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className={classes.icon} /> {user.location_id.name}, {user.location_id.country}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            <FontAwesomeIcon icon={faEnvelope} className={classes.icon} /> {user.email}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            <FontAwesomeIcon icon={faUserEdit} className={classes.icon} /> {user.roles.join(', ')}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.button}>
                        <Button size="large" color="primary" onClick={handleEditOpen}>
                            Edit Profile
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
                    <TextField
                        margin="dense"
                        id="username"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        value={editFormData.username}
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