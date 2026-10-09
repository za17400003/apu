// Geometría del croquis 2D de un muro: dónde dibujar cada abertura.
// Es una vista aproximada a partir de las medidas capturadas, no un plano:
// las aberturas se reparten a lo ancho con espacios iguales porque la app
// no captura su posición horizontal exacta (ver docs/01-diseno-visual.md).

import { Superficie } from './types'

export interface RectAbertura {
  id: string
  x: number // desde la izquierda del muro, en metros
  y: number // desde el piso, en metros
  ancho: number
  alto: number
  /** La abertura capturada no cupo tal cual: se recortó o se movió para poder dibujarla. */
  ajustada: boolean
}

export interface GeometriaMuro {
  ancho: number
  alto: number
  aberturas: RectAbertura[]
  avisos: string[]
}

export function geometriaMuro(muro: Superficie): GeometriaMuro {
  const ancho = muro.ancho_m > 0 ? muro.ancho_m : 0.01
  const alto = muro.alto_m > 0 ? muro.alto_m : 0.01
  const avisos: string[] = []

  const anchosClipeados = muro.aberturas.map((a) => Math.min(Math.max(a.ancho_m, 0), ancho))
  const anchoTotal = anchosClipeados.reduce((s, w) => s + w, 0)
  const huecos = muro.aberturas.length + 1
  const espacioLibre = ancho - anchoTotal
  let margen = espacioLibre / huecos

  if (espacioLibre < 0) {
    margen = 0
    avisos.push('Las aberturas no caben en el ancho del muro: revisa las medidas.')
  }

  const aberturas: RectAbertura[] = []
  let cursor = margen

  muro.aberturas.forEach((a, i) => {
    const anchoA = anchosClipeados[i]
    let altoA = a.alto_m
    const y0 = Math.max(a.altura_piso_m ?? 0, 0)
    let ajustada = anchoA !== a.ancho_m

    if (y0 >= alto) {
      avisos.push(`La abertura ${i + 1} queda por arriba del muro: revisa la altura desde el piso.`)
      cursor += anchoA + margen
      return
    }
    if (y0 + altoA > alto) {
      altoA = alto - y0
      ajustada = true
      avisos.push(`La abertura ${i + 1} se recortó porque no cabe en la altura del muro.`)
    }

    aberturas.push({ id: a.id, x: cursor, y: y0, ancho: anchoA, alto: altoA, ajustada })
    cursor += anchoA + margen
  })

  return { ancho, alto, aberturas, avisos }
}
