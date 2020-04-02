import React from 'react'
import Logo from '../logo'
import * as S from './index.style'
import { Icon } from '../Icon'
import { changeThemeMode } from '../../theme'

interface Props {
  siteMeta: Wink.Site
}

const icon = () => {
  let className = `contrast`

  try {
    const darkMode = window.localStorage.getItem('dark-mode') !== '0'

    className = darkMode ? 'sun' : 'contrast'
  } catch (e) {
    // console.log(e)
  }

  return className
}

class Header extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <S.Wrapper>
        <S.HeaderContainer>
          <S.LogoSection to="/">
            {Logo(this.props.siteMeta.siteMetadata.siteLogo)}

            <S.LogoTitle>
              {this.props.siteMeta.siteMetadata.title.toUpperCase()}
            </S.LogoTitle>
          </S.LogoSection>

          <S.Mode onClick={changeThemeMode()}>
            <Icon type={icon()} mode="fill" />
          </S.Mode>
        </S.HeaderContainer>
      </S.Wrapper>
    )
  }
}

export default Header
