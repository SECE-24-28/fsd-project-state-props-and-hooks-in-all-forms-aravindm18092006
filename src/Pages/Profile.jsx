import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid, Button,
  TextField, Tabs, Tab, Alert, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, clearAuthData, saveAuthData, getStoredUser } from '../api/authApi';

const emptyAddress = { label: '', street: '', city: '', state: '', pincode: '', phone: '' };

const Profile = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', password: '' });

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [defaultAddressIdx, setDefaultAddressIdx] = useState(0);
  const [addressDialog, setAddressDialog] = useState(false);
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { navigate('/login'); return; }
    setProfileData({ name: user.name || '', email: user.email || '', phone: user.phone || '', password: '' });

    // Load addresses from localStorage (keyed by user id)
    try {
      const saved = localStorage.getItem(`groceriaAddresses_${user._id}`);
      const savedDefault = localStorage.getItem(`groceriaDefaultAddress_${user._id}`);
      if (saved) setAddresses(JSON.parse(saved));
      if (savedDefault !== null) setDefaultAddressIdx(parseInt(savedDefault));
    } catch (_) {}
  }, [navigate]);

  const persistAddresses = (list, defIdx) => {
    const user = getStoredUser();
    if (!user) return;
    localStorage.setItem(`groceriaAddresses_${user._id}`, JSON.stringify(list));
    localStorage.setItem(`groceriaDefaultAddress_${user._id}`, String(defIdx));
  };

  // Profile handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true); setErrorMessage(''); setSuccessMessage('');
    try {
      const payload = { name: profileData.name, phone: profileData.phone };
      if (profileData.password.trim()) payload.password = profileData.password;
      const response = await updateUserProfile(payload);
      if (response.success) {
        saveAuthData(response.data);
        setSuccessMessage('Profile updated successfully!');
        setEditMode(false);
        setProfileData((prev) => ({ ...prev, password: '' }));
      } else {
        setErrorMessage(response.message || 'Profile update failed');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { clearAuthData(); navigate('/login'); };

  // Address handlers
  const openAddAddress = () => {
    setEditingAddressIdx(null);
    setAddressForm(emptyAddress);
    setAddressError('');
    setAddressDialog(true);
  };

  const openEditAddress = (idx) => {
    setEditingAddressIdx(idx);
    setAddressForm({ ...addresses[idx] });
    setAddressError('');
    setAddressDialog(true);
  };

  const handleDeleteAddress = (idx) => {
    const updated = addresses.filter((_, i) => i !== idx);
    const newDefault = defaultAddressIdx >= updated.length ? Math.max(0, updated.length - 1) : defaultAddressIdx;
    setAddresses(updated);
    setDefaultAddressIdx(newDefault);
    persistAddresses(updated, newDefault);
  };

  const handleSetDefault = (idx) => {
    setDefaultAddressIdx(idx);
    persistAddresses(addresses, idx);
  };

  const handleSaveAddress = () => {
    if (!addressForm.street.trim() || !addressForm.city.trim() || !addressForm.pincode.trim()) {
      setAddressError('Street, City and Pincode are required.');
      return;
    }
    let updated;
    if (editingAddressIdx !== null) {
      updated = addresses.map((a, i) => i === editingAddressIdx ? { ...addressForm } : a);
    } else {
      updated = [...addresses, { ...addressForm }];
    }
    const newDefault = addresses.length === 0 ? 0 : defaultAddressIdx;
    setAddresses(updated);
    setDefaultAddressIdx(newDefault);
    persistAddresses(updated, newDefault);
    setAddressDialog(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>👤 My Profile</Typography>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: '5rem', mb: 2 }}>👤</Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>{profileData.name || 'Loading...'}</Typography>
                <Typography variant="body2" sx={{ color: '#556b8c', mb: 1 }}>{profileData.email}</Typography>
                {getStoredUser()?.role === 'admin' && (
                  <Chip label="Admin" color="success" size="small" sx={{ mb: 2 }} />
                )}
                <Button variant="contained" fullWidth
                  onClick={() => { setEditMode(!editMode); setErrorMessage(''); setSuccessMessage(''); }}
                  disabled={loading} sx={{ mb: 1.5 }}>
                  {editMode ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
                <Button variant="outlined" color="warning" fullWidth onClick={handleLogout}>Logout</Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabs */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                  <Tab label="Personal Info" />
                  <Tab label="Addresses" />
                  <Tab label="Security" />
                </Tabs>

                {successMessage && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
                {errorMessage && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}

                {/* Tab 0 — Personal Info */}
                {tabValue === 0 && (
                  <Box>
                    <TextField fullWidth label="Full Name" name="name" value={profileData.name}
                      onChange={handleInputChange} disabled={!editMode} margin="normal" />
                    <TextField fullWidth label="Email (Cannot be modified)" name="email"
                      value={profileData.email} disabled margin="normal"
                      helperText="Contact support to change your registered email." />
                    <TextField fullWidth label="Phone Number" name="phone" value={profileData.phone}
                      onChange={handleInputChange} disabled={!editMode} margin="normal" />
                    {editMode && (
                      <TextField fullWidth label="New Password" name="password" type="password"
                        value={profileData.password} onChange={handleInputChange} margin="normal"
                        placeholder="Leave blank to keep current password"
                        helperText="Only fill this if you want to change your password." />
                    )}
                    {editMode && (
                      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button variant="contained" onClick={handleSaveProfile} disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outlined" onClick={() => { setEditMode(false); setErrorMessage(''); setSuccessMessage(''); }} disabled={loading}>
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Tab 1 — Addresses */}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>📍 Saved Addresses</Typography>
                      <Button variant="contained" startIcon={<AddLocationAltIcon />} onClick={openAddAddress} size="small">
                        Add Address
                      </Button>
                    </Box>

                    {addresses.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 5, border: '2px dashed #b0c4de', borderRadius: 2 }}>
                        <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>📭</Typography>
                        <Typography sx={{ color: '#556b8c', mb: 2 }}>No saved addresses yet.</Typography>
                        <Button variant="outlined" startIcon={<AddLocationAltIcon />} onClick={openAddAddress}>
                          Add Your First Address
                        </Button>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {addresses.map((addr, idx) => (
                          <Grid item xs={12} key={idx}>
                            <Card variant="outlined" sx={{
                              border: idx === defaultAddressIdx ? '2px solid #1976d2' : '1px solid #e0e0e0',
                              borderRadius: 2,
                            }}>
                              <CardContent sx={{ pb: '16px !important' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                      {addr.label && (
                                        <Chip label={addr.label} size="small" color="primary" variant="outlined" />
                                      )}
                                      {idx === defaultAddressIdx && (
                                        <Chip label="Default" size="small" color="success" />
                                      )}
                                    </Box>
                                    <Typography sx={{ fontWeight: 600, color: '#12254a' }}>{addr.street}</Typography>
                                    <Typography variant="body2" sx={{ color: '#556b8c' }}>
                                      {addr.city}{addr.state ? `, ${addr.state}` : ''} — {addr.pincode}
                                    </Typography>
                                    {addr.phone && (
                                      <Typography variant="body2" sx={{ color: '#556b8c' }}>📞 {addr.phone}</Typography>
                                    )}
                                  </Box>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                    <IconButton size="small" onClick={() => handleSetDefault(idx)} title="Set as default"
                                      sx={{ color: idx === defaultAddressIdx ? '#1976d2' : '#aaa' }}>
                                      {idx === defaultAddressIdx ? <StarIcon /> : <StarBorderIcon />}
                                    </IconButton>
                                    <IconButton size="small" onClick={() => openEditAddress(idx)} sx={{ color: '#1976d2' }}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteAddress(idx)} sx={{ color: 'error.main' }}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}

                {/* Tab 2 — Security */}
                {tabValue === 2 && (
                  <Box sx={{ py: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>🔐 Account Security</Typography>
                    <Typography variant="body2" sx={{ color: '#556b8c', mb: 3 }}>
                      Manage your password and session.
                    </Typography>
                    <Button variant="outlined" sx={{ mb: 2, mr: 2 }}
                      onClick={() => { setTabValue(0); setEditMode(true); }}>
                      Change Password
                    </Button>
                    <Button variant="outlined" color="warning" sx={{ mb: 2, mr: 2 }} onClick={handleLogout}>
                      Logout Session
                    </Button>
                    <Button variant="outlined" color="error" sx={{ mb: 2 }}
                      onClick={() => alert('Account deletion requires contacting administrator.')}>
                      Delete Account
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Add / Edit Address Dialog */}
      <Dialog open={addressDialog} onClose={() => setAddressDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingAddressIdx !== null ? '✏️ Edit Address' : '📍 Add New Address'}
        </DialogTitle>
        <DialogContent dividers>
          {addressError && <Alert severity="error" sx={{ mb: 2 }}>{addressError}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Address Label (e.g. Home, Work)" value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                margin="dense" placeholder="Home" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Street Address *" value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                margin="dense" placeholder="Door No, Street, Area" multiline rows={2} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City *" value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="State" value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="PIN Code *" value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                margin="dense" placeholder="Optional" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddressDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress}>
            {editingAddressIdx !== null ? 'Update Address' : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
