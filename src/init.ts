export const init =
async ($canvas: HTMLCanvasElement) => {
    if (!navigator.gpu) {
        throw new Error("WebGPU not supported on this browser")
    }

    const adapter = await navigator.gpu.requestAdapter()

    if (!adapter) {
        throw new Error("No appropriate GPUAdapter found.")
    }

    const device = await adapter.requestDevice()

    const ctx = $canvas.getContext("webgpu")! as unknown as GPUCanvasContext
    const format = navigator.gpu.getPreferredCanvasFormat()

    ctx.configure({
        device,
        format,
        width: $canvas.width,
        height: $canvas.height,
    })

    return { ctx, device, format }
}