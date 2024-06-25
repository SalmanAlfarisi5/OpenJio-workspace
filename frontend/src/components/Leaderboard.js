import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("/api/users");
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="leaderboard">
      <h1>LEADERBOARD</h1>
      <ul>
        {players.map((player, index) => (
          <li key={index} className={`rank-${index + 1}`}>
            <span className="name">{player.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
