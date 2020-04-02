import Styled from 'styled-components'

export const Wrapper = Styled.section`
    width: 80%;
    max-width: 1200px;
    margin: 48px auto;
`

export const List = Styled.div.attrs({
  className: 'theme-post'
})`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    margin: 0 -24px;
`
