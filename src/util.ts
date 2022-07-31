/**
 * Returns a function that converts normalized FFT output for a given range
 * from linear to logarithmic scale, used for drawing spectrograms.
 *
 * @credits https://github.com/fenomas/webaudio-viz
 * @param minFreq Minimum frequency.
 * @param maxFreq Maximum frequency.
 * @param sampleRate Sample rate.
 * @returns A funtion that accepts the normal FFT
 */
export const fftLogIndexer = (minFreq: number, maxFreq: number, sampleRate: number, fftSize: number) => {
  const lo = Math.log2(minFreq)
  const hi = Math.log2(maxFreq)
  const scale = hi - lo
  const nyquist = sampleRate / 2
  return (normal: number) => {
    const freq = 2 ** (lo + normal * scale)
    return (freq / nyquist * fftSize) | 0
  }
}
/**
 * Convert dBFS value `db` to float.
 *
 * @param db Value in dBFS
 * @returns the value in float
 */
export const dbToFloat = (db: number) => 10 ** (db / 20)

/**
 * Convert float value `float` to dBFS.
 *
 * @param float Value in float
 * @returns the value in dBFS
 */
export const floatToDb = (float: number) => 20 * Math.log10(float)
