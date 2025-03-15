"use client";
import { useEffect, useState } from 'react';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface Payload {
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export default function AccountPanel() {
  const [payload, setPayload] = useState<Payload>({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Payload>({});

  useEffect(() => {
    const payloadCookie = getCookie("payload") as string;
    if (payloadCookie) {
      try {
        const parsedPayload = JSON.parse(payloadCookie);
        setPayload(parsedPayload);
        setFormData(parsedPayload);
      } catch (error) {
        console.error("Failed to parse payload cookie:", error);
      }
    }
  }, []);

  const handleEdit = () => setEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/account/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setPayload(updatedUser.user);
        setCookie("payload", JSON.stringify(updatedUser.user));
        setEditing(false);
        window.location.reload();
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const onLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        deleteCookie("payload");
        window.location.href = "/register";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <aside className="w-1/6 h-full bg-white shadow-lg p-4 flex flex-col justify-between border-r-2">
      <div>
        <h2 className="text-xl font-bold mb-4">Account Details</h2>
        {editing ? (
          <div className="space-y-2">
            <input
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Name"
            />
            <input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="email"
            />
            <input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Phone"
            />
            <input
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Role"
            />
            <button
              onClick={handleSubmit}
              className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {payload.username || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Email:</span> {payload.email || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {payload.phone || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Role:</span> {payload.role || 'N/A'}
            </p>
            <button
              onClick={handleEdit}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <FaUserEdit /> Edit Account
            </button>
          </div>
        )}
      </div>
      <button
        onClick={onLogout}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}