import React, { Component } from 'react'
import { Link } from 'gatsby'
import gatsby from '../../content/thumbnails/gatsby.png'
import github from '../../content/images/github.png'

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer container">
        <div>
          <Link to="/contact">Newsletter</Link>
          <a href="https://justwink.cn/rss.xml" target="_blank" rel="noopener noreferrer">
            Rss
          </a>
        </div>
        <div>
          <a href="https://github.com/justwink" title="Open-source on GitHub">
            <img
              src={github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a>
          <a href="https://www.gatsbyjs.org/" title="Built with Gatsby">
            <img
              src={gatsby}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-img"
              alt="GitHub"
            />
          </a>
        </div>
      </footer>
    )
  }
}
