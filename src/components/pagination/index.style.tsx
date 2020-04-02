import Styled from 'styled-components'
import { InnerLink } from '../link'
import { Icon } from '../Icon'

export const Wrapper = Styled.section`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    list-style: none;
`

interface PaginationItemProps {
  visible: boolean
}

export const PaginationItem = Styled.div`
    display: inline-block;
    visibility: ${(p: PaginationItemProps): string =>
      p.visible ? 'visible' : 'hidden'};
`

export const PaginationLink = Styled(InnerLink)`
    display: inline-block;
    margin: 48px 24px;
    font-size: 18px;
`

export const PaginationIcon = Styled(Icon)`
    padding: 0 8px;
    vertical-align: text-bottom;
`

export const PaginationLabel = Styled.p`
    display: inline-block;
    font-weight: 500;
`
