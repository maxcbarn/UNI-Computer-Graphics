"use strict";

import { matrix4x4 } from "./matrix.js";
import { vector4 } from "./vector.js";
import { SetColors , SetGeometry } from "./fgeometry.js";
import { Cube, Obj } from "./objects.js";

async function ReadFile( fileLocation ) {
  return await fetch( fileLocation ).then(response => { return response.text(); });
}
 
async function main( ) {
  const htmlObjs = { canvas:null };
  const glObjs = { gl:null , vertexShader:null , fragmentShader:null , program:null  };
  const varLocations = { a_position:null , a_color:null , u_matrix:null };
  const camera = { translation:null , up:null , target:null };
  const vaos = {};
  let objects = [];
  
  
  glObjs.fragmentShaderSource = await ReadFile( './shader.frag' )
  glObjs.vertexShaderSource = await ReadFile( './shader.vert' )
  
  htmlObjs.canvas = document.querySelector("#canvas");
  let gl = htmlObjs.canvas.getContext("webgl2");
  
  glObjs.vertexShader = CreateShader( gl , gl.VERTEX_SHADER , glObjs.vertexShaderSource );
  glObjs.fragmentShader = CreateShader( gl , gl.FRAGMENT_SHADER , glObjs.fragmentShaderSource );
  glObjs.program = CreateProgram( gl , glObjs.vertexShader , glObjs.fragmentShader );

  gl.useProgram( glObjs.program );
  gl.clearColor( 0 , 0 , 0 , 0 );
  gl.canvas.width = htmlObjs.canvas.width;
  gl.canvas.height = htmlObjs.canvas.height;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  varLocations.a_position = gl.getAttribLocation( glObjs.program, "a_position" );
  varLocations.a_color = gl.getAttribLocation( glObjs.program , "a_color");
  varLocations.u_matrix = gl.getUniformLocation( glObjs.program , "u_matrix" );
  
  CreateFVao( gl , vaos , varLocations );
  CreateCubeVao( gl , vaos , varLocations );
  
  objects.push( new Obj( vaos.fVao , vector4.Create( 50 , 50 , -500 , 1 ) , vector4.Create( Math.PI , 0 , 0 , 1 ) , vector4.Create( 1 , 1 , 1 , 1 ) , gl.TRIANGLES , 0 , 16 * 6 ) )
  objects.push( new Cube( vaos.cubeVao , vector4.Create( -250 , -250 , -500 , 1 ) , vector4.Create( Math.PI , 1.5 , 0 , 1 ) , vector4.Create( 1 , 1 , 1 , 1 ) , gl.TRIANGLES , 0 , 6 * 6 ) )
  
  camera.up = vector4.Create( 0 , 1 , 0 , 0 );
  camera.target = vector4.Create( 0 , 0 , -1 , 0 );
  camera.translation = vector4.Create( 0 , 200 , 0 , 1 );  


  let then = 0;
  //gl.enable( gl.CULL_FACE )
  gl.enable( gl.DEPTH_TEST );
  
  requestAnimationFrame( DrawScene );

  function DrawScene( now ) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram( glObjs.program );
    
    now *= 0.001;
    let deltaTime = now - then;
    then = now;
    let projectionMatrix = matrix4x4.Perspective( 60 , gl.canvas.clientWidth / gl.canvas.clientHeight , 1 , 1000 );
    let viewMatrix = matrix4x4.ViewMatrix( camera.translation , camera.up , camera.target );
    
    let matrix = matrix4x4.Identity();

    for ( let index = 0 ; index < objects.length ; index++ ) {
      gl.bindVertexArray( objects[index].vao );
      matrix = matrix4x4.Identity();
      matrix = matrix4x4.Mult( matrix , projectionMatrix );
      matrix = matrix4x4.Mult( matrix , viewMatrix );
      matrix = matrix4x4.Mult( matrix , matrix4x4.Translation( objects[index].position[0] , objects[index].position[1] , objects[index].position[2] ) );
      matrix = matrix4x4.Mult( matrix , matrix4x4.XRotation( objects[index].rotation[0] ) );
      matrix = matrix4x4.Mult( matrix , matrix4x4.YRotation( objects[index].rotation[1] ) );
      matrix = matrix4x4.Mult( matrix , matrix4x4.ZRotation( objects[index].rotation[2] ) );
      matrix = matrix4x4.Mult( matrix , matrix4x4.Scaling( objects[index].scale[0] , objects[index].scale[1] , objects[index].scale[2] ) );
      
      gl.uniformMatrix4fv( varLocations.u_matrix , true , matrix );
      objects[index].Draw( gl );
    }
    requestAnimationFrame(DrawScene);
  }
}

function CreateFVao( gl , vaos , varLocations ) {
  vaos.fVao = gl.createVertexArray();
  gl.bindVertexArray( vaos.fVao );
  
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER,  positionBuffer );
  gl.enableVertexAttribArray( varLocations.a_position );
  gl.vertexAttribPointer( varLocations.a_position , 3 , gl.FLOAT , false , 0 , 0 );
  SetGeometry( gl );
  

  let colorBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER , colorBuffer );
  gl.enableVertexAttribArray( varLocations.a_color );
  gl.vertexAttribPointer( varLocations.a_color , 3 , gl.UNSIGNED_BYTE , true , 0 , 0 );
  SetColors( gl );
}

function CreateCubeVao( gl , vaos , varLocations ) {
  vaos.cubeVao = gl.createVertexArray();
  gl.bindVertexArray( vaos.cubeVao );
  
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER,  positionBuffer );
  gl.enableVertexAttribArray( varLocations.a_position );
  gl.vertexAttribPointer( varLocations.a_position , 3 , gl.FLOAT , false , 0 , 0 );
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // Front face
    0,   0,   0,
    150, 0,   0,
    0,   150, 0,
    0,   150, 0,
    150, 0,   0,
    150, 150, 0,

    // Back face
    0,   0,   150,
    0,   150, 150,
    150, 0,   150,
    150, 0,   150,
    0,   150, 150,
    150, 150, 150,

    // Left face
    0,   0,   0,
    0,   0,   150,
    0,   150, 0,
    0,   150, 0,
    0,   0,   150,
    0,   150, 150,

    // Right face
    150, 0,   0,
    150, 150, 0,
    150, 0,   150,
    150, 0,   150,
    150, 150, 0,
    150, 150, 150,

    // Top face
    0,   150, 0,
    0,   150, 150,
    150, 150, 0,
    150, 150, 0,
    0,   150, 150,
    150, 150, 150,

    // Bottom face
    0,   0,   0,
    150, 0,   0,
    0,   0,   150,
    0,   0,   150,
    150, 0,   0,
    150, 0,   150,
  ]), gl.STATIC_DRAW);
  

  let colorBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER , colorBuffer );
  gl.enableVertexAttribArray( varLocations.a_color );
  gl.vertexAttribPointer( varLocations.a_color , 3 , gl.UNSIGNED_BYTE , true , 0 , 0 );
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
    // Front face
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,

    // Back face
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,
    100, 100, 100,

    // Left face
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    // Right face
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    // Back face
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,

    // Left face
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,
    200, 200, 200,

  ]), gl.STATIC_DRAW);
}
 
function CreateShader(gl, type, source) {
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

function CreateProgram(gl, vertexShader, fragmentShader) {
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

main();