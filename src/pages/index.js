import React, { Component } from "react";
import Helmet from "react-helmet";
import GitHubButton from "react-github-btn";
import { graphql, Link } from "gatsby";
import axios from "axios";

import Layout from "../layout";
import PostListing from "../components/PostListing";
import ProjectListing from "../components/ProjectListing";
import SEO from "../components/SEO";
// import config from '../../data/SiteConfig'
import projects from "../../data/projects";
import kwok from "../../content/images/profile.jpg";
import api from "../../data/api";
import quotes from "../../data/quotes";

export default class Index extends Component {
  state = {
    message: [],
  };

  componentDidMount = async () => {
    // xhr.js:179 Mixed Content: The page at 'https://kwoks.me/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://47.100.219.10:7001/api/justwink/message_board'. This request has been blocked; the content must be served over HTTPS.
    // 暂未给公网 IP 配置 SSL
    let message;

    try {
      message = (
        await axios.post(api.message).catch((e) => console.warn(e))
      ).data
        .filter(Boolean)
        .slice(-6);
    } catch (e) {
      // console.warn(e)
    }

    this.setState({
      message: message || quotes,
    });
  };

  render() {
    const { data } = this.props;
    const { message } = this.state;
    const latestPostEdges = data.latest.edges;

    return (
      <Layout>
        <Helmet title={`Just wink!`} />
        <SEO />
        <div className="container">
          <div className="lead">
            <div className="elevator">
              <h1>{`Hi!⛷`} </h1>
              <p>
                Im a front-end software developer creating{" "}
                <a
                  href="https://github.com/justwink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open source
                </a>{" "}
                projects and <Link to="/blog">writing</Link> about modern
                JavaScript, Node.js, and development.
              </p>
              <div className="social-buttons">
                <GitHubButton
                  href="https://github.com/justwink"
                  data-size="large"
                  data-show-count="true"
                >
                  justwink
                </GitHubButton>
              </div>
            </div>
            <div className="newsletter-section">
              <img src={kwok} className="newsletter-avatar" alt="christian" />
              <div>
                <h3>Rss Subscriber</h3>
                <p>
                  I write articles. Get an update when something new comes out
                  by subscribe below!
                </p>
                <a className="button" href="https://kwoks.me/rss.xml">
                  Subscribe Rss
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container front-page">
          <section className="section">
            <hr />
            {/* <h2>
              Latest Articles
              <Link to="/blog" className="view-all">
                View all
              </Link>
            </h2> */}
            <PostListing simple postEdges={latestPostEdges} showNext={{}} />
          </section>

          <section className="section">
            {/* <h2>Open Source Projects</h2> */}
            <hr />
            <ProjectListing projects={projects} />
          </section>
        </div>
        <div className="quotations-section">
          <div className="quotations">
            {message &&
              message.map((quote) => (
                <blockquote className="quotation" key={quote.name}>
                  <p>{quote.message || quote.value || quote.quote}</p>
                  <cite>— {quote.name}</cite>
                </blockquote>
              ))}
          </div>
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    latest: allMarkdownRemark(
      limit: 10
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
  }
`;
