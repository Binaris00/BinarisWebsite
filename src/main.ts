/// <reference types="vite/client" />

import {
  initButtonPreset,
  initButtonTheme,
  setThemeButtonName,
  toggleClickSound,
  toggleDropdown,
  togglePresetDropdown,
} from './components/Toolbar'
import { centerCanvas, initDragController } from './components/Canvas'
import { initInternalLinkListeners } from './components/Cards'
import { buttonCenter, buttonClickSound, buttonPreset, buttonTheme } from './dom'
import { initRouter } from './router'

initRouter()

const now = new Date()
document.title = `new Binaris(${now.getDate()}c${now.getMonth() + 1}t${now.getFullYear()})`

setThemeButtonName(document.documentElement.getAttribute('data-color-theme'))

initDragController()
initInternalLinkListeners()
initButtonTheme()
initButtonPreset()

buttonTheme.addEventListener('click', toggleDropdown)
buttonPreset.addEventListener('click', togglePresetDropdown)
buttonClickSound.addEventListener('click', toggleClickSound)
buttonCenter.addEventListener('click', centerCanvas)
