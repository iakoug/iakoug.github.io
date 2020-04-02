import React from 'react'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { PostsList } from '../components/posts-list'

interface Props {
  data: Wink.Posts
}

// const postReg = /SitePage \/post\//

const nameReg = /.+\/(.+)\/index/

export default function Posts(props: Props): React.ReactElement {
  const { data } = props
  // const posts =
  //   data?.allSitePage?.edges
  //     .filter(({ node: { id } }) => postReg.test(id))
  //     .map(({ node: { id } }) => id.replace(/SitePage\ /, '')) || []

  const posts =
    data.allMdx?.nodes
      ?.filter(({ frontmatter: { published } }) => published)
      .sort(function(_, $) {
        if (_.frontmatter.date < $.frontmatter.date) {
          return 1
        } else if (_.frontmatter.date > $.frontmatter.date) {
          return -1
        } else {
          if (_.frontmatter.date < $.frontmatter.date) {
            return -1
          } else if (_.frontmatter.date > $.frontmatter.date) {
            return 1
          }

          return 0
        }
      })
      .map(({ fileAbsolutePath: n, frontmatter: { description } }) => ({
        name: n.match(nameReg)[1],
        description
      })) || []

  return (
    <Layout
      title={data.site.siteMetadata.title}
      description={data.site.siteMetadata.description}
      siteMeta={data.site}
    >
      <PostsList posts={posts} />
    </Layout>
  )
}

export const query = graphql`
  fragment SiteInfo on Site {
    siteMetadata {
      title
      description
      siteUrl
      siteLogo
      byteDance
      author
      authorURL
      socials {
        icon
        name
        url
      }
    }
    buildTime
  }

  query Posts {
    site {
      ...SiteInfo
    }

    allSitePage {
      edges {
        node {
          id
        }
      }
    }

    allMdx {
      nodes {
        frontmatter {
          description
          published
          date
        }
        fileAbsolutePath
      }
    }
  }
`
