import React from 'react'
import { Icon } from '../Icon'
import { OuterLink } from '../link'
import * as S from './index.style'

const allArticlesPath = '/posts'
// const aboutPath = '/about'

interface Props {
  siteMeta: Wink.Site
}

const Footer = (props: Props): React.ReactElement => {
  return (
    <S.Wrapper>
      <S.SocialList>
        {props.siteMeta.siteMetadata.socials.map(
          (item, i): React.ReactElement => (
            <S.SocialItem key={i}>
              <OuterLink title={item.name} href={item.url}>
                {/* FIXME: invalid mode "undefined" */}
                <Icon type={item.icon} mode="line" />
              </OuterLink>
            </S.SocialItem>
          )
        )}
      </S.SocialList>

      <S.Copyright>
        ©{new Date().getUTCFullYear()}
        &nbsp;Powered by 🎉&nbsp;
        {props.siteMeta.siteMetadata.author}
      </S.Copyright>

      <S.SeekAllWrapper>
        <S.SeekAllLink to={allArticlesPath}>Seek the past</S.SeekAllLink>
      </S.SeekAllWrapper>
      {/* <S.SeekAllWrapper>
        <S.SeekAllLink to={aboutPath}>About Me</S.SeekAllLink>
      </S.SeekAllWrapper> */}
    </S.Wrapper>
  )
}

export default Footer
