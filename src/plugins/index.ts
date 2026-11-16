import flexPlugin from './flexPlugin'
import dimensionsPlugin from './dimensionsPlugin'
import shortHandsPlugin from './shortHandsPlugin'
import cleanerPlugin from './cleanerPlugin'

const plugins = [
    cleanerPlugin(),
    flexPlugin(),
    dimensionsPlugin(),
    shortHandsPlugin()
]

export default plugins