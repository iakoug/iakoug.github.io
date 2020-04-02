import React from 'react'
import { Helmet } from 'react-helmet'
import Header from '../header'
import Footer from '../footer'
import * as S from './index.style'

interface Props {
  title: string
  description: string
  children: React.ReactElement
  siteMeta: Wink.Site
}

export class Layout extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <S.Layout>
        <Helmet>
          <title>{this.props.title}</title>
          <meta name="description" content={this.props.description} />
          <link
            // href="https://cdn.remixicon.com/releases/v2.0.0/remixicon.css"
            href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
            rel="stylesheet"
          ></link>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css"
          />
        </Helmet>
        <Header siteMeta={this.props.siteMeta} />
        {this.props.children}
        <Footer siteMeta={this.props.siteMeta} />
      </S.Layout>
    )
  }
}
