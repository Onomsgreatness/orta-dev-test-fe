// src/components/Shifts/Shifts.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; 
import axios from "../../Axios/axios"; // your configured instance
import TokenContext from "../../context/TokenContext";

const getShiftStatus = (shift) => {
  const now = new Date();
  const shiftDate = new Date(`${shift.date}T${shift.startTime}`);
  const endTime = new Date(`${shift.date}T${shift.finishTime}`);

  if (now < shiftDate) return 'Scheduled';
  if (now >= shiftDate && now <= endTime) return 'In Progress';
  return 'Completed';
};

export default function Shifts() {
  const { userToken, user } = useContext(TokenContext);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      setError(null);

      if (!userToken || !user?._id) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/shifts", {
          params: { userId: user._id },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        console.log('Fetched shifts:', data);

        // Sort shifts chronologically by date and time
      const sortedShifts = data.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.startTime}`);
        const dateTimeB = new Date(`${b.date}T${b.startTime}`);
        return dateTimeA - dateTimeB;
      });

        setShifts(sortedShifts);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load shifts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [userToken, user]);

  if (loading) return <p>Loading shifts…</p>;
  if (error)
    return <p style={{ color: "red" }}>Error loading shifts: {error}</p>;

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Shifts</h2>
        <Link
          to="/shifts/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Shift
        </Link>
      </div>

      {/* Table Layout */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {shift.location?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(shift.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shift.startTime} - {shift.finishTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${getShiftStatus(shift) === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${getShiftStatus(shift) === 'In Progress' ? 'bg-green-100 text-green-800' : ''}
                    ${getShiftStatus(shift) === 'Completed' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {getShiftStatus(shift)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/shifts/${shift._id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {shifts.length === 0 && (
        <p className="text-center text-gray-500">No shifts found.</p>
      )}
    </div>
  );
}
