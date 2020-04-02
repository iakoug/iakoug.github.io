declare module '@mdx-js/react'
declare module 'gatsby-plugin-mdx'
declare module 'react-medium-image-zoom'

declare namespace Wink {
  export interface Posts {
    site: Site
    allSitePage?: {
      edges: {
        node: {
          id: string
        }
      }[]
    }
    allMdx?: {
      nodes: {
        fileAbsolutePath
        frontmatter: {
          description: string
          published: boolean
          date: string
        }
      }[]
    }
  }
  export interface PostData {
    site: Site
    node: NodeDetail
    prevNode: NodeBase
    nextNode: NodeBase
  }

  export interface PostsData {
    site: Site
    allMdx: AllMdx
  }

  export interface Site {
    siteMetadata: SiteMetadata
    buildTime: Date
  }

  export interface SiteMetadata {
    title: string
    description: string
    siteUrl: string
    siteLogo: string
    byteDance: string[]
    author: string
    authorURL: string
    socials: {
      icon: string
      name: string
      url: string
      mode: 'fill' | 'line'
    }[]
  }

  export interface AllMdx {
    totalCount: number
    edges: Edge[]
  }

  export interface Edge {
    node: NodeBase
  }

  export interface NodeBase {
    id: string
    fields: Fields
    frontmatter: Frontmatter
    file: File
    timeToRead: number
    wordCount: WordCount
  }

  export interface NodeDetail extends NodeBase {
    tableOfContents: TableOfContents
    body: string
  }

  export interface Fields {
    slug: string
  }

  export interface Frontmatter {
    title: string
    date: string
    description: string
    cover: Cover
    coverAuthor: string
    coverOriginalUrl: string
  }

  export interface Cover {
    childImageSharp: {
      fluid: any
    }
  }

  export interface File {
    publicURL: string
    birthTime: string
    modifiedTime: string
  }

  export interface TableOfContents {
    items: Item[]
  }

  export interface Item {
    url: string
    title: string
    items?: Item[]
  }

  export interface WordCount {
    paragraphs: number
    sentences: number
    words: number
  }
}
