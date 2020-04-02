import React from 'react'
import * as S from './index.style'

interface State {
  tick: string
}

let [index, timer] = [0, 0]
let duplicateIndex = 0

const resetIndex = () => {
  index = 0 // Reset

  clearInterval(timer)
}

export class ByteDance extends React.Component<any, State> {
  quoteReference: string[]
  startIndex: number

  constructor(props: any) {
    super(props)

    this.state = { tick: '' }
    this.quoteReference = (props.siteMeta.siteMetadata.byteDance || []).filter(
      Boolean
    )
    this.startIndex = this.getRandomIndex()
  }

  componentDidMount() {
    if (this.quoteReference.length) {
      this.typing()
    }
  }

  getRandomIndex = (): number => {
    const currentIndex = Math.floor(Math.random() * this.quoteReference.length)

    return this.quoteReference.length > 1 && duplicateIndex === currentIndex
      ? this.getRandomIndex()
      : (duplicateIndex = currentIndex)
  }

  typing = () => {
    const quote = this.quoteReference[this.getRandomIndex()]

    // const useIndex =
    //   this.startIndex > this.quoteReference.length - 1
    //     ? (this.startIndex = 0)
    //     : this.startIndex

    // const quote = !this.quoteReference[useIndex]
    //   ? this.quoteReference[(this.startIndex = 0)]
    //   : `${this.startIndex++}` && this.quoteReference[useIndex]

    timer = setInterval(
      () =>
        quote.length
          ? this.setState({ tick: quote.slice(0, index++) })
          : resetIndex(),
      50
    )
  }

  componentWillUnmount() {
    resetIndex() // Remove state settings effect.
  }

  render() {
    const { tick } = this.state

    return (
      <>
        {this.quoteReference.length > 0 && (
          <S.Wrapper>
            {tick}
            <S.Blink>|</S.Blink>
          </S.Wrapper>
        )}
      </>
    )
  }
}
