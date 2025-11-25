import React, { FC } from 'react'

type DisplayObjectProps = {
  data: Record<string, string | number | boolean | null | object>
}
const DisplayObject: FC<DisplayObjectProps> = ({ data }) => {
  if (!data) return null
  return (
    <div>
      <ul>
        {Object.entries(data).map(([key, value]) => {
          if (!!value && typeof value === 'object') {
            return (
              <li key={key}>
                <strong>{key}:</strong>
                <DisplayObject data={value as DisplayObjectProps['data']} />
              </li>
            )
          }
          return (
            <li key={key}>
              <p>
                <strong>{key}:</strong>{' '}
                <span>
                  {String(value).length >= 200
                    ? String(value).substring(0, 200).padEnd(190, '.')
                    : String(value)}
                </span>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default DisplayObject
