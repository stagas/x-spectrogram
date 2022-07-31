import $ from 'sigl'

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

export interface SpectrogramElement extends $.Element<SpectrogramElement> {}

@$.element()
export class SpectrogramElement extends HTMLElement {
  root = $.shadow(this, /*html*/ `<style>${style}</style><canvas></canvas>`)

  @$.attr() autoResize = false
  @$.attr() pixelRatio = window.devicePixelRatio

  @$.attr() width = 150
  @$.attr() height = 50

  @$.attr() background = '#123'
  @$.attr() color = '#1ff'

  @$.attr() minFreq = 62
  @$.attr() maxFreq = 21000

  // @ts-ignore
  workerUrl = new URL('./x-spectrogram-worker.js', import.meta.url).href
  worker: Worker | null = new Worker(this.workerUrl, { type: 'module' })
  workerData?: Float32Array // = new Float32Array([0])

  analyser?: AnalyserNode
  analyserData = new Float32Array([0])
  getFFTLogIndex?: (normal: number) => number
  renderNextAnimFrame?: () => void
  canvas?: HTMLCanvasElement
  // screen?: {
  //   canvas: HTMLCanvasElement
  //   ctx: CanvasRenderingContext2D
  // }
  draw?: () => void
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

  destroy = $(this).reduce(({ worker }) => () => worker.terminate())

  mounted($: SpectrogramElement['$']) {
    let animFrame: any

    $.effect(({ root, worker }) => {
      if ($.canvas) return

      const canvas = $.canvas = root.querySelector('canvas') as HTMLCanvasElement

      // @ts-ignore
      const offscreen = canvas.transferControlToOffscreen()

      worker.postMessage({ canvas: offscreen }, [offscreen])
    })

    $.effect(({ worker, canvas, background, width, height, pixelRatio }) => {
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'

      worker.postMessage({
        pixelRatio,
        width,
        height,
        background,
      })
    })

    $.analyserData = $.reduce(({ analyser }) => new Float32Array(analyser.frequencyBinCount))
    $.workerData = $.reduce(({ analyser }) => new Float32Array(new SharedArrayBuffer(analyser.frequencyBinCount * 4)))

    $.draw = $.reduce(({ analyser, analyserData, workerData, minFreq, maxFreq, worker }) => {
      cancelAnimationFrame(animFrame)

      worker.postMessage({
        analyserData: workerData,
        minFreq,
        maxFreq,
        sampleRate: analyser.context.sampleRate,
        frequencyBinCount: analyser.frequencyBinCount,
      })

      return function draw() {
        animFrame = requestAnimationFrame(draw)

        // NOTE: it's a pity we can't write directly to the
        // shared buffer and we have to perform a copy
        analyser.getFloatFrequencyData(analyserData)
        workerData.set(analyserData)
      }
    })

    $.loop = $.reduce(({ draw, worker }) => ({
      start() {
        animFrame = requestAnimationFrame(draw)
        worker.postMessage({ start: true })
      },
      stop() {
        cancelAnimationFrame(animFrame)
        worker.postMessage({ stop: true })
      },
    }))

    $.effect(({ loop }) => {
      loop.start()
      return () => loop.stop()
    })
  }
}
