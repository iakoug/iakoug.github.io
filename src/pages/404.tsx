import React from 'react'
import Styled from 'styled-components'

const $404 = Styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
  background: url(https://i.loli.net/2019/12/18/i7XljnS8DMukPK9.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`

export default (): React.ReactElement => <$404 />
