## Detect Faces in Electron, using WinRT
This module is mostly meant to serve as an example on how to use the Windows Runtime (WinRT) via NodeRT from Electron, but it totally works.

#### Usage
```
npm install --save electron-face-detection-Windows
```

```js
detectFaces('C:\\Users\\felix\\Pictures\\faces.jpg')
  .then(faces => console.log(`We found ${faces} face${faces > 1 ? 's' : ''}!`))
  .catch(error => console.error('Something went wrong:', error))
```

#### License
MIT