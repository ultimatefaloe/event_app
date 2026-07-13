import { Component } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <div>
      <div className="p-2">
        <Component />
      </div>

      <div className="p-2">
        <Link to="/my-events">My Event</Link>
        <Link to="/create-event">Create Event</Link>

        <div className="p-2">Hi, ULTIMATE</div>
        
        <Link to="/my-events">Logout</Link>
      </div>
    </div>
  );
};

export default NavBar;
