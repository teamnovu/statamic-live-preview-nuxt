const { resolve } = require('path')

function livePreviewModule(_moduleOptions) {
    this.addPlugin({
        src: resolve(__dirname, 'interceptAxiosPlugin.js'),
        fileName: 'live-preview-intercept-axios.js'
    })

    this.addPlugin({
        src: resolve(__dirname, 'liveUpdatePlugin.js'),
        fileName: 'live-preview-event-handler.js',
        template: {
            ssr: false
        }
    })
}

module.exports = livePreviewModule
module.exports.meta = require('../package.json')
