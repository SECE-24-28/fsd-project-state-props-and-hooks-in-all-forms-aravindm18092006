import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, clearAuthData, saveAuthData, getStoredUser } from '../api/authApi';

const Profile = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate('/login');
    } else {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        password: '',
      });
    }
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
      };
      if (profileData.password.trim()) {
        payload.password = profileData.password;
      }

      const response = await updateUserProfile(payload);

      if (response.success) {
        saveAuthData(response.data);
        setSuccessMessage('Profile updated successfully!');
        setEditMode(false);
        setProfileData(prev => ({ ...prev, password: '' }));
      } else {
        setErrorMessage(response.message || 'Profile update failed');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          👤 My Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: '5rem', mb: 2 }}>👤</Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {profileData.name || 'Loading...'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#556b8c', mb: 3 }}>
                  {profileData.email}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setEditMode(!editMode);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  disabled={loading}
                >
                  {editMode ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="Personal Info" />
                  <Tab label="Address" />
                  <Tab label="Settings & Security" />
                </Tabs>

                {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
                {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

                {tabValue === 0 && (
                  <Box>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Email (Cannot be modified)"
                      name="email"
                      value={profileData.email}
                      disabled
                      margin="normal"
                      helperText="Please contact support to change your registered email address."
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                    />
                    {editMode && (
                      <TextField
                        fullWidth
                        label="New Password"
                        name="password"
                        type="password"
                        value={profileData.password}
                        onChange={handleInputChange}
                        margin="normal"
                        placeholder="Leave blank to keep current password"
                        helperText="Provide a new password if you want to update it."
                      />
                    )}
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <TextField
                      fullWidth
                      label="Delivery Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                      multiline
                      rows={4}
                      placeholder="Enter your default home or work address for grocery delivery."
                    />
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box sx={{ py: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      🔐 Account Security
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#556b8c', mb: 3 }}>
                      Manage your password settings and authenticate sessions.
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mb: 2, mr: 2 }}
                      onClick={() => {
                        setTabValue(0);
                        setEditMode(true);
                      }}
                    >
                      Change Password
                    </Button>
                    <Button variant="outlined" color="warning" sx={{ mb: 2, mr: 2 }} onClick={handleLogout}>
                      Logout Session
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mb: 2 }}
                      onClick={() => alert('Account deletion requires contacting administrator.')}
                    >
                      Delete Account
                    </Button>
                  </Box>
                )}

                {editMode && tabValue !== 2 && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleSaveProfile} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditMode(false);
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
