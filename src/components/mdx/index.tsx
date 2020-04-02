import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as S from './index.style'
import { OuterLink } from '../link'
import { Image } from './image'

interface Props {
  post: Wink.NodeDetail
}

const components = {
  wrapper: S.Wrapper,
  p: S.P,
  h1: S.H1,
  h2: S.H2,
  h3: S.H3,
  h4: S.H4,
  h5: S.H5,
  h6: S.H6,
  blockquote: S.Bloackquote,
  ul: S.Ul,
  ol: S.Ol,
  li: S.Li,
  table: S.Table,
  tr: S.Tr,
  td: S.Td,
  th: S.Th,
  pre: S.Pre,
  code: S.Code,
  em: S.Em,
  strong: S.Strong,
  hr: S.Hr,
  a: OuterLink,
  img: Image,
  del: S.Delete
}

export const MDX = (props: Props): React.ReactElement => {
  const { post } = props

  return (
    <MDXProvider components={components}>
      <MDXRenderer>{post.body}</MDXRenderer>
    </MDXProvider>
  )
}
