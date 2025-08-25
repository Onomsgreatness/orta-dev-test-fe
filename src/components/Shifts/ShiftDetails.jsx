import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../Axios/axios';
import TokenContext from '../../context/TokenContext';


export default function ShiftDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, user } = useContext(TokenContext);
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShiftDetails = async () => {
      try {
        console.log('Fetching shift details for ID:', id);
        console.log('Using token:', userToken);

        // Get ALL shifts
        const { data } = await axios.get('/shifts', {
          params: { userId: user._id },  // Add this line
          headers: { Authorization: `Bearer ${userToken}` }
        });

        // Find the specific shift we want
        const foundShift = data.find(shift => shift._id === id);
        
        if (foundShift) {
          setShift(foundShift);
        } else {
          setError('Shift not found');
        }
      } catch (err) {
        setError('Failed to fetch shift details');
      } finally {
        setLoading(false);
      }
    };

    if (id && userToken) {  // Add guard clause
      fetchShiftDetails();
    }
  }, [id, userToken, user._id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await axios.delete(`/shifts/${shift._id}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        navigate('/shifts');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete shift');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!shift) return <div className="text-center py-4">Shift not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Back Navigation */}
      <div className="flex items-center mb-6">
        <Link to="/shifts" className="text-gray-600 hover:text-gray-900 flex items-center">
          <span className="mr-2">←</span> Back
        </Link>
        <h1 className="ml-4 text-xl">Shift Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {/* Title, Date, Time Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">{shift.title || 'Morning Shift'}</h2>
          <div className="text-gray-600">
            {new Date(shift.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <div className="text-gray-600 mt-2">
            {shift.startTime} - {shift.finishTime}
          </div>
        </div>

        {/* Location Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <div className="space-y-1">
            <p className="font-medium">{shift.location?.name}</p>
            <p className="text-gray-600">{shift.location?.address}</p>
          </div>
        </div>

        {/* Clock In/Out Panel */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Clock In/Out</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">Clock In</p>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-mono">09:53:09</span>
                <span className="text-gray-500 text-sm ml-2">Checked in</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Clock Out</p>
              <button disabled className="w-full bg-gray-100 text-gray-400 p-3 rounded">
                Clock Out
              </button>
              <p className="text-gray-500 text-sm mt-1">
                Clock-out available 327 minutes before shift ends
              </p>
            </div>
          </div>
        </div>

        {/* Management Buttons */}
        <div className="p-6 flex justify-end space-x-4">
          <Link
            to={`/shifts/${id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Shift
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Shift
          </button>
        </div>
      </div>
    </div>
  );
}