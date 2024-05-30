import React from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  // Sample data for top users
  const topUsers = [
    { id: 1, Username: "User1", points: 1200, rank: 1 },
    { id: 2, Username: "User2", points: 1100, rank: 2 },
    { id: 3, Username: "User3", points: 1000, rank: 3 },
    { id: 4, Username: "User4", points: 900, rank: 4 },
    { id: 5, Username: "User5", points: 800, rank: 5 },
  ];

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.rank}</td>
              <td>{user.Username}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
