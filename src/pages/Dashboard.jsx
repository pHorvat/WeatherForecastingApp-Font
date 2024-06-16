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
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
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
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4449/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
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
                console.error('Error fetching locations:', error);
            }
        };

        fetchUsers();
        fetchLocations();
    }, []);

    const handleDeleteUser = async userId => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4449/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error(`Error deleting user ${userId}:`, error);
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const newUser = { name, surname, password, username, email, isAdmin: 1 };
            const response = await axios.post('http://localhost:4449/auth/register', newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers([...users, response.data]);
            setModalOpen(false);
            setName('');
            setSurname('');
            setPassword('');
            setUsername('');
            setEmail('');
        } catch (error) {
            console.error('Error adding new user:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.header}>
                        Dashboard
                    </Typography>
                    <Button color="inherit" className={classes.logoutButton} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Paper className={classes.paper}>
                <Typography variant="h5">Users Information</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                >
                    Add Admin User
                </Button>
                <List>
                    {users.map(user => (
                        <React.Fragment key={user.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`${user.name} ${user.lastName} - Username: ${user.username}`}
                                    secondary={`Email: ${user.email} - Location: ${user.location_id?.name}, ${user.location_id?.country}`}
                                />
                                <ListItemSecondaryAction>
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
                <Typography variant="h5">Locations and Weather</Typography>
                <List>
                    {locations.map(location => (
                        <React.Fragment key={location.id}>
                            <ListItem>
                                <ListItemText
                                    primary={location.name}
                                    secondary={`
                    Latitude: ${location.latitude}, Longitude: ${location.longitude}, Country: ${location.country}
                    ${
                                        weather[location.id]
                                            ? `Weather: Temperature: ${weather[location.id].temperature}°C, Humidity: ${weather[location.id].humidity}%, Precipitation: ${weather[location.id].precipitation}mm, Conditions: ${weather[location.id].conditions}`
                                            : ''
                                    }
                  `}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box className={classes.modalBox}>
                    <Typography variant="h6" component="h2">
                        Add New User
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label="Surname"
                            variant="outlined"
                            fullWidth
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Add User
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Dashboard;