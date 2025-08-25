import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../Axios/axios';
import TokenContext from '../../context/TokenContext';

export default function EditShift() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    finishTime: '',
    location: {
      name: '',
      address: '',
      latitude: '',
      longitude: ''
    }
  });

  // Fetch current shift data
  useEffect(() => {
    const fetchShift = async () => {
      try {
        const { data } = await axios.get(`/shifts/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        // Format date for input field
        const formattedDate = new Date(data.date).toISOString().split('T')[0];
        setFormData({
          ...data,
          date: formattedDate
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch shift details');
      } finally {
        setLoading(false);
      }
    };

    fetchShift();
  }, [id, userToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`/shifts/${id}`, formData, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      navigate(`/shifts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shift');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link to={`/shifts/${id}`} className="text-gray-600 hover:text-gray-900">
          ← Back
        </Link>
        <h1 className="ml-4 text-xl font-semibold">Edit Shift Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-500 rounded">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shift Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Location Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location Name *
              </label>
              <input
                type="text"
                name="location.name"
                value={formData.location?.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location?.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="location.latitude"
                  value={formData.location?.latitude}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="location.longitude"
                  value={formData.location?.longitude}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Details */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Schedule Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Finish Time *
                </label>
                <input
                  type="time"
                  name="finishTime"
                  value={formData.finishTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            to={`/shifts/${id}`}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Updating...' : 'Update Shift'}
          </button>
        </div>
      </form>
    </div>
  );
}