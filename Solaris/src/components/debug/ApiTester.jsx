import React, { useState } from 'react';
import apiClient from '../../services/api';

const ApiTester = ({ courseId }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    title: "Test from API Helper",
    credits: 4,
    semester: "Fall 2025",
    published: true,
    maxCapacity: 40
  });

  const testDirectUpdate = async () => {
    setLoading(true);
    try {
      // Log the request data
      console.log(`Testing direct update to course ${courseId} with:`, requestData);
      
      const response = await apiClient.put(`/api/admin/courses/${courseId}`, requestData);
      
      console.log("API response:", response);
      setResult({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error("API test failed:", error);
      setResult({
        success: false,
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="api-tester" style={{ 
      border: '1px solid #e2e8f0', 
      padding: '1rem', 
      borderRadius: '0.5rem',
      margin: '1rem 0',
      backgroundColor: '#f8fafc'
    }}>
      <h3>API Test Helper</h3>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Title:</label>
          <input 
            name="title"
            value={requestData.title}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Credits:</label>
          <input 
            name="credits"
            type="number"
            value={requestData.credits}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Published:</label>
          <input 
            name="published"
            type="checkbox"
            checked={requestData.published}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button 
        onClick={testDirectUpdate} 
        disabled={loading}
        style={{
          backgroundColor: '#E5BF03',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Direct Update'}
      </button>
      
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Result: {result.success ? 'Success' : 'Error'}</h4>
          <pre style={{ 
            backgroundColor: '#f1f5f9',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            overflowX: 'auto'
          }}>
            {JSON.stringify(result.data || result.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTester;