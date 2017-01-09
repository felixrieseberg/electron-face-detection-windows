const {detectFaces} = require('./facedetection')

// Doing things by hand:
// getFileStream('C:\\Users\\felix\\Pictures\\faces.jpg')
//   .then(fileStream => getSoftwareBitmap(fileStream))
//   .then(bitmap => detectFacesInBitmap(bitmap))
//   .then(faces => console.log(`We found ${faces} face${faces > 1 ? 's' : ''}!`))

// Full auto
detectFaces('C:\\Users\\felix\\Pictures\\faces.jpg')
  .then(faces => console.log(`We found ${faces} face${faces > 1 ? 's' : ''}!`))
