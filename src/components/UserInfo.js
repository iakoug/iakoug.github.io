import React, { Component } from "react";
import kwok from "../../content/images/profile.jpg";

export default class UserInfo extends Component {
  render() {
    return (
      <aside className="note">
        <div className="container note-container">
          <div className="flex-author">
            <div className="flex-avatar">
              <img className="avatar" src={kwok} alt="chriatian kwok" />
            </div>
            <div>
              <p>
                I’m chriatian kwok. I document everything I learn.
                <strong>Thanks for your reading or comment.</strong>
              </p>

              <p style={{ textAlign: "right" }}>- Cyberholic！</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
