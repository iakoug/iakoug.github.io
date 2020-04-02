import React from 'react'
import * as S from './index.style'

interface Props {
  posts: {name: string, description: string}[]
}

export const PostsList = (props: Props): React.ReactElement => {
  const postNodeList = props.posts.map(
    ({name, description}, index: number): React.ReactElement => {
      return (
        <S.List key={index}>
          <S.PostLink to={`/post/${name}`}>{name}</S.PostLink>
          <S.Description>{description}</S.Description>
        </S.List>
      )
    }
  )

  return <S.Wrapper>{postNodeList}</S.Wrapper>
}
