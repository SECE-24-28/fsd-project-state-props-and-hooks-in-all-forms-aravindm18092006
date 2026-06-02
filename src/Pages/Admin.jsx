import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Alert,
} from '@mui/material';

const STORAGE_KEYS = {
  users: 'groceriaUsers',
  loginHistory: 'groceriaLoginHistory',
  contactMessages: 'groceriaContactMessages',
  currentUser: 'groceriaCurrentUser',
};

const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [logins, setLogins] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const refreshDashboard = () => {
    setUsers(loadFromStorage(STORAGE_KEYS.users));
    setLogins(loadFromStorage(STORAGE_KEYS.loginHistory));
    setMessages(loadFromStorage(STORAGE_KEYS.contactMessages));
    const activeUser = localStorage.getItem(STORAGE_KEYS.currentUser);
    setCurrentUser(activeUser ? JSON.parse(activeUser) : null);
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Users', value: users.length },
      { label: 'Total Logins', value: logins.length },
      { label: 'Contact Messages', value: messages.length },
      { label: 'Active Session', value: currentUser ? 'Yes' : 'No' },
    ],
    [users.length, logins.length, messages.length, currentUser]
  );

  const clearSection = (key, sectionName) => {
    localStorage.removeItem(key);
    if (key === STORAGE_KEYS.currentUser) {
      setCurrentUser(null);
    }
    refreshDashboard();
    setStatusMessage(`${sectionName} data cleared successfully.`);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, color: '#1976d2' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#556b8c' }}>
          Manage users, login activity, and contact messages from one place.
        </Typography>

        {statusMessage && <Alert severity="success" sx={{ mb: 3 }}>{statusMessage}</Alert>}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.label}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: '#556b8c' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Registered Users</Typography>
                  <Button size="small" color="error" onClick={() => clearSection(STORAGE_KEYS.users, 'Users')}>
                    Clear
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {users.length === 0 ? (
                  <Typography sx={{ color: '#556b8c' }}>No users found.</Typography>
                ) : (
                  users.map((user, index) => (
                    <Box key={`${user.email}-${index}`} sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#556b8c' }}>{user.email}</Typography>
                      <Typography variant="body2" sx={{ color: '#556b8c' }}>{user.phone}</Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Login Activity</Typography>
                  <Button size="small" color="error" onClick={() => clearSection(STORAGE_KEYS.loginHistory, 'Login activity')}>
                    Clear
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {logins.length === 0 ? (
                  <Typography sx={{ color: '#556b8c' }}>No login records found.</Typography>
                ) : (
                  logins.slice().reverse().map((item, index) => (
                    <Box key={`${item.email}-${index}`} sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 600 }}>{item.email}</Typography>
                      <Typography variant="body2" sx={{ color: '#556b8c' }}>
                        {new Date(item.loginAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Contact Messages</Typography>
                  <Button size="small" color="error" onClick={() => clearSection(STORAGE_KEYS.contactMessages, 'Contact messages')}>
                    Clear
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {messages.length === 0 ? (
                  <Typography sx={{ color: '#556b8c' }}>No contact messages yet.</Typography>
                ) : (
                  messages.slice().reverse().map((msg, index) => (
                    <Box key={`${msg.email}-${msg.createdAt}-${index}`} sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {msg.name} ({msg.email})
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#556b8c', mb: 0.5 }}>
                        Subject: {msg.subject}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#12254a' }}>{msg.message}</Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Admin;
