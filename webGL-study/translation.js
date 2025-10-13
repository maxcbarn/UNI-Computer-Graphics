
function main() {
    var canvas = document.querySelector("#c3");
    console.log(canvas);
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    var vertexShaderSource = `#version 300 es
 
    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec2 a_position;
    
    // Used to pass in the resolution of the canvas
    uniform vec2 u_resolution;
    
    // translation to add to position
    uniform vec2 u_translation;
    
    // all shaders have a main function
    void main() {
      // Add in the translation
      vec2 position = a_position + u_translation;
    
      // convert the position from pixels to 0.0 to 1.0
      vec2 zeroToOne = position / u_resolution;
    
      // convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;
    
      // convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;
    
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
    `;
    
    var fragmentShaderSource = `#version 300 es
    precision highp float;

    out vec4 outColor;
    
    void main() {
    outColor = vec4(1, 0, 0.5, 1);
    }

    `;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var translationLocation = gl.getUniformLocation( program, "u_translation");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setGeometry(gl);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer( positionAttributeLocation, size, type, normalize, stride, offset)

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    var translation = [0, 0];

    gl.uniform2fv(translationLocation, translation);

    gl.bindVertexArray(vao);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18;
    
    gl.drawArrays(primitiveType, offset, count);

    webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});

    function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      gl.uniform2fv(translationLocation, translation);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(primitiveType, offset, count);
    };
  }

}

function createShader(gl, type, source) {
  let shader = gl.createShader( type );
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,
 
          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,
 
          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90]),
      gl.STATIC_DRAW);
}
main()