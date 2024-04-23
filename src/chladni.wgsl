@vertex fn vs(
    @builtin(vertex_index)
    vertexIndex: u32
) ->
@builtin(position)
vec4f {
    let pos = array(
        vec2f(-0.5,  0.5),
        vec2f(-0.5, -0.5),
        vec2f( 0.5, -0.5),
        vec2f(-0.5,  0.5),
        vec2f( 0.5,  0.5),
        vec2f( 0.5, -0.5),
    );

    return vec4f(pos[vertexIndex], 0.0, 1.0);
}

const PI = 3.14;

@fragment fn fs(
    @builtin(position)
    pos: vec4f
) ->
@location(0) vec4f {
    let x = pos.x;
    let y = pos.y;

    let n = 1.0;
    let m = 5.0;
    let l = 100.0;

    let p =
          cos(n * PI * x / l)
        * cos(m * PI * y / l)
        - cos(m * PI * x / l)
        * cos(n * PI * y / l);

    let r = p;
    let g = p;
    let b = p;
    return vec4f(r, g, b, 1.0);
}