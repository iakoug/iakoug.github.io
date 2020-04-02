import React from 'react'
import { PostCard } from '../post-card'
import * as S from './index.style'

interface Props {
  posts: Wink.NodeBase[]
  nav?: boolean
}

export const PostList = (props: Props): React.ReactElement => {
  const { nav, posts } = props
  const postNodeList = posts.map(
    (post: Wink.NodeBase, index: number): React.ReactElement => {
      const options = {
        nav,
        isPreNav: nav && index === 0,
        isNextNav: nav && index === 1
      }

      return <PostCard key={index} post={post} {...options} />
    }
  )

  return (
    <S.Wrapper>
      <S.List>{postNodeList}</S.List>
    </S.Wrapper>
  )
}
