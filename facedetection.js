const {FaceDetector} = require('@nodert-win10/windows.media.faceanalysis')
const {FileAccessMode, StorageFile} = require('@nodert-win10/windows.storage')
const {BitmapDecoder, SoftwareBitmap, BitmapPixelFormat} = require('@nodert-win10/windows.graphics.imaging')

let faceDetector = null

/**
 * Returns a WinRT filestream for a given file path
 *
 * @param {string} file - Path to a file to get as a WinRT filestream
 * @returns {Windows.Storage.Streams.IRandomAccessStream}
 */
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

/**
 * Returns either an already initialized face detector - or
 * creates a new one.
 *
 * @returns {Windows.Media.FaceAnalysis.FaceDetector}
 */
function getFaceDetector () {
  return new Promise((resolve, reject) => {
    if (faceDetector) return resolve(faceDetector)

    FaceDetector.createAsync((err, detector) => {
      if (err) return reject(err)

      faceDetector = detector
      resolve(faceDetector)
    })
  })
}

/**
 * Given a IRandomAccessStream, returns a SoftwareBitmap.
 *
 * @param {Windows.Storage.Streams.IRandomAccessStream} fileStream
 * @returns {Windows.Graphics.Imaging.SoftwareBitmap} softwareBitmap
 */
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

/**
 * Given a SoftwareBitmap, will go and try to detect faces in the image
 * - by first converting the image to gray8 grayscale format and then
 * passing it on to the Windows FaceDetector
 *
 * @param {any} bitmap
 * @returns
 */
function detectFacesInBitmap (bitmap) {
  return new Promise((resolve, reject) => {
    // Decode the image into a grayscale image of type "gray8"
    // This is required for the detector to make out  h u m a n s
    const inputPixelFormat = BitmapPixelFormat.gray8
    const grayBitmap = SoftwareBitmap.convert(bitmap, inputPixelFormat)

    getFaceDetector()
      .then((detector) => {
        detector.detectFacesAsync(grayBitmap, (err, result) => {
          if (err) return reject(err)

          resolve(result.length)
        })
      })
      .catch((err) => reject(err))
  })
}

function detectFaces (path) {
  return getFileStream(path)
    .then(fileStream => getSoftwareBitmap(fileStream))
    .then(bitmap => detectFacesInBitmap(bitmap))
}

module.exports = { getFileStream, getSoftwareBitmap, detectFacesInBitmap, detectFaces }
