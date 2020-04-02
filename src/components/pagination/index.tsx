import React from 'react'
import * as S from './index.style'

interface Props {
  prevPath?: string
  nextPath?: string
}

export const Pagination = (props: Props): React.ReactElement => {
  const { prevPath, nextPath } = props

  return (
    <S.Wrapper>
      <S.PaginationItem visible={!!prevPath}>
        <S.PaginationLink to={prevPath || '/'}>
          <S.PaginationIcon type="arrow-left" />
          <S.PaginationLabel>PREV</S.PaginationLabel>
        </S.PaginationLink>
      </S.PaginationItem>
      <S.PaginationItem visible={!!nextPath}>
        <S.PaginationLink to={nextPath || '/'}>
          <S.PaginationLabel>NEXT</S.PaginationLabel>
          <S.PaginationIcon type="arrow-right" />
        </S.PaginationLink>
      </S.PaginationItem>
    </S.Wrapper>
  )
}
