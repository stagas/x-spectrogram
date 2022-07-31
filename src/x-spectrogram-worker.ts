import { dbToFloat, fftLogIndexer } from './util'

export {}

let canvas: any
let pixelRatio: any
let analyserData: any
let getFFTLogIndex: any

let animFrame: any
const draw = () => {
  animFrame = requestAnimationFrame(draw)
  if (!analyserData || !getFFTLogIndex || !isFinite(analyserData[0]) || analyserData[0] === 0) return

  ctx.drawImage(ctx.canvas, 0, -1, canvas.width, canvas.height)

  for (let i = 0; i < canvas.width; i++) {
    const ni = i / canvas.width
    const index = getFFTLogIndex(ni)
    const db = analyserData[index]
    const n = dbToFloat(db)
    const val = Math.tanh((n ** 0.55) * 8.5)

    if (!isFinite(val)) return

    const h = (150 + (100 - 100 * val)) | 0
    const s = (40 + 50 * val) | 0
    const l = (15 + 55 * val) | 0

    ctx.fillStyle = `hsl(${h},${s}%,${l}%)`
    ctx.fillRect(i, canvas.height - 1, i + pixelRatio, 1)
  }
}

const start = () => {
  cancelAnimationFrame(animFrame)
  draw()
}

const stop = () => {
  cancelAnimationFrame(animFrame)
}

let ctx: any

self.onmessage = (e: any) => {
  if (e.data.canvas) {
    //!? 'received canvas from main thread'
    canvas = e.data.canvas
    ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    })
  } else if (e.data.width) {
    pixelRatio = e.data.pixelRatio

    const width = e.data.width
    const height = e.data.height
    const w = width * pixelRatio | 0
    const h = height * pixelRatio | 0
    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w
      canvas.height = h
      ctx.fillStyle = e.data.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  } else if (e.data.start)
    start()
  else if (e.data.stop)
    stop()
  else if (e.data.analyserData) {
    analyserData = e.data.analyserData
    getFFTLogIndex = fftLogIndexer(
      e.data.minFreq,
      e.data.maxFreq,
      e.data.sampleRate,
      e.data.frequencyBinCount
    )
  }
}
