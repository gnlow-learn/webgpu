@vertex fn vs(
    @builtin(vertex_index)
    vertexIndex: u32
) ->
@builtin(position)
vec4f {
    let pos = array(
        vec2f( 0.0,  0.5),
        vec2f(-0.5, -0.5),
        vec2f( 0.5, -0.5),
    );

    return vec4f(pos[vertexIndex], 0.0, 1.0);
}

@fragment fn fs(
    @builtin(position)
    pos: vec4f
) ->
@location(0) vec4f {
    let x = pos.x;
    let y = pos.y;
    let r = 0.5 * (1 + sin((x + y) / 100));
    let g = 0.5 * (1 + sin((x - y) / 100));
    let b = 0.5 * (1 + cos((x + y) / 100));
    return vec4f(r, g, b, 1.0);
}