import Styled from 'styled-components'
import Image from 'gatsby-image'

export const Main = Styled.div`
    margin: 48px auto;
    word-break: break-word;
    hyphens: auto;
`

export const Wrapper = Styled.header`
    width: 80%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;

    @media screen and (max-width: 880px) {
        width: 100%;

        ${Main} {
            margin: 48px;
        }
    }
`

export const Title = Styled.h1`
    font-size: 32px;
    font-weight: 700;
    line-height: 1.4;
`

export const SubTitle = Styled.h2`
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
`

export const PostTime = Styled.time`
    display: block;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
`

export const CoverWrapper = Styled.div`
    margin-bottom: 24px;
`

export const CoverImage = Styled(Image)`
    display: block;
    height: 400px;
    box-shadow: 0px 24px 48px -8px rgba(0, 0, 0, 0.2), 0px 16px 32px -8px rgba(0, 0, 0, 0.22);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

export const CoverMeta = Styled.p.attrs({
  className: 'theme-coverMeta'
})`
    padding: 16px 0;
    font-weight: 400;
    text-align: center;
`
