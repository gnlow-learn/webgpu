import { init, getCode } from "./util.ts"

const $canvas = document.querySelector("canvas")!

const { ctx, device, format, encoder } = await init($canvas)

const module = device.createShaderModule({
    label: "doubling compute module",
    code: await getCode(import.meta),
})