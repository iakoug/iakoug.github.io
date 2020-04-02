import React from 'react'
import * as S from './index.style'
import { OuterLink } from '../link'

interface Props {
  post: Wink.NodeDetail
}

export const PostHead = (props: Props): React.ReactElement => {
  const { post } = props
  const coverFrom = new URL(post.frontmatter.coverOriginalUrl)

  return (
    <S.Wrapper>
      <S.Main>
        <S.PostTime>{post.frontmatter.date}</S.PostTime>
        <section>
          <S.Title>{post.frontmatter.title}</S.Title>
          <S.SubTitle>{post.frontmatter.description}</S.SubTitle>
        </section>
      </S.Main>
      <S.CoverWrapper>
        <S.CoverImage fluid={post.frontmatter.cover.childImageSharp.fluid} />
        <S.CoverMeta>
          <span>photo by&nbsp;</span>
          <OuterLink href={post.frontmatter.coverOriginalUrl}>
            {post.frontmatter.coverAuthor}
          </OuterLink>
          <span>&nbsp;on {coverFrom.hostname}</span>
        </S.CoverMeta>
      </S.CoverWrapper>
    </S.Wrapper>
  )
}
