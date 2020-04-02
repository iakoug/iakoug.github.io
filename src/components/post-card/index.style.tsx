import Styled from 'styled-components'
import { InnerLink } from '../link'
import Image from 'gatsby-image'

export * from '../pagination/index.style'

export const PaginationPosition = Styled.div`
    position: absolute;
    top: 0;
    right: 24px;
    color: #fff;
    font-size: 24px;

    i {
        color: #fff!important; // Recover JS set
    }
`

export const Main = Styled.div`
    padding-top: 16px;
    hyphens: auto;
    hyphens: auto;
`

export const Title = Styled.h2`
    display: inline;
    font-size: 24px;
    font-weight: 700;
`

export const SubTitle = Styled.h4`
    display: inline;
    font-size: 24px;
    font-weight: 400;

    &:before {
        content: ' ';
    }
`

export const PostTime = Styled.time`
    display: block;
    font-weight: 700;
    text-transform: uppercase;
`

export const Cover = Styled(Image)`
    height: 240px;
    box-shadow: 0px 24px 48px -8px rgba(0, 0, 0, 0.2), 0px 16px 32px -8px rgba(0, 0, 0, 0.22);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 48px 80px -24px rgba(0, 0, 0, 0.25), 0 32px 56px -32px rgba(0, 0, 0, 0.35);
    }
`

export const Wrapper = Styled(InnerLink)`
    position: relative;
    display: block;
    flex: 0 0 50%;
    margin-bottom: 48px;
    padding: 0 24px;
    box-sizing: border-box;

    @media screen and (max-width: 880px) {
        flex: 0 0 100%;
        overflow: hidden;
        margin-bottom: 24px;
        border-radius: 8px;
        padding: 0;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        }

        ${Main} {
            padding: 16px 24px;
        }

        ${Cover} {
            height: 180px;
            box-shadow: none;

            &:hover {
                transform: none;
            }
        }

        ${Title}, ${SubTitle} {
            font-size: 18px;
        }
    }
`
