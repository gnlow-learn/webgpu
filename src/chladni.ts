import { init, getCode } from "./util.ts"

const $canvas = document.querySelector("canvas")!

const { ctx, device, format } = await init($canvas)

const waitTick = () => new Promise(requestAnimationFrame)

const module = device.createShaderModule({
    code: await getCode(import.meta),
})

const frameCountBuffer = device.createBuffer({
    size: 4,
    usage: 0
        | GPUBufferUsage.UNIFORM
        | GPUBufferUsage.COPY_DST
})

const bindGroupLayout = device.createBindGroupLayout({
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" },
        }
    ]
})

const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
        {
            binding: 0,
            resource: {
                buffer: frameCountBuffer,
            }
        }
    ]
})

const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [ bindGroupLayout ],
})

const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
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

const renderPassDescriptor =
(): GPURenderPassDescriptor => ({
    colorAttachments: [
        {
            view: ctx.getCurrentTexture().createView(),
            clearValue: [0.9, 0.9, 0.95, 1],
            loadOp: "clear",
            storeOp: "store",
        }
    ]
})

let frameCount = 0

const render = () => {
    device.queue.writeBuffer(
        frameCountBuffer,
        0,
        new Float32Array([frameCount]),
    )

    const encoder = device.createCommandEncoder()
    const pass = encoder.beginRenderPass(renderPassDescriptor())
    pass.setPipeline(pipeline)
    pass.setBindGroup(0, bindGroup)
    pass.draw(6)
    pass.end()

    device.queue.submit([encoder.finish()])

    frameCount++

    if (!(frameCount % 100)) console.log(frameCount)
}

while (true) {
    await waitTick()
    render()
}