import { init, getCode } from "./util.ts"

const $canvas = document.querySelector("canvas")!

const { ctx, device, format, encoder } = await init($canvas)

const module = device.createShaderModule({
    code: await getCode(import.meta),
})

const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
        module,
        entryPoint: "vs",
    },
    fragment: {
        module,
        entryPoint: "fs",
        targets: [{ format }],
    }
})

const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
        {
            view: ctx.getCurrentTexture().createView(),
            clearValue: [0.9, 0.9, 0.95, 1],
            loadOp: "clear",
            storeOp: "store",
        }
    ]
}

const render = () => {
    const pass = encoder.beginRenderPass(renderPassDescriptor)
    pass.setPipeline(pipeline)
    pass.draw(6)
    pass.end()

    device.queue.submit([encoder.finish()])
}

render()