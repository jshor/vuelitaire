/**
 * Attaches a leading zero to a number to be a two-digit string.
 *
 * @example leadZero(1) -> `01`
 * @param {string} t - number to format
 * @returns {string}
 */
function leadZero (t: number): string {
  const f: string = Math.floor(t).toString()

  return f.length >= 2 ? f : `0${f}`
}

/**
 * Formats seconds to a visual clock in the format: HH:MM:SS.
 *
 * @remarks
 *  * If hours elapsed, show HH:MM:SS.
 *  * If only minutes elapsed, show only MM:SS.
 *  * If only seconds elapsed, show SS.
 * @param {number} s - number of seconds elapsed
 * @returns {string}
 */
export default function formatClock (s: number) {
  const ss: string = leadZero(s % 60)
  const mm: string = leadZero((s / 60) % 60)
  const hh: number = Math.floor(s / 3600)

  if (hh > 0) {
    return `${hh}:${mm}:${ss}`
  } else if (mm !== '00') {
    return `${parseInt(mm, 10)}:${ss}`
  }
  return parseInt(ss, 10)
}
