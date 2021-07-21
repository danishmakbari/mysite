function getNormalMatrix(modelMatrix)
{
	let normalMatrix = glMatrix.mat4.create();

	glMatrix.mat4.identity(normalMatrix);
	glMatrix.mat4.invert(normalMatrix, modelMatrix);
	glMatrix.mat4.transpose(normalMatrix, normalMatrix);

	let nMat = glMatrix.mat3.create();
	glMatrix.mat3.fromMat4(nMat, normalMatrix);
	return nMat;
}

function getMVP(model, view, proj)
{
	let mvp = glMatrix.mat4.create();
	glMatrix.mat4.identity(mvp);
	glMatrix.mat4.mul(mvp, proj, view);
	glMatrix.mat4.mul(mvp, mvp, model);

	return mvp;
}

