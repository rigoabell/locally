export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp'

export type ImageProcessOptions = {
  width: number
  height: number
  quality: number
  format: ImageFormat
  lockAspect: boolean
}

export type ProcessedImage = {
  blob: Blob
  width: number
  height: number
  url: string
}

export const FORMAT_EXTENSION: Record<ImageFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function loadImageSize(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  const size = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  return size
}

export function fitSize(
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
  lockAspect: boolean,
): { width: number; height: number } {
  const max = 8192
  let nextWidth = Math.min(max, Math.max(1, Math.round(width)))
  let nextHeight = Math.min(max, Math.max(1, Math.round(height)))
  if (lockAspect && sourceWidth > 0 && sourceHeight > 0) {
    const ratio = sourceWidth / sourceHeight
    if (nextWidth / nextHeight > ratio) {
      nextWidth = Math.max(1, Math.round(nextHeight * ratio))
    } else {
      nextHeight = Math.max(1, Math.round(nextWidth / ratio))
    }
  }
  return { width: nextWidth, height: nextHeight }
}

export async function processImage(file: File, options: ImageProcessOptions): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file)
  const size = fitSize(bitmap.width, bitmap.height, options.width, options.height, options.lockAspect)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Canvas is not available in this browser.')
  }
  if (options.format !== 'image/png') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, size.width, size.height)
  }
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, size.width, size.height)
  bitmap.close()

  const quality = Math.min(1, Math.max(0.1, options.quality))
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result)
        else reject(new Error('Could not encode the image in this browser.'))
      },
      options.format,
      quality,
    )
  })

  return {
    blob,
    width: size.width,
    height: size.height,
    url: URL.createObjectURL(blob),
  }
}
