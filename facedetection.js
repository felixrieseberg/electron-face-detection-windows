const {FaceDetector} = require('@nodert-win10/windows.media.faceanalysis')
const {FileAccessMode, StorageFile} = require('@nodert-win10/windows.storage')
const {BitmapDecoder, SoftwareBitmap, BitmapPixelFormat} = require('@nodert-win10/windows.graphics.imaging')

function getFileStream (file) {
  return new Promise((resolve, reject) => {
    StorageFile.getFileFromPathAsync(file, (err, storageFile) => {
      if (err) return reject(err)

      storageFile.openAsync(FileAccessMode.read, (err, fileStream) => {
        if (err) return reject(err)

        resolve(fileStream)
      })
    })
  })
}

function getSoftwareBitmap (fileStream) {
  return new Promise((resolve, reject) => {
    BitmapDecoder.createAsync(fileStream, (err, decoder) => {
      if (err) return reject(err)

      decoder.getSoftwareBitmapAsync((err, bitmap) => {
        if (err) return reject(err)

        resolve(bitmap)
      })
    })
  })
}

function detectFacesInBitmap (bitmap) {
  return new Promise((resolve, reject) => {
    // Decode the image into a grayscale image of type "gray8"
    // This is required for the detector to make out  h u m a n s
    const inputPixelFormat = BitmapPixelFormat.gray8
    const grayBitmap = SoftwareBitmap.convert(bitmap, inputPixelFormat)

    FaceDetector.createAsync((err, detector) => {
      if (err) return reject(err)

      detector.detectFacesAsync(grayBitmap, (err, result) => {
        if (err) return reject(err)

        resolve(result.length)
      })
    })
  })
}

function detectFaces (path) {
  return getFileStream(path)
    .then(fileStream => getSoftwareBitmap(fileStream))
    .then(bitmap => detectFacesInBitmap(bitmap))
}

module.exports = { getFileStream, getSoftwareBitmap, detectFacesInBitmap, detectFaces }
