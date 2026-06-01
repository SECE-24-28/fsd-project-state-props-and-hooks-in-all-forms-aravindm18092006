import React, { useState } from 'react';
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
} from '@mui/material';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Main St, City',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    alert('Profile updated successfully!');
    setEditMode(false);
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
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '4rem', mb: 2 }}>👤</Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {profileData.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#556b8c', mb: 3 }}>
                  {profileData.email}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="Personal Info" />
                  <Tab label="Address" />
                  <Tab label="Settings" />
                </Tabs>

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
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
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
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      🔐 Security & Settings
                    </Typography>
                    <Button variant="outlined" sx={{ mb: 2 }}>
                      Change Password
                    </Button>
                    <br />
                    <Button variant="outlined" color="warning" sx={{ mb: 2 }}>
                      Logout
                    </Button>
                    <br />
                    <Button variant="outlined" color="error">
                      Delete Account
                    </Button>
                  </Box>
                )}

                {editMode && tabValue === 0 && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" onClick={() => setEditMode(false)}>
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
