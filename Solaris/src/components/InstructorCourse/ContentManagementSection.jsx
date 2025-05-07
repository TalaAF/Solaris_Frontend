import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ContentEditor from './ContentEditor';
import contentManagementData from './contentManagement.json';

const ContentManagementSection = () => {
  const [activeTab, setActiveTab] = useState('Lectures');
  const [contentItems, setContentItems] = useState({
    lectures: contentManagementData.lectures.map((item, idx) => ({ ...item, id: `lec-${idx}`, published: true })),
    labs: contentManagementData.labs.map((item, idx) => ({ ...item, id: `lab-${idx}`, published: true })),
    clinicalRotations: contentManagementData.clinicalRotations.map((item, idx) => ({ ...item, id: `clin-${idx}`, published: true })),
    tutorials: contentManagementData.tutorials.map((item, idx) => ({ ...item, id: `tut-${idx}`, published: true })),
    scheduledReleases: contentManagementData.scheduledReleases.map((item, idx) => ({ ...item, id: `sched-${idx}`, published: false })),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    type: '',
    title: '',
    description: '',
    supportingFiles: [],
    date: new Date().toISOString().split('T')[0],
    published: false,
    link: '',
  });

  const getContentKey = (tab) => {
    switch (tab) {
      case 'Lectures': return 'lectures';
      case 'Labs': return 'labs';
      case 'Clinical': return 'clinicalRotations';
      case 'Tutorials': return 'tutorials';
      default: return tab.toLowerCase().replace(' ', '');
    }
  };

  const handleAddContent = () => {
    if (!newContent.title || !newContent.type) return;

    const isValidFile = validateFiles(newContent.type, newContent.supportingFiles);
    if (!isValidFile.valid) {
      alert(isValidFile.message);
      return;
    }

    const updatedContent = { ...contentItems };
    const newItem = {
      ...newContent,
      id: `${newContent.type.toLowerCase().slice(0, 4)}-${Date.now()}`,
      uploadDate: newContent.date,
    };
    switch (newContent.type) {
      case 'Lecture':
        updatedContent.lectures.push(newItem);
        break;
      case 'Lab':
        updatedContent.labs.push(newItem);
        break;
      case 'Clinical Rotation':
        updatedContent.clinicalRotations.push(newItem);
        break;
      case 'Tutorial':
        updatedContent.tutorials.push(newItem);
        break;
      case 'Scheduled Release':
        updatedContent.scheduledReleases.push(newItem);
        break;
      default:
        break;
    }
    setContentItems(updatedContent);
    setNewContent({
      type: '',
      title: '',
      description: '',
      supportingFiles: [],
      date: new Date().toISOString().split('T')[0],
      published: false,
      link: '',
    });
    setAddModalOpen(false);
  };

  const validateFiles = (type, files) => {
    if (!files || files.length === 0) return { valid: true };
    const file = files[0];
    const validTypes = {
      Lecture: ['application/pdf', 'video/mp4'],
      Lab: ['application/pdf', 'video/mp4'],
      'Clinical Rotation': ['application/pdf', 'video/mp4'],
      Tutorial: ['application/pdf'],
      'Scheduled Release': [],
    };
    const acceptedTypes = validTypes[type] || [];
    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `Invalid file type. Accepted types for ${type} are: ${acceptedTypes.join(', ')}.`,
      };
    }
    return { valid: true };
  };

  const handleEditSave = (updatedItem) => {
    const updatedContent = { ...contentItems };
    const category = Object.keys(contentItems).find(cat =>
      updatedContent[cat].some(item => item.id === updatedItem.id)
    );
    updatedContent[category] = updatedContent[category].map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setContentItems(updatedContent);
    setEditItem(null);
  };

  const handleDelete = (item) => {
    const updatedContent = { ...contentItems };
    const category = Object.keys(contentItems).find(cat =>
      updatedContent[cat].some(i => i.id === item.id)
    );
    updatedContent[category] = updatedContent[category].filter(i => i.id !== item.id);
    setContentItems(updatedContent);
    setDeleteConfirm(null);
  };

  const contentKey = getContentKey(activeTab);
  const filteredItems = (contentItems[contentKey] || []).filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!dateFilter || item.uploadDate === dateFilter)
  );

  const handleExport = () => {
    const headers = ['Title', 'Type', 'Date'];
    const rows = filteredItems.map(item => [
      item.title,
      item.type || (item.toolName ? 'Interactive Tool' : item.releaseDate ? 'Scheduled Release' : ''),
      item.uploadDate || item.releaseDate || '',
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}_content.csv`;
    link.click();
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2, color: '#1976d2', textAlign: 'center' }}>
        Content Management
      </Typography>
      <Button
        variant="contained"
        onClick={() => setAddModalOpen(true)}
        sx={{ mb: 2, backgroundColor: '#FFC107', '&:hover': { backgroundColor: '#FFB300' }, color: '#fff' }}
      >
        + Add Content
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {['Lectures', 'Labs', 'Clinical', 'Tutorials'].map(tab => (
          <Grid item key={tab}>
            <Button
              variant={activeTab === tab ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(tab)}
              sx={{
                backgroundColor: activeTab === tab ? '#FFC107' : 'transparent',
                color: activeTab === tab ? '#fff' : '#1976d2',
                '&:hover': { backgroundColor: activeTab === tab ? '#FFB300' : '#e0e0e0' },
              }}
            >
              {tab}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Filter by Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                onClick={handleExport}
                sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' }, color: '#fff' }}
              >
                Export CSV
              </Button>
            </Grid>
          </Grid>

          {filteredItems.length > 0 ? filteredItems.map(item => (
            <Card key={item.id} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2">Type: {item.type || (item.toolName ? 'Interactive Tool' : item.releaseDate ? 'Scheduled Release' : '')}</Typography>
                <Typography variant="body2">Date: {item.uploadDate || item.releaseDate || ''}</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => setEditItem(item)}
                      sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, color: '#fff' }}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => setDeleteConfirm(item)}
                      sx={{ backgroundColor: '#ef4444', '&:hover': { backgroundColor: '#b91c1c' }, color: '#fff' }}
                    >
                      Delete
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => setViewItem(item)}
                      sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' }, color: '#fff' }}
                    >
                      View
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )) : (
            <Typography sx={{ color: '#666' }}>No content available.</Typography>
          )}
        </CardContent>
      </Card>

      {editItem && (
        <Dialog open={true} onClose={() => setEditItem(null)} maxWidth="md" fullWidth>
          <DialogTitle>Edit {editItem.type}</DialogTitle>
          <DialogContent>
            <ContentEditor
              module={{ title: activeTab, items: contentItems[getContentKey(activeTab)], itemToEdit: editItem }}
              onSave={handleEditSave}
              onClose={() => setEditItem(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!viewItem} onClose={() => setViewItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewItem?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Description:</strong> {viewItem?.description || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Content Type:</strong> {viewItem?.type || (viewItem?.toolName ? 'Interactive Tool' : viewItem?.releaseDate ? 'Scheduled Release' : '')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>File/Link:</strong>{' '}
            {viewItem?.supportingFiles?.length > 0 ? (
              <a href="#" onClick={() => alert('Download functionality not implemented')}>Download File</a>
            ) : viewItem?.link ? (
              <a href={viewItem.link} target="_blank" rel="noopener noreferrer">{viewItem.link}</a>
            ) : 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Date:</strong> {viewItem?.uploadDate || viewItem?.releaseDate || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {viewItem?.published ? 'Published' : 'Unpublished'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewItem(null)} sx={{ color: '#1976d2' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteConfirm?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteConfirm)} sx={{ color: '#ef4444' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Content</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={newContent.type}
              onChange={(e) => setNewContent({ ...newContent, type: e.target.value, supportingFiles: [], link: '' })}
              label="Content Type"
            >
              <MenuItem value="Lecture">Lecture</MenuItem>
              <MenuItem value="Lab">Lab</MenuItem>
              <MenuItem value="Clinical Rotation">Clinical Rotation</MenuItem>
              <MenuItem value="Tutorial">Tutorial</MenuItem>
            </Select>
          </FormControl>

          {newContent.type && (
            <>
              <TextField
                fullWidth
                label={newContent.type === 'Lecture' ? 'Lecture Title' : 
                       newContent.type === 'Lab' ? 'Experiment Name' : 
                       newContent.type === 'Clinical Rotation' ? 'Clinical Activity Name' : 
                       'Session Name'}
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                variant="outlined"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Content Format</InputLabel>
                <Select
                  value={newContent.supportingFiles.length > 0 ? 'File' : newContent.link ? 'Link' : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewContent({ ...newContent, supportingFiles: value === 'File' ? newContent.supportingFiles : [], link: value === 'Link' ? newContent.link : '' });
                  }}
                  label="Content Format"
                >
                  <MenuItem value="File">Upload File</MenuItem>
                  <MenuItem value="Link">Enter Link</MenuItem>
                </Select>
              </FormControl>
              {newContent.supportingFiles.length > 0 || (newContent.supportingFiles.length === 0 && !newContent.link) ? (
                <TextField
                  fullWidth
                  type="file"
                  onChange={(e) => setNewContent({ ...newContent, supportingFiles: Array.from(e.target.files), link: '' })}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  inputProps={{ accept: newContent.type === 'Tutorial' ? 'application/pdf' : 'application/pdf,video/mp4' }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Content Link"
                  value={newContent.link}
                  onChange={(e) => setNewContent({ ...newContent, link: e.target.value, supportingFiles: [] })}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                fullWidth
                label={newContent.type === 'Lecture' ? 'Publish Date' : 
                       newContent.type === 'Lab' ? 'Report Submission Date' : 
                       newContent.type === 'Clinical Rotation' ? 'Activity Date' : 
                       'Session Date'}
                type="date"
                value={newContent.date}
                onChange={(e) => setNewContent({ ...newContent, date: e.target.value })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Publish Status</InputLabel>
                <Select
                  value={newContent.published ? 'Published' : 'Unpublished'}
                  onChange={(e) => setNewContent({ ...newContent, published: e.target.value === 'Published' })}
                  label="Publish Status"
                >
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Unpublished">Unpublished</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleAddContent} sx={{ color: '#1976d2' }} disabled={!newContent.type || !newContent.title}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContentManagementSection;