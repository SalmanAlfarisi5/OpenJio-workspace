import React from "react";
import "./LearnMore.css";

const LearnMore = () => {
  return (
    <div className="LearnMore-container">
      <h1>OpenJio Description</h1>
      <p>
        OpenJio is a website that allows users to ask other users to join events
        or do an activity together. Users can post an activity that they will be
        doing in the future and post it on the OpenJio website. Users can also
        specify the places, times, numbers of people to invite, and criteria of
        people requested to join the activity. For example, a user can post on
        the OpenJio website about an activity to run at the East Coast Park in
        the morning at 7.00 - 8.00, or they need a friend to attend a Coldplay
        concert next month. Then, their post will be available for other users
        to see on the OpenJio website. After that, people can ask or request to
        join the activity, and the website will notify the owner. The activity
        hosts can then see their profile and decide whether to accept or reject
        the request, and so can the activity attendee see the activity host's
        profile. If the hosts decide to accept the request, they will be
        connected or matched on the web. Additionally, the users can add their
        moments of activities in their profiles for other users to see.
      </p>
      <h1>Terms and Conditions for OpenJio</h1>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using the OpenJio website, you agree to comply with and
        be bound by these terms and conditions. If you do not agree to these
        terms, you must not use the website.
      </p>

      <h1>Users</h1>
      <div className="founder-images">
        <img alt="salman" className="founder-image" src="./salman.jpg"></img>
        <img alt="judha" className="founder-image" src="./judha.jpg"></img>
        <img alt="ammar" className="founder-image" src="./ammar.jpg"></img>
        <img alt="mades" className="founder-image" src="./mades.jpg"></img>
        <img alt="aldi" className="founder-image" src="./aldi.jpg"></img>
      </div>
    </div>
  );
};
export default LearnMore;
