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
              <p>
                I am currently working with Bytedance front-end architecture
                infrastructure experience. If you are considering any job
                opportunities,{" "}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                  target="_blank"
                  href="mailto:rollawaypoint@gmail.com"
                  style={{ color: "yellow" }}
                >
                  please contact me
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
