import { init, getCode } from "./util.ts"

const $canvas = document.querySelector("canvas")!

const { ctx, device, format, encoder } = await init($canvas)

const module = device.createShaderModule({
    label: "our hardcoded red triangle shaders",
    code: await getCode(import.meta),
})

const pipeline = device.createRenderPipeline({
    label: "our hardcoded red triangle pipeline",
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
    label: "our basic canvas renderPass",
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
    pass.draw(3)
    pass.end()

    device.queue.submit([encoder.finish()])
}

render()