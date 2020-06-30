var spawn = require('child_process').spawn

var defaultArguments = [
  '--fullscreen',
  '--loop',
  '--no-video-title'
]

var videoPlayer;

class vlc {
  constructor (filePath, options) {
    if (typeof filePath !== 'string') this._throwError('please provide path to a file')

    if (options != null && options.arguments != null) {
      this._arguments = options.arguments
    } else {
      this._arguments = defaultArguments
    }

    this._callbacks = {}

    // vlc://quit quits vlc after the video is done playing.
    var args = [].concat(this._arguments, [
      '--extraintf', 'http',
      '--http-password', this._password,
      '--http-port', this._port,
      filePath,
      'vlc://quit'
    ])

    videoPlayer = spawn('cvlc', args, {stdio: 'ignore'})

    videoPlayer.on('exit', () => {
      this._callbacks.end()
      videoPlayer = null;
    })
  }

  on (what, cb) {
    if (typeof cb !== 'function') {
      this._throwError(`please provide a callback function for the '${what}' event`)
    }
    this._callbacks[what] = cb
  }

  quit () {
    if (videoPlayer) videoPlayer.kill('SIGKILL')
  }

  _throwError (error) {
    this.quit()
    throw new Error('VLC: ' + error.toString())
  }
}

module.exports = vlc