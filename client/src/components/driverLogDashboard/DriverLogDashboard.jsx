import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DriverLogDashboard.css";

const API = "http://localhost:5050";

const DriverLogDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    date: "",
    startKm: "",
    endKm: "",
    from: "",
    to: "",
  });

  const [editId, setEditId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${API}/trips`);
      setTrips(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/trips/${editId}`, form);
      } else {
        await axios.post(`${API}/trips`, form);
      }

      fetchTrips();

      setForm({
        date: "",
        startKm: "",
        endKm: "",
        from: "",
        to: "",
      });

      setEditId(null);
      setSelectedId(null);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  const handleRowClick = (trip) => {
    setForm({
      date: trip.date || "",
      startKm: trip.startKm || "",
      endKm: trip.endKm || "",
      from: trip.from || "",
      to: trip.to || "",
    });

    setEditId(trip._id);
    setSelectedId(trip._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/trips/${id}`);
    fetchTrips();
  };

  return (
    <div className="dashboard">
      {/* FORM */}
      <div className="card">
        <h2 className="card-title">{editId ? "Edit Trip" : "Add Trip"}</h2>

        <input
          className="input"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          className="input"
          placeholder="Start KM"
          value={form.startKm}
          onChange={(e) => setForm({ ...form, startKm: e.target.value })}
        />

        <input
          className="input"
          placeholder="End KM"
          value={form.endKm}
          onChange={(e) => setForm({ ...form, endKm: e.target.value })}
        />

        <input
          className="input"
          placeholder="From"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
        />

        <input
          className="input"
          placeholder="To"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
        />

        <button className="button" onClick={handleSave}>
          {editId ? "Update Trip" : "Save Trip"}
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <h2 className="card-title">Logbook</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>KM</th>
              <th>From</th>
              <th>To</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip._id}
                onClick={() => handleRowClick(trip)}
                style={{
                  background:
                    selectedId === trip._id ? "#e0f2fe" : "transparent",
                }}
              >
                <td>{trip.date}</td>
                <td>{Number(trip.endKm) - Number(trip.startKm)}</td>
                <td>{trip.from}</td>
                <td>{trip.to}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(trip._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverLogDashboard;
