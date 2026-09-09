// =========================================================================================
// handles all the audio parts of the page!!... Only one tho
// =========================================================================================

import { clickSoundActive } from './state'

const clickSound = new Audio('https://files.catbox.moe/yp5pf1.wav')

export function playSound(): void {
  if (!clickSoundActive) return
  clickSound.currentTime = 0
  clickSound.play()
}