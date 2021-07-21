phongVertexShader = 
`	#version 300 es

	layout(location = 0) in vec3 vertexPosition;
	layout(location = 1) in vec3 vertexNormal;

	out vec3 fragPos;
	out vec3 normalVec;

	uniform mat4 mvp;
	uniform mat4 modelMatrix;
	uniform mat3 normalMatrix;

	void main()
	{
		gl_Position = mvp * vec4(vertexPosition, 1);
		normalVec = normalMatrix * vertexNormal;
		fragPos = vec3(modelMatrix * vec4(vertexPosition, 1));
	}
`;

phongFragmentShader =
`	#version 300 es
	precision mediump float;
				
	in vec3 fragPos;
	in vec3 normalVec;

	layout(location = 0) out vec4 fragColor;

	struct materialSettings {
		vec3 ambient;
		vec3 diffuse;
		vec3 specular;
		float shininess;
	};

	struct lightSettings {
		vec3 position;
		vec3 ambient;
		vec3 diffuse;
		vec3 specular;
	};

	uniform materialSettings material;
	uniform lightSettings light;
	uniform vec3 cameraPos;

	vec3 ads(void)
	{
		vec3 normal = normalize(normalVec);
		vec3 lightdir = normalize(light.position - fragPos);
		vec3 viewdir = normalize(cameraPos - fragPos);
		vec3 halfway = normalize(viewdir + lightdir);
		vec3 ambient = light.ambient * material.ambient;
		vec3 diffuse = light.diffuse * material.diffuse * max(dot(lightdir, normal), 0.0);
		vec3 specular = light.specular * material.specular * pow(max(dot(halfway, normal), 0.0), material.shininess);
		return ambient + diffuse + specular;
	}


	void main()
	{
		vec3 ambient, diffuse, specular;
		fragColor = vec4(ads(), 1);
	}
`;

gouraudVertexShader = 
`	#version 300 es
	precision mediump float;
	
	layout(location = 0) in vec3 vertexPosition;
	layout(location = 1) in vec3 vertexNormal;

	out vec3 fragColor;

	struct materialSettings {
		vec3 ambient;
		vec3 diffuse;
		vec3 specular;
		float shininess;
	};

	struct lightSettings {
		vec3 position;
		vec3 ambient;
		vec3 diffuse;
		vec3 specular;
	};


	uniform mat4 mvp;
	uniform mat4 modelMatrix;
	uniform mat3 normalMatrix;
	uniform materialSettings material;
	uniform lightSettings light;
	uniform vec3 cameraPos;

	vec3 ads(void)
	{
		vec3 normalVec = normalMatrix * vertexNormal;
		vec3 fragPos = vec3(modelMatrix * vec4(vertexPosition, 1));

		vec3 normal = normalize(normalVec);
		vec3 lightdir = normalize(light.position - fragPos);
		vec3 viewdir = normalize(cameraPos - fragPos);
		vec3 halfway = normalize(viewdir + lightdir);
		vec3 ambient = light.ambient * material.ambient;
		vec3 diffuse = light.diffuse * material.diffuse * max(dot(lightdir, normal), 0.0);
		vec3 specular = light.specular * material.specular * pow(max(dot(halfway, normal), 0.0), material.shininess);
		return ambient + diffuse + specular;
	}


	void main()
	{
		gl_Position = mvp * vec4(vertexPosition, 1);
		fragColor = ads();
	}
`;

gouraudFragmentShader =
`	#version 300 es
	precision mediump float;

	in vec3 fragColor;

	layout(location = 0) out vec4 glFragColor;


	void main()
	{
		glFragColor = vec4(fragColor, 1);
	}
`;

function compileShaderProgram(gl, vshadersrc, fshadersrc)
{
	let vertexshader = compileShader(gl, gl.VERTEX_SHADER, vshadersrc);
	let fragmentshader = compileShader(gl, gl.FRAGMENT_SHADER, fshadersrc);
	let program = gl.createProgram();
	gl.attachShader(program, vertexshader);
	gl.attachShader(program, fragmentshader);
	gl.linkProgram(program);
	gl.deleteShader(vertexshader);
	gl.deleteShader(fragmentshader);
	return program;
}
			
function compileShader(gl, shadertype, src)
{
	let shader = gl.createShader(shadertype);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}


function setShaderProgramUniform1f(gl, programID, name, value)
{
	gl.uniform1f(gl.getUniformLocation(programID, name), value);
}

function setShaderProgramUniform1i(gl, programID, name, value)
{
	gl.uniform1i(gl.getUniformLocation(programID, name), value);
}

function setShaderProgramUniform3fv(gl, programID, name, value)
{
	gl.uniform3fv(gl.getUniformLocation(programID, name), value);
}

function setShaderProgramUniformMatrix3fv(gl, programID, name, value)
{
	gl.uniformMatrix3fv(gl.getUniformLocation(programID, name), false, value);
}

function setShaderProgramUniformMatrix4fv(gl, programID, name, value)
{
	gl.uniformMatrix4fv(gl.getUniformLocation(programID, name), false, value);
}

function webglHandleError(gl)
{
	let err = gl.getError();
	if (err != gl.NO_ERROR) {
		alert(err);
		return;
	}
}

