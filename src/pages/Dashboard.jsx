import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Divider,
    AppBar,
    Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGear} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
        marginTop: '64px'
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2, 0),
    },
    header: {
        flexGrow: 1,
    },
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: 24,
        padding: theme.spacing(4),
    },
    logoutButton: {
        marginLeft: 'auto',
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [locationName, setLocationName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [country, setCountry] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:4449/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                toast.error(`Error fetching users: ${error.message}`);
                console.error('Error fetching users:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4449/locations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const locationsData = response.data;
                setLocations(locationsData);

                const weatherData = {};
                await Promise.all(
                    locationsData.map(async location => {
                        try {
                            const weatherResponse = await axios.get(
                                `http://localhost:4449/weather/last/${location.id}`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                }
                            );
                            weatherData[location.id] = weatherResponse.data;
                        } catch (error) {
                            console.error(`Error fetching weather for location ${location.id}:`, error);
                        }
                    })
                );
                setWeather(weatherData);
            } catch (error) {
                toast.error(`Error fetching locations: ${error.message}`);
                console.error('Error fetching locations:', error);
            }
        };

        fetchUsers();
        fetchLocations();
    }, [navigate]);

    const handleDeleteUser = async userId => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4449/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.id !== userId));
            toast.success('User deleted successfully!');
        } catch (error) {
            toast.error(`Error deleting user: ${error.message}`);
            console.error(`Error deleting user ${userId}:`, error);
        }
    };

    const handleDeleteLocation = async locationId => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4449/locations/delete/${locationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLocations(locations.filter(location => location.id !== locationId));
            toast.success('Location deleted successfully!');
        } catch (error) {
            toast.error(`Error deleting location: ${error.message}`);
            console.error(`Error deleting location ${locationId}:`, error);
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
        setIsEditing(false);
        setName('');
        setSurname('');
        setPassword('');
        setUsername('');
        setEmail('');
    };

    const handleOpenEditModal = user => {
        setModalOpen(true);
        setIsEditing(true);
        setSelectedUserId(user.id);
        setName(user.name);
        setSurname(user.lastName);
        setUsername(user.username);
        setEmail(user.email);
        setPassword('');
    };

    const handleOpenLocationModal = () => {
        setLocationModalOpen(true);
        setIsEditing(false);
        setLocationName('');
        setLatitude('');
        setLongitude('');
        setCountry('');
    };

    const handleOpenEditLocationModal = location => {
        setLocationModalOpen(true);
        setIsEditing(true);
        setSelectedLocationId(location.id);
        setLocationName(location.name);
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        setCountry(location.country);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCloseLocationModal = () => {
        setLocationModalOpen(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                const updatedUser = { name, surname, username, email };
                if (password) updatedUser.password = password;
                await axios.put(`http://localhost:4449/users/${selectedUserId}`, updatedUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(users.map(user => user.id === selectedUserId ? { ...user, ...updatedUser } : user));
                toast.success('User updated successfully!');
            } else {
                const newUser = { name, surname, password, username, email, isAdmin: 1 };
                const response = await axios.post('http://localhost:4449/auth/register', newUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers([...users, response.data]);

                toast.success('User added successfully!');
            }
            setModalOpen(false);
            setName('');
            setSurname('');
            setPassword('');
            setUsername('');
            setEmail('');
        } catch (error) {
            toast.error(isEditing ? `Error updating user: ${error.message}` : `Error adding user: ${error.message}`);
            console.error(isEditing ? 'Error updating user' : 'Error adding new user', error);
        }
    };

    const handleLocationSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                const updatedLocation = { name: locationName, latitude, longitude, country };
                await axios.put(`http://localhost:4449/locations/update/${selectedLocationId}`, updatedLocation, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLocations(locations.map(location => location.id === selectedLocationId ? { ...location, ...updatedLocation } : location));
                toast.success('Location updated successfully!');
            } else {
                const newLocation = { name: locationName, latitude, longitude, country };
                const response = await axios.post('http://localhost:4449/locations/create', newLocation, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLocations([...locations, response.data]);
                toast.success('Location added successfully!');
            }
            setLocationModalOpen(false);
            setLocationName('');
            setLatitude('');
            setLongitude('');
            setCountry('');
        } catch (error) {
            toast.error(isEditing ? `Error updating location: ${error.message}` : `Error adding location: ${error.message}`);
            console.error(isEditing ? 'Error updating location' : 'Error adding new location', error);
        }
    };

    return (
        <div className={classes.root}>
            <ToastContainer />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.header}>
                        {t('dashboard')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Paper className={classes.paper}>
                <Typography variant="h5">{t('user_information')}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                >
                    {t('add_admin')}
                </Button>
                <List>
                    {users.map(user => (
                        <React.Fragment key={user.id}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <>
                                            {`${user.name} ${user.lastName} - ${t('username')}: ${user.username} `}
                                            {user.roles.includes('ROLE_ADMIN') && <FontAwesomeIcon icon={faUserGear} />}
                                        </>
                                    }                                    secondary={`${t('email')}: ${user.email} - ${t('location')}: ${user.location_id?.name}, ${user.location_id?.country}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditModal(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Paper className={classes.paper}>
                <Typography variant="h5">{t('locations_weather')}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenLocationModal}
                >
                    {t('add_location')}
                </Button>
                <List>
                    {locations.map(location => (
                        <React.Fragment key={location.id}>
                            <ListItem>
                                <ListItemText
                                    primary={location.name}
                                    secondary={`
                                        ${t('latitude')}: ${location.latitude}, ${t('longitude')}: ${location.longitude}, ${t('country')}: ${location.country}
                                        ${
                                        weather[location.id]
                                            ? `${t('weather')}: ${t('temperature')}: ${weather[location.id].temperature}°C, ${t('humidity')}: ${weather[location.id].humidity}%, ${t('precipitation')}: ${weather[location.id].precipitation}mm, ${t('conditions')}: ${t(weather[location.id].condition_code)} `
                                            : ''
                                    }
                                    `}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditLocationModal(location)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteLocation(location.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box className={classes.modalBox}>
                    <Typography variant="h6" component="h2">
                        {isEditing ? t('edit_user') : t('add_admin')}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            label={t('name')}
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label={t('last_name')}
                            variant="outlined"
                            fullWidth
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                        />
                        {!isEditing &&
                            <TextField
                                margin="normal"
                                label={t('password')}
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />}
                        <TextField
                            margin="normal"
                            label={t('username')}
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label={t('email')}
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {isEditing ? t("save_changes") : t('add_admin_user')}
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Modal open={locationModalOpen} onClose={handleCloseLocationModal}>
                <Box className={classes.modalBox}>
                    <Typography variant="h6" component="h2">
                        {isEditing ? t('edit_location') : t('add_location')}
                    </Typography>
                    <form onSubmit={handleLocationSubmit}>
                        <TextField
                            margin="normal"
                            label={t('location_name')}
                            variant="outlined"
                            fullWidth
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label={t("latitude")}
                            variant="outlined"
                            fullWidth
                            value={latitude}
                            onChange={e => setLatitude(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label={t("longitude")}
                            variant="outlined"
                            fullWidth
                            value={longitude}
                            onChange={e => setLongitude(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label={t('country')}
                            variant="outlined"
                            fullWidth
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {isEditing ? t('edit_location') : t('save_changes')}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Dashboard;
