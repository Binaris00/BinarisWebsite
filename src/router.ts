import { safelyCheckPreset } from './core/loader'

export function initRouter(): void {
  const preset = window.location.hash.substring(1)
  safelyCheckPreset(preset)
}