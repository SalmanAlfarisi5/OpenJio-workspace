import React from "react";
import "./LearnMore.css";

const LearnMore = () => {
  return (
    <div className="learn-more-container">
      <section className="learn-more-section">
        <h1>OpenJio Description</h1>
        <p>
          OpenJio is a platform designed for users to invite others to join
          events or activities. Users can post activities specifying details
          like location, time, number of participants, and any specific
          criteria. For instance, a user can announce a morning run at East
          Coast Park or seek a companion for a Coldplay concert. These posts
          become visible to other users, who can then request to join. The host
          can review profiles and accept or reject requests, allowing for
          meaningful connections based on shared interests. Users can also share
          their activity moments on their profiles for others to view.
        </p>
      </section>
      <section className="learn-more-section">
        <h2>Detailed Features</h2>
        <h3>Activity Posting</h3>
        <p>
          Create and share posts about upcoming activities with detailed
          information.
        </p>
        <h3>User Matching</h3>
        <p>
          Review and accept or reject requests from users who want to join your
          activity.
        </p>
        <h3>Profile Moments</h3>
        <p>Share photos and moments from past activities on your profile.</p>
        <h3>Notification System</h3>
        <p>
          Receive notifications when someone requests to join your activity.
        </p>
      </section>
      <section className="learn-more-section">
        <h2>User Testimonials</h2>
        <blockquote>
          <p>
            "OpenJio helped me find a running buddy and stay motivated!" - User
            A
          </p>
        </blockquote>
        <blockquote>
          <p>
            "I found a concert buddy for the first time using OpenJio. Awesome
            experience!" - User B
          </p>
        </blockquote>
      </section>
      <section className="learn-more-section">
        <h2>Technical Information</h2>
        <p>
          OpenJio is built using React for the frontend and Node.js for the
          backend. We use a REST API to handle user interactions and a secure
          database to store user data.
        </p>
      </section>
      <section className="learn-more-section">
        <h2>How It Works</h2>
        <ol>
          <li>Create a post about an activity you plan to do.</li>
          <li>
            Specify the details such as time, location, and participant
            criteria.
          </li>
          <li>
            Review join requests and accept or reject them based on user
            profiles.
          </li>
          <li>
            Once accepted, connect with participants and enjoy the activity.
          </li>
        </ol>
      </section>
      <section className="learn-more-section">
        <h2>About the Developers</h2>
        <p>
          OpenJio was developed by a passionate team committed to connecting
          people through shared activities. Reach out to us at
          contact@openjio.com or follow us on social media for updates.
        </p>
      </section>
      <section className="learn-more-section">
        <h2>Updates and Roadmap</h2>
        <p>
          We are continuously improving OpenJio. Look out for new features like
          enhanced profile customization and event analytics coming soon!
        </p>
      </section>
      <section className="learn-more-section">
        <h2>Resources</h2>
        <ul>
          <li>
            <a href="/docs/user-guide">User Guide</a>
          </li>
          <li>
            <a href="/community/forum">Community Forum</a>
          </li>
          <li>
            <a href="/tutorials">Tutorials</a>
          </li>
        </ul>
      </section>
      <section className="learn-more-section">
        <h2>Get Started</h2>
        <p>
          Ready to join or host an event? <a href="/signup">Sign up</a> now and
          start your journey with OpenJio!
        </p>
        <p>
          Have feedback? <a href="/feedback">Let us know</a>.
        </p>
      </section>
      <section className="learn-more-section">
        <h2>Legal Information</h2>
        <p>
          <a href="/terms">Terms of Service</a>
        </p>
        <p>
          <a href="/privacy">Privacy Policy</a>
        </p>
      </section>
    </div>
  );
};

export default LearnMore;
