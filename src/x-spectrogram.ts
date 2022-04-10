import { attrs, mixter, props, shadow, state } from 'mixter'
import { dbToFloat, fftLogIndexer } from 'webaudio-tools'

const style = /*css*/ `
:host {
  display: inline-flex;
  outline: none;
  user-select: none;
  touch-action: none;
}

:host([autoresize]) {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

:host([autoresize]) canvas {
  width: 100% !important;
  height: 100% !important;
}

canvas {
  image-rendering: pixelated;
}`

export class SpectrogramElement extends mixter(
  HTMLElement,
  shadow(`<style>${style}</style><canvas></canvas>`),
  attrs(
    class {
      autoResize = false
      pixelRatio = window.devicePixelRatio

      width = 150
      height = 50

      background = '#123'
      color = '#1ff'

      minFreq = 62
      maxFreq = 21000
    }
  ),
  props(
    class {
      analyser?: AnalyserNode
      /** @private */
      analyserData = new Float32Array([0])
      /** @private */
      getFFTLogIndex?: (normal: number) => number
      /** @private */
      renderNextAnimFrame?: () => void
      /** @private */
      screen?: {
        canvas: HTMLCanvasElement
        ctx: CanvasRenderingContext2D
      }
      /** @private */
      draw?: () => void
      /** @private */
      loop?: {
        start(): void
        stop(): void
      }
      /**
       * Start displaying the spectrum.
       */
      start() {
        this.loop?.start()
      }
      /**
       * Stop displaying the spectrum.
       */
      stop() {
        this.loop?.stop()
      }
    }
  ),
  state<SpectrogramElement>(({ $, effect, reduce }) => {
    let animFrame: any

    $.screen = reduce(({ root }) => {
      const canvas = root.querySelector('canvas')!
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      })!
      return { canvas, ctx }
    })

    effect(({ screen: { canvas, ctx }, background, width, height, pixelRatio }) => {
      const w = width * pixelRatio | 0
      const h = height * pixelRatio | 0
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w
        canvas.height = h
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    })

    $.analyserData = reduce(({ analyser }) => new Float32Array(analyser.frequencyBinCount))

    $.getFFTLogIndex = reduce(({ analyser, minFreq, maxFreq }) =>
      fftLogIndexer(
        minFreq,
        maxFreq,
        analyser.context.sampleRate,
        analyser.frequencyBinCount
      )
    )

    $.draw = reduce(({ analyser, analyserData, screen: { canvas, ctx }, pixelRatio, getFFTLogIndex }) => {
      cancelAnimationFrame(animFrame)
      return function draw() {
        animFrame = requestAnimationFrame(draw)
        analyser.getFloatFrequencyData(analyserData)

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
    })

    $.loop = reduce(({ draw }) => ({
      start() {
        animFrame = requestAnimationFrame(draw)
      },
      stop() {
        cancelAnimationFrame(animFrame)
      },
    }))

    effect(({ loop }) => {
      loop.start()
      return () => loop.stop()
    })
  })
) {}
