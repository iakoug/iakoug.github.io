import Styled from 'styled-components'
import { LightInnerLink } from '../link'
import {theme} from '../../theme'


export const SeekAllLink = Styled(LightInnerLink)``

export const SeekAllWrapper = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`

export const Wrapper = Styled.footer`
    display: block;
    width: 80%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 0;
`

export const Copyright = Styled.span.attrs({
  className: 'theme-copyright'
})`
    display: block;
    font-weight: 500;
    width: 100%;
    text-align: center;
    margin-top: 10px;
    color: ${theme.copyright.color};
`

export const SocialList = Styled.ul`
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const SocialItem = Styled.li`
    display: inline-block;
    font-size: 16px;

    a {
        padding: 0 16px;
    }
`
