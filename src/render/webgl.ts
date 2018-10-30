import CreateWebGLBuffer from '../render/webgl-buffer'
import CreateWebGL from '../render/webgl-utils'
import TextFG from '../render/webgl-text-fg'
import TextBG from '../render/webgl-text-bg'

const nutella = () => {
  const foregroundGL = CreateWebGL({ alpha: true, preserveDrawingBuffer: true })
  const backgroundGL = CreateWebGL({ alpha: true, preserveDrawingBuffer: true })

  const textFGRenderer = TextFG(foregroundGL)
  const textBGRenderer = TextBG(backgroundGL)
  const sharedDataBuffer = new Float32Array()
  const gridBuffer = CreateWebGLBuffer()

  textBGRenderer.share(sharedDataBuffer)
  textFGRenderer.share(sharedDataBuffer)

  // TODO: when we resize, do we have to redraw the scene?
  // yes and no. it squishes all the pixels together as if you
  // were to resize <-width-> in potatoshoppe
  const resize = (rows: number, cols: number) => {
    const resizedBuffer = new Float32Array(rows * cols * 4)
    textBGRenderer.share(resizedBuffer)
    textFGRenderer.share(resizedBuffer)
    gridBuffer.resize(rows, cols)
    textBGRenderer.resize(rows, cols)
    textFGRenderer.resize(rows, cols)
  }

  const render = (foregroundElements?: number, backgroundElements?: number) => {
    textBGRenderer.render(backgroundElements)
    textFGRenderer.render(foregroundElements)
  }

  const updateColorAtlas = (colorAtlas: HTMLCanvasElement) => {
    textBGRenderer.updateColorAtlas(colorAtlas)
    textFGRenderer.updateColorAtlas(colorAtlas)
  }

  const clear = () => {
    textBGRenderer.clear()
    textFGRenderer.clear()
  }

  return {
    clear,
    render,
    resize,
    updateColorAtlas,
    getGridBuffer: () => gridBuffer,
    getBuffer: () => sharedDataBuffer,
    foregroundElement: foregroundGL.canvasElement,
    backgroundElement: backgroundGL.canvasElement,
  }
}

export default nutella
export type WebGLWrenderer = ReturnType<typeof nutella>
