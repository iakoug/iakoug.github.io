import React, { Component } from 'react'
import { Link } from 'gatsby'
import gatsby from '../../content/thumbnails/gatsby.png'
import github from '../../content/images/github.png'

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer container">
        <div>
          <a href="https://music.163.com/#/user/home?id=65978744" target="_blank" rel="noopener noreferrer">
            NetEase
          </a>
          <a href="https://www.weibo.com/5483326886" target="_blank" rel="noopener noreferrer">
            SinaWeibo
          </a>
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
