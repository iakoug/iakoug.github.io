import React from 'react'
import Styled from 'styled-components'
import { graphql } from 'gatsby'

import { Layout } from '../components/layout'

interface Props {
  data: {
    site: Wink.Site
  }
}

const Flex = Styled.div`
  width: 80%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 50px auto 100px;

  p {
    text-indent: 28px;
  }
`

export default (props: Props): React.ReactElement => {
  const { data } = props

  return (
    <Layout
      title={data.site.siteMetadata.title}
      description={data.site.siteMetadata.description}
      siteMeta={data.site}
    >
      <Flex>
        <h3>Jump to the hell</h3>
        <p>Let me share a recurring nightmare I have with you. </p>
        <p>
          In this dream, I was walking alone in the dark on a road without
          return. There were no signs on the road. Endless time to the end of
          the road, abyss ahead was dark and silent. Wenn du lange in einen
          Abgrund blickst, blickt der Abgrund auch dich hinein... So I jumped
          down like this with endless falling, circling...
        </p>
        <p>
          That's the good version of the dream. In the other one, there's just
          ... screaming. And darkness.
        </p>
      </Flex>
    </Layout>
  )
}

export const query = graphql`
  fragment SiteInfo on Site {
    siteMetadata {
      title
      description
      siteUrl
      siteLogo
      byteDance
      author
      authorURL
      socials {
        icon
        name
        url
      }
    }
    buildTime
  }

  query SiteLayoutInfo {
    site {
      ...SiteInfo
    }
  }
`
