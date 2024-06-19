import React from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const players = [
    { id: 1, name: "Player Name 1", score: 2980 },
    { id: 2, name: "Player Name 2", score: 2721 },
    { id: 3, name: "Player Name 3", score: 2579 },
    { id: 4, name: "Player Name 4", score: 1874 },
    { id: 5, name: "Player Name 5", score: 1756 },
    { id: 6, name: "Player Name 6", score: 2980 },
    { id: 7, name: "Player Name 7", score: 2721 },
    { id: 8, name: "Player Name 8", score: 2579 },
    { id: 9, name: "Player Name 9", score: 1874 },
    { id: 10, name: "Player Name 10", score: 1756 },
    { id: 11, name: "Player Name 11", score: 2980 },
    { id: 12, name: "Player Name 12", score: 2721 },
    { id: 13, name: "Player Name 13", score: 2579 },
    { id: 14, name: "Player Name 14", score: 1874 },
    { id: 15, name: "Player Name 15", score: 1756 },
  ];

  return (
    <div className="leaderboard">
      <h1>LEADERBOARD</h1>
      <ul>
        {players.map((player, index) => (
          <li key={player.id + index} className={`rank-${index + 1}`}>
            <span className="name">{player.name}</span>
            <span className="score">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;