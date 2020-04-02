import React from 'react'
import ImageWithZoom from 'react-medium-image-zoom'

interface ImageProps {
  alt: string
  className: string
  loading: string
  src: string
  title: string
}

export const Image = (props: ImageProps): React.ReactElement => {
  const imageProps = {
    ...props,
    style: {
      width: '100%'
    }
  }

  return <ImageWithZoom image={imageProps} zoomImage={imageProps} />
}
