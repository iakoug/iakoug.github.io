const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `slug`,
      value: path.join(`/post`, createFilePath({ node, getNode }))
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const pageTemplate = require.resolve('./src/templates/page.tsx')
  const postTemplate = require.resolve('./src/templates/post.tsx')
  const { data, errors } = await graphql(`
    {
      allMdx(
        sort: { fields: frontmatter___date, order: DESC }
        filter: { frontmatter: { published: { eq: true } } }
      ) {
        totalCount
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  const { totalCount, edges } = data.allMdx
  const pageSize = 4

  if (errors) {
    console.info('Errors: \n', JSON.stringify(errors, 0, 4))
    throw new Error('Theme Query Data Error')
  }

  if (edges.length <= 0) {
    throw new Error('Must Have at least one')
  }

  for (let pageNo = 1; pageNo <= Math.ceil(totalCount / pageSize); pageNo++) {
    const endPosition = pageNo * pageSize
    const startPosition = endPosition - pageSize
    const ids = edges
      .slice(startPosition, endPosition)
      .map(post => post.node.id)

    createPage({
      path: pageNo === 1 ? `/` : `/page/${pageNo}`,
      component: pageTemplate,
      context: {
        ids,
        prevPath:
          pageNo <= 1 ? null : pageNo === 2 ? `/` : `/page/${pageNo - 1}`,
        nextPath: endPosition >= totalCount ? null : `/page/${pageNo + 1}`
      }
    })
  }

  edges.forEach((post, index) => {
    const lastPostIndex = edges.length - 1
    const isFirstPost = index === 0
    const isLastPost = index === lastPostIndex

    createPage({
      path: post.node.fields.slug,
      component: postTemplate,
      context: {
        id: post.node.id,
        prevId: isFirstPost
          ? edges[lastPostIndex].node.id
          : edges[index - 1].node.id,
        nextId: isLastPost ? edges[0].node.id : edges[index + 1].node.id
      }
    })
  })
}
