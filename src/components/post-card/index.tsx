import React from 'react'
import * as S from './index.style'

interface Props {
  post: Wink.NodeBase
  nav?: boolean
  isPreNav?: boolean
  isNextNav?: boolean
}

export const PostCard = (props: Props): React.ReactElement => {
  const { post, nav, isPreNav, isNextNav } = props
  const navTxt = isPreNav ? 'PREV' : isNextNav ? 'NEXT' : ''
  const navIconType = isPreNav ? 'arrow-left' : isNextNav ? 'arrow-right' : ''

  return (
    <S.Wrapper to={post.fields.slug}>
      <S.Cover fluid={post.frontmatter.cover.childImageSharp.fluid} />
      <S.Main>
        <S.PostTime>{post.frontmatter.date}</S.PostTime>
        <section>
          <S.Title>{post.frontmatter.title}</S.Title>
          <S.SubTitle>{post.frontmatter.description}</S.SubTitle>
        </section>
      </S.Main>
      {nav && (
        <S.PaginationPosition>
          <S.PaginationLabel>{navTxt}</S.PaginationLabel>
          <S.PaginationIcon type={navIconType} />
        </S.PaginationPosition>
      )}
    </S.Wrapper>
  )
}
