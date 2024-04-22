import { init, getCode } from "./util.ts"

const $canvas = document.querySelector("canvas")!

const { ctx, device, format, encoder } = await init($canvas)

const vertices = new Float32Array([
    -0.8, -0.8,
     0.8, -0.8,
     0.8,  0.8,
    
    -0.8, -0.8,
     0.8,  0.8,
    -0.8,  0.8,
])

const vertexBuffer = device.createBuffer({
    label: "Cell vertices",
    size: vertices.byteLength,
    usage: 0
        | GPUBufferUsage.VERTEX
        | GPUBufferUsage.COPY_DST,
})

device.queue.writeBuffer(
    vertexBuffer,
    0,
    vertices,
)

const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: Float32Array.BYTES_PER_ELEMENT * 2, // 4 * 2 = 8
    attributes: [{
        format: "float32x2",
        offset: 0,
        shaderLocation: 0,
    }]
}

const cellShaderModule = device.createShaderModule({
    label: "Cell shader",
    code: await getCode(import.meta),
})

const cellPipeline = device.createRenderPipeline({
    label: "Cell pipeline",
    layout: "auto",
    vertex: {
        module: cellShaderModule,
        entryPoint: "vertexMain",
        buffers: [vertexBufferLayout],
    },
    fragment: {
        module: cellShaderModule,
        entryPoint: "fragmentMain",
        targets: [{ format }],
    }
})

const pass = encoder.beginRenderPass({
    colorAttachments: [{
        view: ctx.getCurrentTexture().createView(),
        loadOp: "clear",
        clearValue: [0, 0, 0.4, 1],
        storeOp: "store",
    }]
})

pass.setPipeline(cellPipeline)
pass.setVertexBuffer(0, vertexBuffer)
pass.draw(vertices.length / 2)

pass.end()

device.queue.submit([encoder.finish()])
