import React from 'react'

interface Props {
  type: string
  mode?: string
  className?: string
  style?: React.CSSProperties
}

// https://remixicon.com
export const Icon = (props: Props): React.ReactElement => {
  const { type = '', mode = 'line', className = '', style = {} } = props

  return (
    <i className={`ri-${type}-${mode || 'line'} ${className}`} style={style} />
  )
}
