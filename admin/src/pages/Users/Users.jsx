import React from "react";
import { UsersList } from "../../components/Users/UsersList/UsersList";
import "./Users.css";

export const Users = () => {
  return (
    <div className="users-page">
      <UsersList />
    </div>
  );
};
