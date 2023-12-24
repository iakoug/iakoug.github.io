import React from 'react'
import * as S from './index.module.scss'

interface State {
  tick: string
}

let [index, timer] = [0, 0]
let duplicateIndex: number

const resetIndex = () => {
  index = 0 // Reset

  clearInterval(timer)
}

interface Props {
  byteDance: string[]
}

export class ByteDance extends React.Component<Props, State> {
  quoteReference: string[]

  constructor(props: Props) {
    super(props)

    this.state = { tick: '' }
    this.quoteReference = (props.byteDance || []).filter(
      Boolean
    )
  }

  componentDidMount() {
    if (this.quoteReference.length) {
      this.typing()
    }
  }

  getRandomIndex = (): number => {
    const randomIndex = Math.floor(Math.random() * this.quoteReference.length)

    const currentIndex = this.quoteReference.length > 1 && duplicateIndex > 0 && duplicateIndex === randomIndex
      ? randomIndex + 1
      : randomIndex

    duplicateIndex = currentIndex % this.quoteReference.length

    return duplicateIndex
  }

  typing = () => {
    const quote = this.quoteReference[this.getRandomIndex()]

    timer = setInterval(
      () =>
        quote.length
          ? this.setState({ tick: quote.slice(0, index++) })
          : resetIndex(),
      50
    ) as any as number
  }

  componentWillUnmount() {
    resetIndex() // Remove state settings effect.
  }

  render() {
    const { tick } = this.state

    return (
      <>
        {this.quoteReference.length > 0 && (
          <div className={S.Wrapper}>
            {tick}
            <span className={S.Blink}>|</span>
          </div>
        )}
      </>
    )
  }
}
