import React from 'react'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { PostHead } from '../components/post-head'
import { PostList } from '../components/post-list'
import { MDX } from '../components/mdx'

interface Props {
  data: Wink.PostData
}

export default function Post(props: Props): React.ReactElement {
  const { data } = props
  const siblingPosts = [data.prevNode, data.nextNode]

  return (
    <Layout
      siteMeta={data.site}
      title={`${data.node.frontmatter.title} · ${data.site.siteMetadata.title} `}
      description={
        data.node.frontmatter.description || data.site.siteMetadata.description
      }
    >
      <>
        <PostHead post={data.node} />
        <MDX post={data.node} />
        <PostList nav={true} posts={siblingPosts} />
      </>
    </Layout>
  )
}

export const query = graphql`
  query Post($id: String!, $prevId: String!, $nextId: String!) {
    site {
      ...SiteInfo
    }
    node: mdx(id: { eq: $id }) {
      ...NodeOverview
      tableOfContents
      body
    }
    prevNode: mdx(id: { eq: $prevId }) {
      ...NodeOverview
    }
    nextNode: mdx(id: { eq: $nextId }) {
      ...NodeOverview
    }
  }
`
