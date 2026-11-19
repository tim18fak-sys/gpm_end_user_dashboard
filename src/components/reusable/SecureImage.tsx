import { useEffect, useState } from 'react'
import { useGetFileAccessUrl } from '@/hooks/useGetFileAccessUrl'

export interface SecureImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'onError'
> {
  src: string
  alt: string
}

export const SecureImage = ({ src, alt, ...rest }: SecureImageProps) => {
  const [accessUrl, setAccessUrl] = useState('')
  const [fallbackAttempted, setFallbackAttempted] = useState(false)
  const { data, isLoading, error } = useGetFileAccessUrl(src)

  useEffect(() => {
    setAccessUrl('')
    setFallbackAttempted(false)
  }, [src])

  if (isLoading) return <p>Loading...</p>
  if (error || !data) return <p role="status">Error loading image</p>

  return (
    <img
      src={accessUrl || src}
      alt={alt}
      {...rest}
      onError={() => {
        if (!fallbackAttempted && data !== src) {
          setFallbackAttempted(true)
          setAccessUrl(data)
        }
      }}
    />
  )
}

export default SecureImage
