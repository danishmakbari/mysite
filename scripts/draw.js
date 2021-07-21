octahedron = [
	[ 0,    0,    0.5,
	  0.5,  0,    0,
	  0,    0.5,  0],

	[-0.5,  0,    0,
	  0,    0,  0.5,
	  0,    0.5,  0],

	[ 0.5,  0,    0,
	  0,    0,   -0.5,
	  0,    0.5,  0],

	[-0.5,  0,    0,
	  0,    0.5,  0,
	  0,    0,   -0.5],

	[ 0,    0,    0.5,
	  0,   -0.5,  0,
	  0.5,  0,    0],

	[-0.5,  0,    0,
	  0,   -0.5,  0,
	  0,    0,    0.5],

	[ 0.5,  0,    0,
	  0,    -0.5,  0,
	  0,     0,   -0.5],

	[-0.5,  0,    0,
	 0,     0,   -0.5,
	 0,    -0.5,  0]
];

box_vertices = [
	-0.5, -0.5, -0.5, 0.0,  0.0, -1.0,
	 0.5,  0.5, -0.5, 0.0,  0.0, -1.0,
	 0.5, -0.5, -0.5, 0.0,  0.0, -1.0,
	-0.5,  0.5, -0.5, 0.0,  0.0, -1.0,
	 0.5,  0.5, -0.5, 0.0,  0.0, -1.0,
	-0.5, -0.5, -0.5, 0.0,  0.0, -1.0,

	-0.5, -0.5,  0.5,  0.0,  0.0,  1.0,
	 0.5, -0.5,  0.5,  0.0,  0.0,  1.0,
	 0.5,  0.5,  0.5,  0.0,  0.0,  1.0,
	 0.5,  0.5,  0.5,  0.0,  0.0,  1.0,
	-0.5,  0.5,  0.5,  0.0,  0.0,  1.0,
	-0.5, -0.5,  0.5,  0.0,  0.0,  1.0,

	-0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
	-0.5,  0.5, -0.5, -1.0,  0.0,  0.0,
	-0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
	-0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
	-0.5, -0.5,  0.5, -1.0,  0.0,  0.0,
	-0.5,  0.5,  0.5, -1.0,  0.0,  0.0,

	 0.5,  0.5, -0.5,  1.0,  0.0,  0.0,
	 0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
	 0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
	 0.5, -0.5,  0.5,  1.0,  0.0,  0.0,
	 0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
	 0.5,  0.5,  0.5,  1.0,  0.0,  0.0,

	-0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
	 0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
	 0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
	 0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
	-0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
	-0.5, -0.5, -0.5,  0.0, -1.0,  0.0,

	 0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
	-0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
	 0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
	-0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
	 0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
	-0.5,  0.5, -0.5,  0.0,  1.0,  0.0
];



function draw(cdata, angle, scene)
{
	let gl = cdata.gl;
	let vao = cdata.vao;
	let vbo = cdata.vbo;
	let program = cdata.program;
	let vertices = cdata.vertices;

	let Lpos = glMatrix.vec3.create();
	glMatrix.vec3.set(Lpos, scene.lightpos[0], scene.lightpos[1], scene.lightpos[2]);
	let La = glMatrix.vec3.create();
	glMatrix.vec3.set(La, 1.0, 1.0, 1.0);
	let Ld = glMatrix.vec3.create();
	glMatrix.vec3.set(Ld, 1.0, 1.0, 1.0);
	let Ls = glMatrix.vec3.create();
	glMatrix.vec3.set(Ls, 1.0, 1.0, 1.0);

	let Ma = glMatrix.vec3.create();
	glMatrix.vec3.set(Ma, scene.ambient[0], scene.ambient[1], scene.ambient[2]);
	let Md = glMatrix.vec3.create();
	glMatrix.vec3.set(Md, scene.diffuse[0], scene.diffuse[1], scene.diffuse[2]);
	let Ms = glMatrix.vec3.create();
	glMatrix.vec3.set(Ms, scene.specular[0], scene.specular[1], scene.specular[2]);
	let shininess = scene.shininess;

	let cameraPos = glMatrix.vec3.create();
	glMatrix.vec3.set(cameraPos, 0.0, 0.0, 15.0);

	let projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.identity(projMatrix);
	glMatrix.mat4.perspective(projMatrix, 60.0 * (180.0 / Math.PI), 1, 0.1, 100.0);

	let viewMatrix = glMatrix.mat4.create();
	glMatrix.mat4.identity(viewMatrix);
	glMatrix.mat4.lookAt(viewMatrix, cameraPos, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

	let modelMatrix = glMatrix.mat4.create();
	glMatrix.mat4.identity(modelMatrix);
	glMatrix.mat4.rotate(modelMatrix, modelMatrix, angle * (180.0 / Math.PI), [1, 1, 0]);
	glMatrix.mat4.scale(modelMatrix, modelMatrix, [5, 5, 5]);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(program);

	setShaderProgramUniformMatrix4fv(gl, program, "mvp", getMVP(modelMatrix, viewMatrix, projMatrix));
	setShaderProgramUniformMatrix4fv(gl, program, "modelMatrix", modelMatrix);
	setShaderProgramUniformMatrix3fv(gl, program, "normalMatrix", getNormalMatrix(modelMatrix));

	setShaderProgramUniform3fv(gl, program, "light.position", Lpos);
	setShaderProgramUniform3fv(gl, program, "light.ambient", La);
	setShaderProgramUniform3fv(gl, program, "light.diffuse", Ld);
	setShaderProgramUniform3fv(gl, program, "light.specular", Ls);

	setShaderProgramUniform3fv(gl, program, "material.ambient", Ma);
	setShaderProgramUniform3fv(gl, program, "material.diffuse", Md);
	setShaderProgramUniform3fv(gl, program, "material.specular", Ms);

	setShaderProgramUniform1f(gl, program, "material.shininess", shininess);

	setShaderProgramUniform3fv(gl, program, "cameraPos", cameraPos);

	gl.bindVertexArray(vao);
	gl.drawArrays(gl.TRIANGLES, 0, vertices);
}

function createCube(canvnam, vertshader, fragshader)
{
	let canvas = document.querySelector(canvnam);
	let gl = canvas.getContext("webgl2");
	if (gl === null) {
		alert("WebGL error. Can't create context.");
		return;
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0xFF, 0xFF, 0xFF, 1.0);
	gl.enable(gl.DEPTH_TEST);

	let vao = gl.createVertexArray();
	let vbo = gl.createBuffer();

	gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(box_vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	let program = compileShaderProgram(gl, vertshader, fragshader);

	let ret = {
		'gl': gl,
		'vao': vao,
		'program': program,
		'vertices': 36
	};

	return ret;
}

function subdivide(triangle, sphere, depth, sphere_level)
{
	if (depth == sphere_level) {
		for (let i = 0; i < 9; i += 3) {
			let vec = glMatrix.vec3.create();
			glMatrix.vec3.set(vec, triangle[i], triangle[i + 1], triangle[i + 2]);
			glMatrix.vec3.normalize(vec, vec);

			sphere.push(vec[0]);
			sphere.push(vec[1]);
			sphere.push(vec[2]);
		}
		return;
	}

	let triangle1 = [
		(triangle[0] + triangle[3]) / 2, (triangle[1] + triangle[4]) / 2, (triangle[2] + triangle[5]) / 2,
		(triangle[0] + triangle[6]) / 2, (triangle[1] + triangle[7]) / 2, (triangle[2] + triangle[8]) / 2,
		triangle[0], triangle[1], triangle[2]
	];
	let triangle2 = [
		(triangle[0] + triangle[6]) / 2, (triangle[1] + triangle[7]) / 2, (triangle[2] + triangle[8]) / 2,
		(triangle[3] + triangle[6]) / 2, (triangle[4] + triangle[7]) / 2, (triangle[5] + triangle[8]) / 2,
		triangle[6], triangle[7], triangle[8]
	];

	let triangle3 = [
		(triangle[3] + triangle[6]) / 2, (triangle[4] + triangle[7]) / 2, (triangle[5] + triangle[8]) / 2,
		(triangle[0] + triangle[3]) / 2, (triangle[1] + triangle[4]) / 2, (triangle[2] + triangle[5]) / 2,
		triangle[3], triangle[4], triangle[5]
	];

	let triangle4 = [
		(triangle[0] + triangle[3]) / 2, (triangle[1] + triangle[4]) / 2, (triangle[2] + triangle[5]) / 2,
		(triangle[3] + triangle[6]) / 2, (triangle[4] + triangle[7]) / 2, (triangle[5] + triangle[8]) / 2,
		(triangle[0] + triangle[6]) / 2, (triangle[1] + triangle[7]) / 2, (triangle[2] + triangle[8]) / 2
	];

	subdivide(triangle1, sphere, depth + 1, sphere_level);
	subdivide(triangle2, sphere, depth + 1, sphere_level);
	subdivide(triangle3, sphere, depth + 1, sphere_level);
	subdivide(triangle4, sphere, depth + 1, sphere_level);
}

function genSphere(sphere_level)
{
	let sphere = new Array(0);
	for (let i = 0; i < 8; i++)
		subdivide(octahedron[i], sphere, 0, sphere_level);
	return sphere;
}

function createSphere(canvnam, vertshader, fragshader, sphere_level)
{
	let canvas = document.querySelector(canvnam);
	let gl = canvas.getContext("webgl2");
	if (gl === null) {
		alert("WebGL error. Can't create context.");
		return;
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0xFF, 0xFF, 0xFF, 1.0);
	gl.enable(gl.DEPTH_TEST);

	let vao = gl.createVertexArray();
	let vbo = gl.createBuffer();

	gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

	let sphere = genSphere(sphere_level);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0);

	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	let program = compileShaderProgram(gl, vertshader, fragshader);

	let ret = {
		'gl': gl,
		'vao': vao,
		'vbo': vbo,
		'program': program,
		'vertices': 8 * Math.pow(4, sphere_level) * 3
	};

	return ret;
}

function destroyData(data)
{
	data.gl.deleteBuffer(data.vbo);
	data.gl.deleteVertexArray(data.vao);
	data.gl.deleteProgram(data.program);
}

window.onload =
function()
{
	let data1 = createCube("#phongcube", phongVertexShader, phongFragmentShader);
	let data2 = createCube("#gouraudcube", gouraudVertexShader, gouraudFragmentShader);
	let data3 = createSphere("#phongsphere", phongVertexShader, phongFragmentShader, 3);
	let data4 = createSphere("#gouraudsphere", gouraudVertexShader, gouraudFragmentShader, 3);

	let angle1 = 0;
	let angle2 = 45;

	let teschoice = document.querySelector("#teschoice");
	let prevval = teschoice.value;

	let scene = {
		'lightpos': [10, 10, 15],
		'ambient': [0.2, 0, 0],
		'diffuse': [0.3, 0, 0],
		'specular': [0.7, 0.6, 0.6],
		'shininess': 16
	};

	let lightpos;

	let el = document.getElementById("animtext");
	printText(el);

	let intervalId = window.setInterval(
	function()
	{
		angle1 += 0.0005;
		angle2 += 0.0005;
		if (angle1 >= 360) angle1 = 0;
		if (angle2 >= 360) angle2 = 0;

		scene.lightpos = [document.querySelector("#Cx").value,
				document.querySelector("#Cy").value,
				document.querySelector("#Cz").value];


		scene.ambient = [document.querySelector("#Ar").value,
				document.querySelector("#Ag").value,
				document.querySelector("#Ab").value];

		scene.diffuse = [document.querySelector("#Dr").value,
				document.querySelector("#Dg").value,
				document.querySelector("#Db").value];

		scene.specular = [document.querySelector("#Sr").value,
				document.querySelector("#Sg").value,
				document.querySelector("#Sb").value];

		scene.shininess = document.querySelector("#shininess").value;	



		if (prevval != teschoice.value) {
			prevval = teschoice.value;
			destroyData(data3);
			destroyData(data4);
			data3 = createSphere("#phongsphere", phongVertexShader, phongFragmentShader, prevval);
			data4 = createSphere("#gouraudsphere", gouraudVertexShader, gouraudFragmentShader, prevval);
		}

		draw(data1, angle1, scene);
		draw(data2, angle2, scene);
		draw(data3, angle1, scene);
		draw(data4, angle2, scene);
	}
	, 50);
};

