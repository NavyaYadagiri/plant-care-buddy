// iPhone photos are often HEIC, which most browsers (Chrome, Edge, Firefox) cannot decode.
function isHeic(file) {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
}

// The HEIC converter is large, so it is only downloaded when a HEIC photo is picked.
async function toDecodableBlob(file) {
  if (!isHeic(file)) return file
  const { default: heic2any } = await import('heic2any')
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  return Array.isArray(result) ? result[0] : result
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('decode failed'))
    }
    img.src = url
  })
}

// Shrinks a photo to a small JPEG data URL so many plants fit in localStorage (~5 MB).
export async function resizeImage(file, maxSize = 480, quality = 0.8) {
  let img
  try {
    img = await loadImage(await toDecodableBlob(file))
  } catch {
    throw new Error(
      `Couldn't read "${file.name}". Try a JPG, PNG or WebP photo instead.`,
    )
  }

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}
