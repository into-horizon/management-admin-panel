import { useState } from 'react'

const useKeyGenerator = () => {
  const [key, setKey] = useState(Math.random())
  return [key, () => setKey(Math.random())] as const
}

export default useKeyGenerator
