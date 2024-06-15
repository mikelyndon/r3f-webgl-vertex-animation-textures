// rigid vertex shader //
export const rigidVertexShader = /* glsl */ `
  attribute vec2 uv2;
  attribute vec2 uv3;
  attribute vec2 uv4;
  
  varying vec2 vUv;
  varying vec4 vCd;
  uniform float uTime; 
  uniform float playbackSpeed;
  uniform float numOfFrames;
  uniform float houdiniFPS;
  uniform sampler2D posTexture;
  uniform sampler2D rotTexture;
  uniform sampler2D colTexture;

  void main() {
    //calculate uv coordinates
    float frame = floor(fract((houdiniFPS / (numOfFrames - 0.01)) * uTime * playbackSpeed) * numOfFrames);
    float timeInFrames = (mod(frame, numOfFrames) * ( 1.0 / numOfFrames));
    
    //get position and rotation(quaternion) from textures
    vec4 texturePos = texture(posTexture,vec2(uv2.x, 1.0 - timeInFrames));
    vec4 textureCd = texture(colTexture,vec2(uv2.x, 1.0 - timeInFrames));
    vec4 textureRot = texture(rotTexture,vec2(uv2.x, 1.0 - timeInFrames));
    vCd = textureCd;

    int maxComponent = int(floor(texturePos.w * 4.0));
    
    vec3 pivot = vec3(uv3.x, uv4.x, 1.0 - uv4.y);
    
    vec3 atOrigin = position - pivot;
      
    vUv = uv;

    //calculate rotation
    float w = sqrt(1.0 - (textureRot.x * textureRot.x ) - (textureRot.y * textureRot.y) - (textureRot.z * textureRot.z));
    vec4 q = vec4(0, 0, 0, 1);
    vec3 XYZ = textureRot.xyz;
    // maxComponent = 1;
    switch(maxComponent)
    {
        case 0:
            q = vec4(XYZ.x, XYZ.y, XYZ.z, w);
            break;
        case 1:
            q = vec4(w, XYZ.y, XYZ.z, XYZ.x);
            break;
        case 2:
            q = vec4(XYZ.x, w, XYZ.z, XYZ.y);
            break;
        case 3:
            q = vec4(XYZ.x, XYZ.y, w, XYZ.z);
            break;
        default:
            q = vec4(XYZ.x, XYZ.y, XYZ.z, w);
            break;
    }

    vec3 rotated = atOrigin + 2.0 * cross(q.xyz, (cross(q.xyz, atOrigin) + (atOrigin * q.w)));

    csm_Position = rotated + texturePos.xyz; 
  }
`

// soft vertex shader //
export const softVertexShader = /* glsl */ `
  attribute vec2 uv2;
  attribute vec2 uv3;
  attribute vec2 uv4;
  // attribute vec3 normal;
  
  varying vec2 vUv;
  varying vec4 vCd;
  uniform float uTime; 
  uniform float uFrame; 
  uniform float playbackSpeed;
  uniform float numOfFrames;
  uniform float houdiniFPS;
  uniform sampler2D posTexture;
  uniform sampler2D rotTexture;
  uniform sampler2D colTexture;

  void main() {
    //calculate uv coordinates
    float frame = floor(fract((houdiniFPS / (numOfFrames - 0.01)) * uTime * playbackSpeed) * numOfFrames);
    float timeInFrames = mod(frame, numOfFrames) * ( 1.0 / numOfFrames);
    
    //get position and rotation(quaternion) from textures
    float uv2y = 1.0 - uv2.y;
    // timeInFrames = timeINFrames;
    vec4 texturePos = texture(posTexture,vec2(uv2.x, 1.0 - timeInFrames - (1.0 - uv2.y)));
    vec4 textureCd = texture(colTexture,vec2(uv2.x, 1.0 - timeInFrames ));
    vec4 textureRot = texture(rotTexture,vec2(uv2.x, 1.0 - timeInFrames - (1.0 - uv2.y)));
    //uv2y = (1 - (timeInFrames * y_ratio)) + (1 - ((1 - uv2.y) * y_ratio));
    vCd = textureCd;

    int maxComponent = int(floor(texturePos.w * 4.0));
    
    vec3 pivot = vec3(uv3.x, uv4.x, 1.0 - uv4.y);
    
    vec3 atOrigin = position - pivot;
      
    vUv = uv;

    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 oN = normalize((cross(textureRot.xyz, cross(textureRot.xyz, up) + (textureRot.a * up)) * 2.0) + up);

    csm_Position = position + texturePos.xyz; 
    csm_Normal = oN;
  }
`

// soft vertex shader //
export const legacySoftVertexShader = /* glsl */ `
  attribute vec2 uv2;
  attribute vec2 uv3;
  attribute vec2 uv4;
  // attribute vec3 normal;
  
  varying vec2 vUv;
  varying vec4 vCd;
  uniform float uTime; 
  uniform float uFrame; 
  uniform float playbackSpeed;
  uniform float numOfFrames;
  uniform float houdiniFPS;
  uniform sampler2D posTexture;
  uniform sampler2D rotTexture;
  uniform sampler2D colTexture;

  void main() {
    //calculate uv coordinates
    float frame = floor(fract((houdiniFPS / (numOfFrames - 0.01)) * uTime * playbackSpeed) * numOfFrames);
    float timeInFrames = mod(frame, numOfFrames) * ( 1.0 / numOfFrames);
    
    //get position and rotation(quaternion) from textures
    float uv2y = 1.0 - uv2.y;
    // timeInFrames = timeINFrames;
    vec4 texturePos = texture(posTexture,vec2(uv.x, 1.0 - timeInFrames - (1.0 - uv.y)));
    vec4 textureCd = texture(colTexture,vec2(uv2.x, 1.0 - timeInFrames ));
    vec4 textureRot = texture(rotTexture,vec2(uv2.x, 1.0 - timeInFrames - (1.0 - uv2.y)));
    //uv2y = (1 - (timeInFrames * y_ratio)) + (1 - ((1 - uv2.y) * y_ratio));
    vCd = textureCd;

    int maxComponent = int(floor(texturePos.w * 4.0));
    
    vec3 pivot = vec3(uv3.x, uv4.x, 1.0 - uv4.y);
    
    vec3 atOrigin = position - pivot;
      
    vUv = uv;

    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 oN = normalize((cross(textureRot.xyz, cross(textureRot.xyz, up) + (textureRot.a * up)) * 2.0) + up);

    csm_Position = position + texturePos.xyz; 
    csm_Normal = oN;
  }
`

// fluid vertex shader //
export const fluidVertexShader = /* glsl */ `
  attribute vec2 uv2;
  attribute vec2 uv3;
  attribute vec2 uv4;
  
  varying vec2 vUv;
  varying vec4 vCd;
  uniform float uTime; 
  uniform float uFrame; 
  uniform float playbackSpeed;
  uniform float numOfFrames;
  uniform float houdiniFPS;
  uniform sampler2D posTexture;
  uniform sampler2D rotTexture;
  uniform sampler2D colTexture;
  uniform sampler2D lookupTexture;

  void main() {
    //calculate uv coordinates
    float frame = floor(fract((houdiniFPS / (numOfFrames - 0.01)) * uTime * playbackSpeed) * numOfFrames);
    float timeInFrames = mod(frame, numOfFrames) * ( 1.0 / numOfFrames);

    //get lookup uv
    vec4 textureLookup = texture(lookupTexture,vec2(uv.x, 1.0 - timeInFrames - (1.0 - uv.y) ));
    float div = 255.0;
    vec2 uvl = vec2((textureLookup.g / div) + textureLookup.r, 1.0 - ((textureLookup.a / div) + textureLookup.b));
    
 
    
    //get position and rotation(quaternion) from textures
    vec4 texturePos = texture(posTexture, uvl);
    vec4 textureCd = texture(colTexture,uvl);
    vec4 textureRot = texture(rotTexture,uvl);

    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 oN = normalize((cross(textureRot.xyz, cross(textureRot.xyz, up) + (textureRot.a * up)) * 2.0) + up);
    
    
    vCd = textureCd;
    vUv = uv;
    csm_Position = texturePos.xyz; 
    csm_Normal = oN;
  }
`

// fragment shader //
export const fragmentShader = /* glsl */ `
// varying float vCurveU;
varying vec4 vCd;
varying vec3 csm_Normal;

void main() {
  csm_DiffuseColor = vCd;
}
  `
// fragment shader end //
