import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ConfirmationModal } from "../../../utils/Modals/ConfirmationModal";
import "./UsersList.css";
//=============================================================================

// Environment variables for API endpoints
//============================================================
const API_USER_DELETE = import.meta.env.VITE_API_USER_DELETE;
const API_USER_STATUS = import.meta.env.VITE_API_USER_STATUS;
//============================================================

// UsersList component for rendering a list of  employees and customers.
//----------------------------------------------------------------------
export const UsersList = () => {
  // Context variables for users and their manipulation
  //----------------------------------------------------
  const { adminUsers, customers, setCustomers, setAdminUsers } =
    useContext(UserContext);

  // State variables for confirmation modal
  //----------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Function to format creation date
  //-----------------------------------------------------
  const createdDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatedDate = new Date(date);
    return formatedDate.toLocaleDateString("en-US", options);
  };

  // Function to handle user deletion
  //-----------------------------------------------------
  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios(API_USER_DELETE, {
        method: "DELETE",
        data: {
          _id: userId,
        },
      });
      toast.success(response.data.message);
      setAdminUsers(response.data.adminUsers);
      setCustomers(response.data.customerUsers);
    } catch (error) {
      toast.error(error.response?.data.message, {
        icon: true,
      });
    }
  };

  // Function to handle click on delete button
  //----------------------------------------------------
  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Function to handle cancellation of modal
  //----------------------------------------------------
  const handleCancel = () => {
    setSelectedUserId(null);
    setIsModalOpen(false);
  };

  // Function to handle confirmation of modal
  //----------------------------------------------------
  const handleConfirm = () => {
    if (selectedUserId) {
      handleDeleteUser(selectedUserId);
      setSelectedUserId(null);
      setIsModalOpen(false);
    }
  };

  // Function to handle user status change
  //---------------------------------------------------
  const handleStatus = async (userId) => {
    const response = await axios.patch(`${API_USER_STATUS}/${userId}`);
    toast.success(response.data.message);
    const updatedUsers = response.data.updatedUsers;
    if (updatedUsers[0].role === "Customer") {
      setCustomers(response.data.updatedUsers);
    } else {
      setAdminUsers(response.data.updatedUsers);
    }
  };

  return (
    <div className="users-list">
      {/* Table for displaying employees */}
      <div className="users-list-table-container employees">
        <div className="employee-text-and-add-button">
          <h2>Employees</h2>
          <Link to="/user-create">
            <button className="add-employee-button"> Add Employee</button>
          </Link>
        </div>
        <div className="employees users-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Email</th>

                <th>Joined</th>
                <th>Status | Delete</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapping through adminUsers to display each user */}
              {adminUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>

                  <td>{createdDate(user.createdAt)}</td>

                  <td>
                    {/* Button to change user status */}
                    <button
                      className={`disable-button ${
                        user.status === "Inactive" && "inactive"
                      }`}
                      onClick={() => handleStatus(user._id)}
                    >
                      {user.status}
                    </button>
                    {/* Button to delete user */}
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="delete-button"
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

      {/* Table for displaying customers */}
      <div className="users-list-table-container">
        <h2>Customers</h2>
        <div className="customers users-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Email</th>

                <th>Joined</th>
                <th>Status | Delete</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapping through customers to display each user */}
              {customers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>

                  <td>{createdDate(user.createdAt)}</td>

                  <td>
                    {/* Button to change user status */}
                    <button
                      className="disable-button"
                      onClick={() => handleStatus(user._id)}
                    >
                      {user.status}
                    </button>
                    {/* Button to delete user */}
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Confirmation modal for user deletion */}
          <ConfirmationModal
            isOpen={isModalOpen}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            id={selectedUserId}
          />
        </div>
      </div>
      {/* Toast container for displaying success or error messages */}
      <ToastContainer />
    </div>
  );
};
