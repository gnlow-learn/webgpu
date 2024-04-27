@group(0)
@binding(0)
var<uniform> t: f32;

@vertex fn vs(
    @builtin(vertex_index)
    vertexIndex: u32
) ->
@builtin(position)
vec4f {
    let pos = array(
        vec2f(-1,  1),
        vec2f(-1, -1),
        vec2f( 1, -1),
        vec2f(-1,  1),
        vec2f( 1,  1),
        vec2f( 1, -1),
    );

    return vec4f(pos[vertexIndex], 0.0, 1.0);
}

const PI = 3.14;

fn chladni(
    n: f32,
    m: f32,
    l: f32,
    x: f32,
    y: f32,
) -> f32 {
    return 0
        + cos(n * PI * x / l)
        * cos(m * PI * y / l)
        - cos(m * PI * x / l)
        * cos(n * PI * y / l);
}

@fragment fn fs(
    @builtin(position)
    pos: vec4f
) ->
@location(0) vec4f {
    let x = pos.x;
    let y = pos.y;

    let l = 20/0.12 / t * 10;

    let r = chladni(1, 5, l, x+2, y);
    let g = chladni(1, 4, l, x, y+2);
    let b = chladni(1, 3, l, x, y);
    return vec4f(20*vec3f(r, g, b), 1.0);
}