<h1>
x-spectrogram <a href="https://npmjs.org/package/x-spectrogram"><img src="https://img.shields.io/badge/npm-v1.0.0-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-126-FFF.svg?colorA=000"/></a> <a href="https://cdn.jsdelivr.net/npm/x-spectrogram@1.0.0/dist/x-spectrogram.min.js"><img src="https://img.shields.io/badge/brotli-2.4K-333.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

Audio spectrogram Web Component.

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i x-spectrogram </code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add x-spectrogram </code>
</td><td title="Triple click to select and copy paste">
<code>yarn add x-spectrogram</code>
</td></tr></table>
</h4>

## Examples

<details id="example$web" title="web" open><summary><span><a href="#example$web">#</a></span>  <code><strong>web</strong></code></summary>  <ul><p></p>  <a href="https://stagas.github.io/x-spectrogram/example/web.html"><img width="274.2857142857143" src="example/web.png"></img>  <p><strong>Try it live</strong></p></a>    <details id="source$web" title="web source code" ><summary><span><a href="#source$web">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/web.ts">example/web.ts</a>  <p>

```ts
import { fetchAudioBuffer } from 'webaudio-tools'
import { SpectrogramElement } from 'x-spectrogram'

customElements.define('x-spectrogram', SpectrogramElement)
document.body.innerHTML = `
<div id="demo" style="display:inline-flex;height:80px;">
  <x-spectrogram autoresize></x-spectrogram>
</div>
`

const ctx = new AudioContext({ sampleRate: 44100, latencyHint: 'playback' })

const analyser = ctx.createAnalyser()
analyser.fftSize = 4096
analyser.smoothingTimeConstant = 0
analyser.maxDecibels = 0
analyser.minDecibels = -100

// @ts-ignore
const url = new URL('alpha_molecule.ogg', import.meta.url).toString()

fetchAudioBuffer(ctx, url).then(audioBuffer => {
  const source = ctx.createBufferSource()
  source.buffer = audioBuffer
  source.loop = true
  source.connect(ctx.destination)
  source.start(0, 30)
  source.connect(analyser)
  ;(document.querySelector('x-spectrogram') as SpectrogramElement).analyser =
    analyser
})

window.onclick = () => ctx.state !== 'running' ? ctx.resume() : ctx.suspend()
if (ctx.state !== 'running')
  document.body.appendChild(new Text('click to start/stop'))
```

</p>
</details></ul></details>

## API

<p>  <details id="SpectrogramElement$1" title="Class" open><summary><span><a href="#SpectrogramElement$1">#</a></span>  <code><strong>SpectrogramElement</strong></code>    </summary>  <a href="src/x-spectrogram.ts#L27">src/x-spectrogram.ts#L27</a>  <ul>        <p>  <details id="constructor$3" title="Constructor" ><summary><span><a href="#constructor$3">#</a></span>  <code><strong>constructor</strong></code><em>()</em>    </summary>    <ul>    <p>  <details id="new SpectrogramElement$4" title="ConstructorSignature" ><summary><span><a href="#new SpectrogramElement$4">#</a></span>  <code><strong>new SpectrogramElement</strong></code><em>()</em>    </summary>    <ul><p><a href="#SpectrogramElement$1">SpectrogramElement</a></p>        </ul></details></p>    </ul></details><details id="analyser$13" title="Property" ><summary><span><a href="#analyser$13">#</a></span>  <code><strong>analyser</strong></code>    </summary>  <a href="src/x-spectrogram.ts#L47">src/x-spectrogram.ts#L47</a>  <ul><p><span>AnalyserNode</span></p>        </ul></details><details id="autoResize$5" title="Property" ><summary><span><a href="#autoResize$5">#</a></span>  <code><strong>autoResize</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>false</code></span>  </summary>  <a href="src/x-spectrogram.ts#L32">src/x-spectrogram.ts#L32</a>  <ul><p>boolean</p>        </ul></details><details id="background$9" title="Property" ><summary><span><a href="#background$9">#</a></span>  <code><strong>background</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'#123'</code></span>  </summary>  <a href="src/x-spectrogram.ts#L38">src/x-spectrogram.ts#L38</a>  <ul><p>string</p>        </ul></details><details id="color$10" title="Property" ><summary><span><a href="#color$10">#</a></span>  <code><strong>color</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'#1ff'</code></span>  </summary>  <a href="src/x-spectrogram.ts#L39">src/x-spectrogram.ts#L39</a>  <ul><p>string</p>        </ul></details><details id="height$8" title="Property" ><summary><span><a href="#height$8">#</a></span>  <code><strong>height</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>50</code></span>  </summary>  <a href="src/x-spectrogram.ts#L36">src/x-spectrogram.ts#L36</a>  <ul><p>number</p>        </ul></details><details id="maxFreq$12" title="Property" ><summary><span><a href="#maxFreq$12">#</a></span>  <code><strong>maxFreq</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>21000</code></span>  </summary>  <a href="src/x-spectrogram.ts#L42">src/x-spectrogram.ts#L42</a>  <ul><p>number</p>        </ul></details><details id="minFreq$11" title="Property" ><summary><span><a href="#minFreq$11">#</a></span>  <code><strong>minFreq</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>62</code></span>  </summary>  <a href="src/x-spectrogram.ts#L41">src/x-spectrogram.ts#L41</a>  <ul><p>number</p>        </ul></details><details id="pixelRatio$6" title="Property" ><summary><span><a href="#pixelRatio$6">#</a></span>  <code><strong>pixelRatio</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>window.devicePixelRatio</code></span>  </summary>  <a href="src/x-spectrogram.ts#L33">src/x-spectrogram.ts#L33</a>  <ul><p>number</p>        </ul></details><details id="width$7" title="Property" ><summary><span><a href="#width$7">#</a></span>  <code><strong>width</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>150</code></span>  </summary>  <a href="src/x-spectrogram.ts#L35">src/x-spectrogram.ts#L35</a>  <ul><p>number</p>        </ul></details><details id="start$35" title="Method" ><summary><span><a href="#start$35">#</a></span>  <code><strong>start</strong></code><em>()</em>     &ndash; Start displaying the spectrum.</summary>  <a href="src/x-spectrogram.ts#L69">src/x-spectrogram.ts#L69</a>  <ul>    <p>      <p><strong>start</strong><em>()</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="stop$37" title="Method" ><summary><span><a href="#stop$37">#</a></span>  <code><strong>stop</strong></code><em>()</em>     &ndash; Stop displaying the spectrum.</summary>  <a href="src/x-spectrogram.ts#L75">src/x-spectrogram.ts#L75</a>  <ul>    <p>      <p><strong>stop</strong><em>()</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p></ul></details></p>

## Credits

- [mixter](https://npmjs.org/package/mixter) by [stagas](https://github.com/stagas) &ndash; A Web Components framework.
- [webaudio-tools](https://npmjs.org/package/webaudio-tools) by [stagas](https://github.com/stagas) &ndash; useful tools for webaudio

## Contributing

[Fork](https://github.com/stagas/x-spectrogram/fork) or [edit](https://github.dev/stagas/x-spectrogram) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
