import { init, getCode } from "./util.ts"

const $canvas = document.querySelector("canvas")!

const { ctx, device, format, encoder } = await init($canvas)

const module = device.createShaderModule({
    label: "doubling compute module",
    code: await getCode(import.meta),
})

const pipeline = device.createComputePipeline({
    label: "doubling compute pipeline",
    layout: "auto",
    compute: {
        module,
        entryPoint: "computeSomething",
    }
})

const input = new Float32Array([1, 3, 5])

const workBuffer = device.createBuffer({
    label: "work buffer",
    size: input.byteLength,
    usage: 0
        | GPUBufferUsage.STORAGE
        | GPUBufferUsage.COPY_SRC
        | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(workBuffer, 0, input)

const resultBuffer = device.createBuffer({
    label: "result buffer",
    size: input.byteLength,
    usage: 0
        | GPUBufferUsage.MAP_READ
        | GPUBufferUsage.COPY_DST,
})

const bindGroup = device.createBindGroup({
    label: "bindGroup for work buffer",
    layout: pipeline.getBindGroupLayout(0),
    entries: [
        { binding: 0, resource: { buffer: workBuffer }},
    ]
})

const pass = encoder.beginComputePass({
    label: "doubling compute pass",
})

pass.setPipeline(pipeline)
pass.setBindGroup(0, bindGroup)
pass.dispatchWorkgroups(input.length)
pass.end()

encoder.copyBufferToBuffer(
    workBuffer, 0,
    resultBuffer, 0,
    resultBuffer.size,
)

device.queue.submit([encoder.finish()])

await resultBuffer.mapAsync(GPUMapMode.READ)
const result = new Float32Array(resultBuffer.getMappedRange())

console.log("input", input)
console.log("result", result)

resultBuffer.unmap()