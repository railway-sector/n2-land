import{eV as ot,ap as lt,gS as xe,eq as ye,er as be,gT as we,wR as Ue,JQ as le,qZ as ct,be as We,fm as ut,cx as R,ni as ht,gN as je,gH as dt,A0 as pt,h8 as ft,hm as mt,fT as Je,hb as gt,cn as me,hr as _t,zO as vt,gX as xt,o2 as yt,fD as ie,cl as bt,da as wt,JR as Tt,pi as Ct,GZ as _,p1 as Te,If as Ge,Jx as Pt,O as m,Hi as X,gp as Ze,wQ as Ce,JS as de,H0 as Ie,Hz as St,In as Oe,mr as Ye,Hx as He,Jv as Dt,JT as At,JU as zt,JV as Ft,JW as $t,GW as Mt,HB as Gt,GY as It,J3 as Xe,H1 as ge,H3 as Pe,H4 as Se,_ as De,H5 as Ae,HD as Qe,H9 as Ke,T as K,JX as Ot,G0 as Ht,GJ as _e,Jn as Rt,Ja as kt,Jb as Re,b_ as L,IX as ke,fU as Ee,lw as Et,JY as qt,Q as U,gA as Bt,rf as Vt,c3 as Lt,rh as Nt,nm as qe,f_ as Ut,cF as Wt,ka as Be,rv as jt,rg as Jt,bg as Zt,zY as Yt,a$ as Xt,b4 as Qt,a_ as Kt,JZ as ea,mB as Ve,ak as ta,J_ as aa,i6 as ia,pV as sa,aQ as ra}from"./index-DGqJw_9v.js";import{E as na}from"./tiles3DUtils-BX_LfQYw.js";import{a as oa}from"./LayerView3D-CXAI8LXj.js";import{E as la}from"./LayerElevationProvider-giI84RlC.js";import{I as ca}from"./LayerView-C7s7ZjEz.js";import"./projectBoundingSphere-ZsEn-7vs.js";let ua=class extends ot{constructor(e,t,i,r){super(e,0,0,0,t),this.cachedNodes=i,this.memoryMBCached=r}};const P=4096,ze=64,W=1023,J=W+1,et=P*ze/J,se=4,tt=J*se,Le=W*se,ha=P*ze;let da=class{constructor(e=et){this._pageCount=e;const t=Math.ceil(e/32);this._bitset=new Uint32Array(t)}get pageCount(){return this._pageCount}isAllocated(e){const t=e/32|0,i=e%32;return!!(this._bitset[t]&1<<i)}allocate(e){const t=e/32|0,i=e%32;this._bitset[t]|=1<<i}free(e){const t=e/32|0,i=e%32;this._bitset[t]&=~(1<<i)}findFirstFreePage(){for(let e=0;e<this._bitset.length;e++)if(this._bitset[e]!==4294967295)for(let t=0;t<32;t++){const i=32*e+t;if(i>=this._pageCount)break;if(!(this._bitset[e]&1<<t))return i}return null}resize(e){this._pageCount=e;const t=Math.ceil(e/32),i=this._bitset.length;if(t!==i){const r=new Uint32Array(t),s=Math.min(i,t);r.set(this._bitset.subarray(0,s)),this._bitset=r}this._clearExcessBits(this._bitset,e)}_clearExcessBits(e,t){const i=Math.floor((t-1)/32),r=(t-1)%32;if(t>0&&r<31){const s=(1<<r+1)-1;e[i]&=s}i+1<e.length&&e.fill(0,i+1)}};class pa extends lt{constructor(e){super("GaussianSplatSortWorker","sort",{sort:t=>[t.distances.buffer,t.sortOrderIndices.buffer]},e,{strategy:"dedicated"})}sort(e,t){return this.invokeMethod("sort",e,t)}async destroyWorkerAndSelf(){await this.broadcast({},"destroy"),this.destroy()}}let fa=class{constructor(e){this.texture=null,this._fadeTextureCapacity=0,this._rctx=e}ensureCapacity(e){if(this._fadeTextureCapacity>e)return;const t=Math.max(Math.ceil(e*le),et),[i,r]=this._evalTextureSize(t),s=i*r,n=this._fadeBuffer,u=new Uint8Array(s);n&&u.set(n.subarray(0,this._fadeTextureCapacity)),this._fadeBuffer=u,this._fadeTextureCapacity=s,this.texture?.dispose();const o=new xe;o.width=i,o.height=r,o.pixelFormat=36244,o.dataType=ye.UNSIGNED_BYTE,o.internalFormat=be.R8UI,o.unpackAlignment=1,o.wrapMode=33071,o.samplingMode=9728,o.isImmutable=!0,this.texture=new we(this._rctx,o)}updateTexture(e){this.ensureCapacity(e);const t=this.texture.descriptor.width,i=Math.ceil(e/t),r=t*i;this.texture.updateData(0,0,0,t,i,this._fadeBuffer.subarray(0,r))}updateBuffer(e,t){this.ensureCapacity(t+1),this._fadeBuffer&&(this._fadeBuffer[t]=e)}destroy(){this.texture?.dispose()}_evalTextureSize(e){const t=Math.ceil(Math.sqrt(e)),i=Math.ceil(e/t);return Ue(t,i)}};class ma{constructor(e){this.texture=null,this._orderTextureCapacity=0,this._rctx=e}ensureCapacity(e){if(this._orderTextureCapacity>=e)return;const t=Math.max(Math.ceil(e*le),ha),[i,r]=this._evalTextureSize(t),s=i*r;this._orderBuffer=new Uint32Array(s),this._orderTextureCapacity=s,this.texture?.dispose();const n=new xe;n.width=i,n.height=r,n.pixelFormat=36244,n.dataType=ye.UNSIGNED_INT,n.internalFormat=be.R32UI,n.wrapMode=33071,n.samplingMode=9728,n.isImmutable=!0,this.texture=new we(this._rctx,n),this._orderTextureCapacity=s}setData(e,t){this.ensureCapacity(t),this._orderBuffer.set(e);const i=this.texture.descriptor.width,r=Math.ceil(t/i),s=i*r;this.texture.updateData(0,0,0,i,r,this._orderBuffer.subarray(0,s))}clear(){this._orderTextureCapacity=0,this.texture?.dispose(),this.texture=null}destroy(){this.texture?.dispose()}_evalTextureSize(e){const t=Math.ceil(Math.sqrt(e)),i=Math.ceil(e/t);return Ue(t,i)}}let ga=class{constructor(e,t,i){this._splatAtlasTextureHeight=ze,this.texture=null,this._rctx=e,this._fboCache=i,this.pageAllocator=new da,this._cache=t.newCache("gaussian texture cache",r=>r.dispose())}ensureTextureAtlas(){if(this.texture)return;const e=this._cache.pop("splatTextureAtlas");if(e)return void(this.texture=e);const t=new xe;t.height=this._splatAtlasTextureHeight,t.width=P,t.pixelFormat=36249,t.dataType=ye.UNSIGNED_INT,t.internalFormat=be.RGBA32UI,t.samplingMode=9728,t.wrapMode=33071,t.isImmutable=!0,this.texture=new we(this._rctx,t),this._updatePageAllocator()}grow(){if(!this.texture)return this.ensureTextureAtlas(),!1;const e=Math.floor(this._splatAtlasTextureHeight*le);if(e*P>this._rctx.parameters.maxPreferredTexturePixels)return!1;const t=new ct(this._rctx,this.texture),i=this._fboCache.acquire(P,e,"gaussian splat atlas resize",12);return this._rctx.blitFramebuffer(t,i.fbo,16384,9728,0,0,P,this._splatAtlasTextureHeight,0,0,P,this._splatAtlasTextureHeight),this.texture?.dispose(),this.texture=i.fbo?.detachColorTexture(),t.dispose(),i.dispose(),this._splatAtlasTextureHeight=e,this._updatePageAllocator(),!0}requestPage(){let e=this.pageAllocator.findFirstFreePage();return e===null&&this.grow()&&(e=this.pageAllocator.findFirstFreePage()),e!==null&&this.pageAllocator.allocate(e),e}freePage(e){this.pageAllocator.free(e)}update(e,t,i){this.ensureTextureAtlas(),this.texture.updateData(0,e,t,J,1,i)}_updatePageAllocator(){const e=P*this._splatAtlasTextureHeight/J;this.pageAllocator.pageCount!==e&&this.pageAllocator.resize(e)}clear(){this.texture&&(this._cache.put("splatTextureAtlas",this.texture),this.texture=null)}destroy(){this._cache.destroy(),this.texture?.dispose()}};class _a{constructor(e){this._updating=We(!1),this._useDeterministicSort=!1,this.visibleGaussians=0,this._visibleGaussianTiles=new Array,this._workerHandle=null,this._isSorting=!1,this._pendingSortTask=!1,this._bufferCapacity=0,this._minimumBoundingSphere=new ut,this._cameraDirectionNormalized=R(),this._frameTask=null,this._renderer=e,this._orderTexture=new ma(this._renderer.renderingContext),this._fadingTexture=new fa(this._renderer.renderingContext),this._textureAtlas=new ga(this._renderer.renderingContext,this._renderer.view.resourceController.memoryController,this._renderer.fboCache);const{resourceController:t}=this._renderer.view;this._workerHandle=new pa(ht(t)),this._frameTask=t.scheduler.registerTask(je.GAUSSIAN_SPLAT_SORTING)}get textureAtlas(){return this._textureAtlas}get orderTexture(){return this._orderTexture}get fadingTexture(){return this._fadingTexture}get visibleGaussianTiles(){return this._visibleGaussianTiles}forEachTile(e){for(const t of this._visibleGaussianTiles)e(t)}updateGaussianVisibility(e){this._visibleGaussianTiles=e,this.requestSort()}get updating(){return this._updating.value}destroy(){this._pendingSortTask=!1,this._frameTask.remove(),this._workerHandle?.destroyWorkerAndSelf(),this._textureAtlas.destroy(),this._orderTexture.destroy(),this._fadingTexture.destroy()}requestSort(){this._updating.value=!0,this._isSorting?this._pendingSortTask=!0:(this._isSorting=!0,this._pendingSortTask=!1,this._sortOnWorker().then(()=>this._handleSortComplete()).catch(()=>this._handleSortComplete()))}_handleSortComplete(){this._isSorting=!1,this._pendingSortTask?this.requestSort():this._updating.value=!1}_clearBuffersAndTextures(){this._bufferCapacity=0,this._orderTexture.clear(),this._textureAtlas.clear()}_ensureBufferCapacity(e){if(this._bufferCapacity<e){const t=Math.ceil(e*le);this._atlasIndicesBuffer=new Uint32Array(t),this._sortedAtlasIndicesBuffer=new Uint32Array(t),this._distancesBuffer=new Float64Array(t),this._sortOrderBuffer=new Uint32Array(t),this._bufferCapacity=t}}async _sortOnWorker(){if(this._visibleGaussianTiles.length===0)return this.visibleGaussians=0,this._clearBuffersAndTextures(),void this._renderer.requestRender(1);this._useDeterministicSort&&this._visibleGaussianTiles.sort((l,h)=>l.obb.centerX-h.obb.centerX||l.obb.centerY-h.obb.centerY||l.obb.centerZ-h.obb.centerZ);let e=this._visibleGaussianTiles.reduce((l,h)=>l+h.gaussianAtlasIndices.length,0);this._ensureBufferCapacity(e),this._textureAtlas.ensureTextureAtlas();const{frustum:t}=this._renderer.camera;dt(this._cameraDirectionNormalized,this._renderer.camera.ray.direction);const i=this._cameraDirectionNormalized[0],r=this._cameraDirectionNormalized[1],s=this._cameraDirectionNormalized[2];let n=0;const u=1.5;if(this.forEachTile(l=>{const{gaussianAtlasIndices:h,positions:c}=l;if(this._minimumBoundingSphere.center=l.obb.center,this._minimumBoundingSphere.radius=(l.obb.radius+l.maxScale)*u,pt(t,this._minimumBoundingSphere))for(let f=0;f<h.length;f++){this._atlasIndicesBuffer[n]=h[f];const T=3*f,G=c[T],I=c[T+1],S=c[T+2];this._distancesBuffer[n]=G*i+I*r+S*s,this._sortOrderBuffer[n]=n,n++}else e-=h.length}),e===0)return this.visibleGaussians=0,this._clearBuffersAndTextures(),void this._renderer.requestRender(1);const o={distances:this._distancesBuffer,sortOrderIndices:this._sortOrderBuffer,numGaussians:e,preciseSort:this._useDeterministicSort};await this._workerHandle?.sort(o).then(l=>{this._distancesBuffer=l.distances,this._sortOrderBuffer=l.sortedOrderIndices});const p=async l=>{const h=this._sortedAtlasIndicesBuffer.subarray(0,e);for(let c=0;c<e;c++)h[c]=this._atlasIndicesBuffer[this._sortOrderBuffer[c]];this._orderTexture.setData(h,e),this.visibleGaussians=e,this._renderer.requestRender(1),l.madeProgress()};await this._frameTask.schedule(p)}set useDeterministicSort(e){this._useDeterministicSort=e}}const j=class j{constructor(e){this.layerView=e,this._numFadingTiles=We(0)}get numFadingTiles(){return this._numFadingTiles.value}fadeTile(e,t){const i=this._getTargetOpacity(t);if(e.fadeDirection=t,this.fadeDuration===0)return void this._instantTileFading(e,i);const r=e.opacityModifier;if(r!==i){const s=1-Math.abs(i-r);this._startTileFading(e,s)}else this._stopTileFading(e)}updateAllTileFading(e){this.layerView.tileHandles.forEach(t=>this._updateTileFading(t,e)),this.layerView.updateGaussians()}onFadeDurationChanged(e){e===0&&this.numFadingTiles>0&&this._instantlyFullyFadeAllTiles()}isTileFadingOut(e){return e.fadeProgress!=null&&e.fadeDirection===1}get updating(){return this._numFadingTiles.value>0}get fadeDuration(){return 0}get fadingEnabled(){return this.fadeDuration!==0}_startTileFading(e,t){e.fadeProgress==null&&this._numFadingTiles.value++,e.fadeProgress=t}_stopTileFading(e){e.fadeProgress!=null&&(e.fadeDirection===1&&this._onTileFullyFadedOut(e),this._numFadingTiles.value--,e.fadeProgress=null)}_updateTileFading(e,t){const{fadeProgress:i,fadeDirection:r}=e;if(i==null)return;const s=this._fadeDirectionToSign(r),n=s*this.fadeDuration,u=this._getTargetOpacity(r),o=t/Math.abs(n||1),p=Math.min(i+o,1),l=s*(1-(r===0?j.fadeInEase:j.fadeOutEase)(p)),h=p===1;e.opacityModifier=h?u:u-l,h?this._stopTileFading(e):e.fadeProgress=p,this._updateOpacityModifier(e)}_updateOpacityModifier(e){const t=255*e.opacityModifier;for(let i=0;i<e.pageIds.length;i++){const r=e.pageIds[i];this.layerView.data.fadingTexture.updateBuffer(t,r)}}_instantTileFading(e,t){e.fadeProgress=null,e.opacityModifier=t,this._updateOpacityModifier(e),e.fadeDirection===1&&this._onTileFullyFadedOut(e)}_instantlyFullyFadeAllTiles(){this.layerView.tileHandles.forEach(e=>{e.fadeProgress!=null&&this._instantTileFading(e,this._getTargetOpacity(e.fadeDirection))}),this.layerView.updateGaussians(),this._numFadingTiles.value=0}_onTileFullyFadedOut(e){e.isVisible=!1,this.layerView.moveTileToCache(e)}_fadeDirectionToSign(e){return e===0?1:-1}_getTargetOpacity(e){return e===0?1:0}};j.fadeInEase=e=>e*(2-e),j.fadeOutEase=e=>e*e;let ve=j;class va{constructor(e){this.layerView=e,this.type=0,this.slicePlaneEnabled=!1,this.isGround=!1,this.intersectionNormal=R(),this.intersectionRayDir=R(),this.intersectionPlane=ft(),this.layerViewUid=e.uid}intersect(e,t,i,r){const{intersectionRayDir:s,intersectionPlane:n,layerViewUid:u,intersectionNormal:o}=this,p=mt(i,r);Je(s,r,i);const l=1/gt(s);me(s,s,l),_t(o,s),vt(n,s[0],s[1],s[2],-xt(s,i));const h=new pe,c=new pe,f=e.options.store,T=f===2,G=f!==0,I=T?new Array:null,S=(d,g,v,D,A)=>(d.point=d.point?bt(d.point,v,D,A):wt(v,D,A),d.dist=g,d.normal=o,d.layerViewUid=u,d),ce=i[0],ue=i[1],he=i[2],Z=s[0],O=s[1],ee=s[2];this.layerView.data.forEachTile(d=>{const g=d.obb.minimumDistancePlane(n),v=d.obb.maximumDistancePlane(n),D=v<0,A=h.dist!=null&&c.dist!=null&&h.dist<g*l&&c.dist>v*l;if(D||A||!d.boundingVolumeIntersectsRay(i,s))return;const{positions:z,squaredScales:k,gaussianAtlasIndices:F}=d,x=F.length;for(let E=0,$=0;E<x;E++,$+=3){const H=z[$],y=z[$+1],b=z[$+2],M=H-ce,C=y-ue,w=b-he,te=M*Z+C*O+w*ee;if(te<0||M*M+C*C+w*w-te*te>k[E])continue;const V=te*l;if((!t||t(i,r,V))&&((h.dist==null||V<h.dist)&&S(h,V,H,y,b),G&&(c.dist==null||V>c.dist)&&S(c,V,H,y,b),T)){const nt=new pe;I.push(S(nt,V,H,y,b))}}});const Y=(d,g)=>{const{layerViewUid:v}=g,D=new Tt(g.point,v);d.set(0,D,g.dist,g.normal)};if(Ne(h)){const d=e.results.min;(d.distance==null||h.dist<d.distance)&&Y(d,h)}if(Ne(c)&&e.options.store!==0){const d=e.results.max;(d.distance==null||c.dist>d.distance)&&Y(d,c)}if(T&&I?.length)for(const d of I){const g=new yt(p);Y(g,d),e.results.all.push(g)}}getElevationRange(e){let t=null;return this.layerView.data.forEachTile(i=>{t?.contains(i.elevationRange)||i.boundingVolumeIntersectsSphere(e)&&(t||(t=new ie),t.expandElevationRange(i.elevationRange))}),t||(t=new ie(0,0)),t}}function Ne(a){return a.dist!=null&&a.point!=null}class pe{constructor(){this.point=null,this.dist=null,this.normal=null,this.layerViewUid=""}}let xa=class{constructor(e,t,i,r,s,n,u,o){this.handle=e,this.obb=t,this.gaussianAtlasIndices=i,this.pageIds=r,this.positions=s,this.squaredScales=n,this.maxScale=u,this.elevationRange=o,this.isVisible=!1,this.fadeDirection=0,this.opacityModifier=0,this.usedMemory=Ct(this.gaussianAtlasIndices,this.positions,this.squaredScales)+this.pageIds.length*tt*4;const p=R();t?.getCenter(p),this._obbCenterX=p[0],this._obbCenterY=p[1],this._obbCenterZ=p[2];const l=t?.radius??-1;this._obbRadius=l;const h=l<0?-1:l*l;this._obbRadiusSquared=h;const c=t?.halfSize;this._obbShortestHalfsize=c?Math.min(c[0],c[1],c[2]):0}boundingVolumeIntersectsRay(e,t){if(!this.obb)return!0;const{_obbCenterX:i,_obbCenterY:r,_obbCenterZ:s}=this,n=i-e[0],u=r-e[1],o=s-e[2],p=n*t[0]+u*t[1]+o*t[2],l=n*n+u*u+o*o-p*p;return(this._obbRadiusSquared<0||l<=this._obbRadiusSquared)&&this.obb.intersectRay(e,t)}boundingVolumeIntersectsSphere(e){const t=this._obbRadius;if(t<0)return!0;const i=e.center,r=e.radius,s=t+r,n=this._obbCenterX-i[0];if(n>s)return!1;const u=this._obbCenterY-i[1];if(u>s)return!1;const o=this._obbCenterZ-i[2];if(o>s)return!1;const p=n*n+u*u+o*o;return p>s*s?!1:p<=(this._obbShortestHalfsize+r)**2?!0:Math.sqrt(p)+t<=r||(this.obb?.intersectSphere(e)??!0)}};function ya(a){a.code.add(_`void computeCovariance3D(in mat3 rotation, in vec3 scale, out vec3 covarianceA, out vec3 covarianceB) {
mat3 scaleMatrix = mat3(
vec3(scale.x, 0.0, 0.0),
vec3(0.0, scale.y, 0.0),
vec3(0.0, 0.0, scale.z)
);
mat3 M = scaleMatrix * rotation;
mat3 covariance3D = transpose(M) * M;
covarianceA = vec3(covariance3D[0][0], covariance3D[0][1], covariance3D[0][2]);
covarianceB = vec3(covariance3D[1][1], covariance3D[1][2], covariance3D[2][2]);
}
vec3 computeCovariance2D(vec3 center, float focalLength, vec2 tanFov, float[6] cov3D, mat4 view) {
vec4 viewSpacePoint = vec4(center, 1);
vec2 max = 1.3 * tanFov;
vec2 normalized = viewSpacePoint.xy / viewSpacePoint.z;
viewSpacePoint.xy = clamp(normalized, -max, max) * viewSpacePoint.z;
float invZ = 1.0 / viewSpacePoint.z;
float invZSquared = invZ * invZ;
mat3 projectionJacobian = mat3(
focalLength * invZ,  0.0,                   -(focalLength * viewSpacePoint.x) * invZSquared,
0.0,                 focalLength * invZ,    -(focalLength * viewSpacePoint.y) * invZSquared,
0.0,                 0.0,                   0.0
);
mat3 worldToView = transpose(mat3(view));
mat3 T = worldToView * projectionJacobian;
mat3 covariance3D = mat3(
cov3D[0], cov3D[1], cov3D[2],
cov3D[1], cov3D[3], cov3D[4],
cov3D[2], cov3D[4], cov3D[5]
);
mat3 covariance2D = transpose(T) * transpose(covariance3D) * T;
const float regularization = 0.3;
covariance2D[0][0] += regularization;
covariance2D[1][1] += regularization;
return vec3(covariance2D[0][0], covariance2D[0][1], covariance2D[1][1]);
}`)}let ba=class extends Te{constructor(){super(...arguments),this.tileCameraPosition=R(),this.cameraDelta=R()}};function wa(a){a.code.add(_`vec4 unpackColor(uvec4 packedGaussian) {
vec4 color;
color.r = float((packedGaussian.w >> 1u) & 0xfeu);
color.g = float((packedGaussian.w >> 9u) & 0xffu);
color.b = float((packedGaussian.w >> 16u) & 0xfeu);
color.a = float((packedGaussian.w >> 24u) & 0xffu);
return color / 255.0;
}`),a.code.add(_`vec3 unpackScale(uvec4 packedGaussian) {
uint sx = (packedGaussian.z >> 10u) & 0xffu;
uint sy = (packedGaussian.z >> 18u) & 0xffu;
uint szLow = (packedGaussian.z >> 26u) & 0x3fu;
uint szHigh = packedGaussian.a & 0x3u;
uint sz = szLow | (szHigh << 6u);
return exp(vec3(sx, sy, sz) / 16.0 - 10.0);
}`),a.code.add(_`const uint MASK_9_BITS = 0x1FFu;
const float SQRT_HALF = 0.7071067811865476;
const ivec3 COMPONENT_ORDER[4] = ivec3[4](
ivec3(3, 2, 1),
ivec3(3, 2, 0),
ivec3(3, 1, 0),
ivec3(2, 1, 0)
);
vec4 unpackQuaternion(uvec4 packedGaussian) {
uint packedRotation = packedGaussian.x;
uint largestComponent = packedRotation >> 30u;
vec4 quaternion = vec4(0.0);
float sumSquares = 0.0;
uint bitfield = packedRotation;
for (int j = 0; j < 3; ++j) {
int index = COMPONENT_ORDER[int(largestComponent)][j];
uint magnitude = bitfield & MASK_9_BITS;
uint signBit = (bitfield >> 9u) & 1u;
bitfield = bitfield >> 10u;
float value = SQRT_HALF * float(magnitude) / float(MASK_9_BITS);
quaternion[index] = signBit == 1u ? -value : value;
sumSquares += value * value;
}
quaternion[int(largestComponent)] = sqrt(1.0 - sumSquares);
return quaternion;
}`),a.code.add(_`vec3 unpackTileOriginRelativePosition(uvec4 packedGaussian) {
uint packedPositionLow = packedGaussian.y;
uint packedPositionHigh = packedGaussian.z;
uint x = packedPositionLow & 0x3FFFu;
uint y = (packedPositionLow >> 14u) & 0x3FFFu;
uint zLow = (packedPositionLow >> 28u) & 0xFu;
uint zHigh = packedPositionHigh & 0x3FFu;
uint z = zLow | (zHigh << 4u);
return vec3(float(x), float(y), float(z));
}`),a.uniforms.add(new Ge("tileCameraPosition",e=>e.tileCameraPosition),new Ge("cameraDelta",e=>e.cameraDelta)).code.add(_`vec3 unpackCameraRelativeGaussianPosition(uvec4 packedHeader, highp vec3 position) {
vec3 tileOrigin = uintBitsToFloat(packedHeader.xyz);
float invPosScale = 1.0 / exp2(float(packedHeader.w & 0xfu));
vec3 delta = tileOrigin.xyz - tileCameraPosition;
vec3 cameraRelativePosition = position * invPosScale + delta * 2.048 - cameraDelta;
return cameraRelativePosition;
}`)}function Ta(a){a.code.add(_`mat3 quaternionToRotationMatrix(vec4 q) {
float x2 = q.x + q.x;
float y2 = q.y + q.y;
float z2 = q.z + q.z;
float xx = x2 * q.x;
float yy = y2 * q.y;
float zz = z2 * q.z;
float xy = x2 * q.y;
float xz = x2 * q.z;
float yz = y2 * q.z;
float wx = x2 * q.w;
float wy = y2 * q.w;
float wz = z2 * q.w;
return mat3(
1.0 - (yy + zz), xy - wz, xz + wy,
xy + wz, 1.0 - (xx + zz), yz - wx,
xz - wy, yz + wx, 1.0 - (xx + yy)
);
}`)}function at(a){a.code.add(_`vec3 encodeNormalizedDepthToRGB(float normalizedDepth) {
float depth24 = normalizedDepth * 16777215.0;
float high = floor(depth24 / 65536.0);
depth24 -= high * 65536.0;
float mid = floor(depth24 / 256.0);
float low = depth24 - mid * 256.0;
return vec3(high, mid, low) / 255.0;
}`),a.code.add(_`float decodeRGBToNormalizedDepth(vec3 rgb) {
rgb *= 255.0;
float depth = rgb.r * 65536.0 + rgb.g * 256.0 + rgb.b;
depth /= 16777215.0;
return depth;
}`)}class N extends Pt{constructor(e){super(),this.spherical=e,this.alphaCutoff=1,this.fadingEnabled=!1,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.occlusionPass=!1,this.receiveAmbientOcclusion=!1,this.pbrMode=0,this.useCustomDTRExponentForWater=!1,this.useFillLights=!1,this.hasColorTexture=!0}}function Ca(a){switch(a){case 2:return .005;case 0:return .05;default:return .01}}m([X({count:3})],N.prototype,"alphaCutoff",void 0),m([X()],N.prototype,"fadingEnabled",void 0),m([X()],N.prototype,"terrainDepthTest",void 0),m([X()],N.prototype,"cullAboveTerrain",void 0),m([X()],N.prototype,"receiveAmbientOcclusion",void 0);class Fe extends ba{constructor(){super(...arguments),this.focalLength=-1,this.minSplatRadius=-1,this.tanFov=Ze()}}function it(a){const e=new Ce;e.varyings.add("vColor","vec4"),e.varyings.add("conicOpacity","vec4"),e.varyings.add("offsetFromCenter","vec2"),e.vertex.uniforms.add(new de("splatOrderTexture",s=>s.splatOrder),new de("splatFadingTexture",s=>s.splatFading),new de("splatAtlasTexture",s=>s.splatAtlas),new Ie("focalLength",s=>s.focalLength),new Ie("minSplatRadius",s=>s.minSplatRadius),new St("tanFov",s=>s.tanFov),new Oe("screenSize",({camera:s})=>Ye(Pa,s.fullWidth,s.fullHeight)),new He("proj",s=>s.camera.projectionMatrix),new He("view",s=>s.camera.viewMatrix),new Oe("nearFar",s=>s.camera.nearFar),new Dt("cameraPosition",s=>s.camera.eye)),e.vertex.include(wa),e.vertex.include(Ta),e.vertex.include(ya),e.vertex.include(At,a),e.include(zt,a),Ft(e.vertex),$t(e.vertex),e.include(Mt,a),e.outputs.add("fragColor","vec4",0),e.outputs.add("fragDepthColor","vec4",1);const t=Ca(a.alphaCutoff),i=Math.log(t),r=-2*i;return e.vertex.code.add(_`vec2 ndcToPixel(vec2 ndcCoord, vec2 screenSize) {
return ((ndcCoord + 1.0) * screenSize - 1.0) * 0.5;
}`),e.vertex.main.add(`
    uint instanceID = uint(gl_InstanceID);

    // Transform the instanceID into 2D coordinates
    uint orderTextureWidth = uint(textureSize(splatOrderTexture, 0).x);
    uint x = instanceID % orderTextureWidth;
    uint y = instanceID / orderTextureWidth;

    // Fetch the index of the remaining frontmost Gaussian
    uint gaussianIndex = texelFetch(splatOrderTexture, ivec2(x, y), 0).r;

    uint splatAtlasWidth = uint(textureSize(splatAtlasTexture, 0).x);

    // Fetch the packed Gaussian according to the index
    uint gaussianIndexX = gaussianIndex % splatAtlasWidth;
    uint gaussianIndexY = gaussianIndex / splatAtlasWidth;
    uvec4 packedGaussian = texelFetch(splatAtlasTexture, ivec2(gaussianIndexX, gaussianIndexY), 0);

    // Fetch the header associated with the packed Gaussian (contains tile origin and number of fractional bits)
    uint pageNum = gaussianIndex / 1024u;
    uint headerIndex = (pageNum + 1u) * 1024u - 1u;
    uint headerIndexX = headerIndex % splatAtlasWidth;
    uint headerIndexY = headerIndex / splatAtlasWidth;
    uvec4 packedHeader = texelFetch(splatAtlasTexture, ivec2(headerIndexX, headerIndexY), 0);

    // Unpack the Gaussian
    vColor = unpackColor(packedGaussian);

    // Handle fading
    ${It(a.fadingEnabled,`
      uint fadingTextureWidth = uint(textureSize(splatFadingTexture, 0).x);
      uint fadeX = pageNum  % fadingTextureWidth;
      uint fadeY = pageNum  / fadingTextureWidth;
      uint opacityModifierByte = texelFetch(splatFadingTexture, ivec2(fadeX , fadeY), 0).r;
      float opacityModifier = float(opacityModifierByte) / 255.0;
      vColor.a *= opacityModifier;
      `)}

    // set default position outside clipspace for early returns
    gl_Position = ${Gt};

    if(vColor.a < ${t}) {
      return;
    }

    vec3 scale = unpackScale(packedGaussian);
    vec4 quaternion = unpackQuaternion(packedGaussian);
    mat3 rotation = quaternionToRotationMatrix(quaternion);
    vec3 tileOriginRelativePosition = unpackTileOriginRelativePosition(packedGaussian);

    vec3 cameraRelativePosition = unpackCameraRelativeGaussianPosition(packedHeader, tileOriginRelativePosition);

    vec4 viewPos = vec4(mat3(view) * cameraRelativePosition, 1);

    if (viewPos.z > -nearFar.x || viewPos.z < -nearFar.y) {
      return;
    }

    forwardViewPosDepth(viewPos.xyz);

    // Handle environment (scene lighting)
    vec3 groundNormal = ${a.spherical?_`normalize(cameraRelativePosition + cameraPosition)`:_`vec3(0.0, 0.0, 1.0)`};
    float groundLightAlignment = dot(groundNormal, mainLightDirection);
    float additionalAmbientScale = additionalDirectedAmbientLight(groundLightAlignment);
    vec3 additionalLight = mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
    vColor.rgb = evaluateSceneLighting(groundNormal, vColor.rgb, 0.0, 0.0, mainLightIntensity);

    vec3 covarianceA;
    vec3 covarianceB;
    computeCovariance3D(rotation, scale.xyz, covarianceA, covarianceB);

    float covariance3D[6] = float[6](covarianceA.x, covarianceA.y, covarianceA.z, covarianceB.x, covarianceB.y, covarianceB.z);

    vec3 covariance2D = computeCovariance2D(viewPos.xyz, focalLength, tanFov, covariance3D, view);

    // Compute the Gaussians extent in screen space by finding the eigenvalues lambda1 and lambda2
    // of the 2D covariance matrix
    float mid = 0.5 * (covariance2D.x + covariance2D.z);
    float radius = length(vec2((covariance2D.x - covariance2D.z) * 0.5, covariance2D.y));
    float lambda1 = mid + radius;
    float lambda2 = mid - radius;

    // Compute the extents along the principal axes
    float l1 = ceil(sqrt(lambda1 * ${r}));
    float l2 = ceil(sqrt(lambda2 * ${r}));

    float maxRadius = max(l1, l2);

    // Ignore gaussians with very small contribution, with tolerance based on the quality profile
    if(minSplatRadius > 0.0) {
      float effectiveSize = maxRadius * vColor.a;
      if(effectiveSize < minSplatRadius) {
        return;
      }
    }

    vec4 projPos = proj * viewPos;
    float invW = 1. / (projPos.w + 1e-7);
    vec3 ndcPos = projPos.xyz * invW;

    // Screen space frustum culling
    vec2 radiusNDC = maxRadius * 2.0 / screenSize;

    if (any(greaterThan(abs(ndcPos.xy) - radiusNDC, vec2(1.0)))) {
        return;
    }

    // Compute the principal diagonal direction (eigenvector for lambda1)
    vec2 diagonalVector = normalize(vec2(covariance2D.y, lambda1 - covariance2D.x));

    vec2 majorAxis = l1 * diagonalVector;
    vec2 minorAxis = l2 * vec2(diagonalVector.y, -diagonalVector.x);

    vec2 gaussianCenterScreenPos = ndcToPixel(ndcPos.xy, screenSize);

    // This maps vertex IDs 0, 1, 2, 3 to (-1,-1), (1,-1), (-1,1), (1,1)
    vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2) - 1.0;
    offsetFromCenter = corner.x * majorAxis + corner.y * minorAxis;

    // Invert covariance (EWA algorithm)
    float determinant = (covariance2D.x * covariance2D.z - covariance2D.y * covariance2D.y);
    if (determinant <= 0.) {
      return;
    }
    float invDeterminant = 1. / determinant;

    // We use a conic function to derive the opacity
    vec3 conic = vec3(covariance2D.z, -covariance2D.y, covariance2D.x) * invDeterminant;
    conicOpacity = vec4(conic, vColor.a);

    // Convert from screen-space to clip-space using center + offset
    vec2 clipPos = (gaussianCenterScreenPos + offsetFromCenter) / screenSize * 2. - 1.;

    gl_Position = vec4(clipPos, ndcPos.z, 1.0);

  `),e.fragment.include(at),e.fragment.main.add(`
    discardByTerrainDepth();

    // Evaluate the 2D elliptical Gaussian exponent using the general conic form: Ax^2+2Bxy+Cy^2
    float x = offsetFromCenter.x;
    float y = offsetFromCenter.y;
    float conic = dot(conicOpacity.xyz, vec3(x * x, 2.0 * x * y, y * y));
    float gaussianExponent = -0.5 * conic;

    // A positive exponent indicates alpha > 1, this should not happen
    // We also early check the alphaCutoff (i.e., ln(alphaCutoff)), to avoid unnecessary exp()
    if (gaussianExponent > 0.0 || gaussianExponent < ${i}) {
      discard;
    }

    float gaussianFalloff = exp(gaussianExponent);

    // cap at 0.99 to avoid blending issues, such as seams between overlapping Gaussians
    float alpha = min(.99f, conicOpacity.w * gaussianFalloff);

    fragColor = vec4(vColor.rgb * alpha, alpha);

    // We simulate first hit based depth using 0.25 as the opacity threshold.
    // This works because we render in front-to-back order,
    // i.e. the first hit that counts completelly saturates the alpha channel
    // and further splats do not contribute.
    float countHit = step(0.25, alpha);
    float normalizedDepth = gl_FragCoord.z;
    fragDepthColor = vec4(encodeNormalizedDepthToRGB(normalizedDepth) * countHit, countHit);
  `),e}const Pa=Ze(),Sa=Object.freeze(Object.defineProperty({__proto__:null,GaussianSplatPassParameters:Fe,build:it},Symbol.toStringTag,{value:"Module"}));let $e=class extends Te{};function st(){const a=new Ce;return a.include(Xe),a.fragment.uniforms.add(new ge("colorTexture",e=>e.color),new ge("splatOutputColor",e=>e.splatColor)),a.fragment.main.add(_`vec4 color = texture(colorTexture, uv);
vec4 splatColor = texture(splatOutputColor, uv);
fragColor = splatColor + color * (1.0 - splatColor.a);`),a}const Da=Object.freeze(Object.defineProperty({__proto__:null,GaussianSplatCompositionPassParameters:$e,build:st},Symbol.toStringTag,{value:"Module"}));let re=class extends Pe{constructor(){super(...arguments),this.shader=new Se(Da,()=>De(()=>Promise.resolve().then(()=>za),void 0))}initializePipeline(){return Ae({colorWrite:Ke,depthTest:null,depthWrite:Qe})}};re=m([K("esri.views.3d.webgl-engine.shaders.GaussianSplatCompositionTechnique")],re);class Me extends Te{}function rt(){const a=new Ce;a.include(Xe);const e=a.fragment;return e.uniforms.add(new ge("splatOutputDepth",t=>t.splatDepth)),e.include(at),e.main.add(_`vec4 splatDepth = texture(splatOutputDepth, uv);
float depth = decodeRGBToNormalizedDepth(splatDepth.xyz);
if(splatDepth.a < 1.0) {
discard;
}
gl_FragDepth = depth;`),a}const Aa=Object.freeze(Object.defineProperty({__proto__:null,GaussianSplatDepthCompositionPassParameters:Me,build:rt},Symbol.toStringTag,{value:"Module"}));let ne=class extends Pe{constructor(){super(...arguments),this.shader=new Se(Aa,()=>De(()=>Promise.resolve().then(()=>Fa),void 0))}initializePipeline(){return Ae({colorWrite:null,depthTest:{func:515},depthWrite:Qe,drawBuffers:{buffers:[Ot]}})}};ne=m([K("esri.views.3d.webgl-engine.shaders.GaussianSplatDepthCompositionTechnique")],ne);let oe=class extends Pe{constructor(){super(...arguments),this.shader=new Se(Sa,()=>De(()=>Promise.resolve().then(()=>$a),void 0))}initializePipeline(){return Ae({blending:Rt(773,773,1,1,32774,32774),depthTest:{func:515},colorWrite:Ke,drawBuffers:{buffers:[Ht,_e]}})}};oe=m([K("esri.views.3d.webgl-engine.shaders.GaussianSplatTechnique")],oe);var ae,B;let Q=(B=class extends kt{constructor(e){super(e),this._slicePlaneEnabled=!1,this.produces=Re.GAUSSIAN_SPLAT,this.layerView=null,this._passParameters=new Fe,this._compositionPassParameters=new $e,this._depthCompositionPassParameters=new Me,this._previousCameraPosition=R(),this._previousCameraDirection=R(),this._configuration=new N(e.view.state.isGlobal)}async initialize(){this.addHandles([L(()=>this.view.state.camera,()=>this._onCameraChange())])}precompile(){this._configuration.alphaCutoff=this.view.qualitySettings.gaussianSplat.minimumOpacity,this._configuration.terrainDepthTest=this.bindParameters.terrainDepthTest,this._configuration.fadingEnabled=this._fadeHelper.fadingEnabled,this.techniques.precompile(oe,this._configuration),this.techniques.precompile(re),this.techniques.precompile(ne)}render(e){const t=e.find(({name:f})=>f===Re.GAUSSIAN_SPLAT);if(this._handleFading(),!this._data.visibleGaussians||!this._data.orderTexture.texture||!this._data.textureAtlas.texture)return t;const i=this.techniques.get(oe,this._configuration),r=this.techniques.get(re),s=this.techniques.get(ne);if(!i.compiled||!s.compiled||!r.compiled)return this.requestRender(1),t;const{fullWidth:n,fullHeight:u}=this.bindParameters.camera;this._prepareParameters(u,n);const o=this.renderingContext,p=this.fboCache,l=p.acquire(n,u,"gaussian color output"),h=t.getAttachment(ke);l.attachDepth(h),this._renderGaussianColorAndDepth(l,i);const c=p.acquire(n,u,this.produces);return this._depthCompositionPassParameters.splatDepth=l.getTexture(_e),c.attachDepth(t.getAttachment(ke)),o.bindFramebuffer(c.fbo),o.bindTechnique(s,this.bindParameters,this._depthCompositionPassParameters),o.screen.draw(),this._compositionPassParameters.color=t.getTexture(),this._compositionPassParameters.splatColor=l.getTexture(),o.bindFramebuffer(c.fbo),o.bindTechnique(r,this.bindParameters,this._compositionPassParameters),o.screen.draw(),l.release(),c}get slicePlaneEnabled(){return this._slicePlaneEnabled}set slicePlaneEnabled(e){this._slicePlaneEnabled!==e&&(this._slicePlaneEnabled=e,this.requestRender(1))}get _data(){return this.layerView.data}get _fadeHelper(){return this.layerView.fadeHelper}destroy(){super.destroy()}_onCameraChange(){const e=this.view.state.camera.eye,t=this.view.state.camera.ray.direction,i=.001;(Math.abs(e[0]-this._previousCameraPosition[0])>i||Math.abs(e[1]-this._previousCameraPosition[1])>i||Math.abs(e[2]-this._previousCameraPosition[2])>i||Math.abs(t[0]-this._previousCameraDirection[0])>i||Math.abs(t[1]-this._previousCameraDirection[1])>i||Math.abs(t[2]-this._previousCameraDirection[2])>i)&&(Ee(this._previousCameraPosition,e),Ee(this._previousCameraDirection,t),this._data.requestSort())}_prepareParameters(e,t){this._passParameters.splatOrder=this._data.orderTexture.texture,this._passParameters.splatFading=this._data.fadingTexture.texture,this._passParameters.splatAtlas=this._data.textureAtlas.texture;const i=Math.tan(.5*this.camera.fovY),r=i/e*t;Ye(this._passParameters.tanFov,r,i),this._passParameters.focalLength=e/(2*i);const s=this.view.qualitySettings.gaussianSplat.minimumSplatPixelRadius;this._passParameters.minSplatRadius=s*Math.sqrt(t*e)/Math.sqrt(2073600),this._prepareHighPrecisionCameraPosition()}_renderGaussianColorAndDepth(e,t){const i=this.renderingContext;e.acquireColor(_e,5,"gaussian depth output"),i.bindFramebuffer(e.fbo),i.setClearColor(0,0,0,0),i.clear(16384),this.renderingContext.bindTechnique(t,this.bindParameters,this._passParameters),this.renderingContext.drawArraysInstanced(Et.TRIANGLE_STRIP,0,4,this._data.visibleGaussians)}_prepareHighPrecisionCameraPosition(){me(this._passParameters.tileCameraPosition,this.camera.eye,1/ae.tileSize),qt(this._passParameters.tileCameraPosition,this._passParameters.tileCameraPosition),me(this._passParameters.cameraDelta,this._passParameters.tileCameraPosition,ae.tileSize),Je(this._passParameters.cameraDelta,this.camera.eye,this._passParameters.cameraDelta)}_handleFading(){if(this._fadeHelper.numFadingTiles===0)return void(this._previousFrameStart=null);this._previousFrameStart??=this.view.stage.renderer.renderContext.time;const e=this.view.stage?.renderer.renderContext.time-this._previousFrameStart;this._fadeHelper.updateAllTileFading(e),this._previousFrameStart=this.view.stage.renderer.renderContext.time,this._data.fadingTexture.updateTexture(this._data.textureAtlas.pageAllocator.pageCount)}},ae=B,B.tileSize=2.048,B);m([U()],Q.prototype,"produces",void 0),m([U({constructOnly:!0})],Q.prototype,"layerView",void 0),Q=ae=m([K("esri.views.3d.webgl-engine.lib.GaussianSplatRenderNode")],Q);const fe=()=>ra.getLogger("esri.views.3d.layers.GaussianSplatLayerView3D");let q=class extends oa(ca){constructor(a){super(a),this.type="gaussian-splat-3d",this.ignoresMemoryFactor=!1,this._tileHandles=new Map,this._pageBuffer=new Uint32Array(tt),this._tmpObbsWithChangedVisibility=new Array,this._frameTask=null,this._wasmLayerId=-1,this._metersPerVCSUnit=1,this._usedMemory=0,this._cacheMemory=0,this._useEsriCrs=!1,this.fullExtentInLocalViewSpatialReference=null,this._suspendedHandle=null,this._conversionBuffer=new ArrayBuffer(4),this._u32View=new Uint32Array(this._conversionBuffer),this._f32View=new Float32Array(this._conversionBuffer);const{view:e}=a;this._memCache=e.resourceController.memoryController.newCache(`GaussianSplat-${this.uid}`,t=>this._deleteTile(t))}initialize(){if(!this._canProjectWithoutEngine())throw Bt("layer",this.layer.spatialReference.wkid,this.view.renderSpatialReference?.wkid);const a=Vt(this).then(e=>{this._wasmLayerId=e,this._renderNode=new Q({view:this.view,layerView:this}),this.data=new _a(this._renderNode),this.fadeHelper=new ve(this),this._intersectionHandler=new va(this),this.view.sceneIntersectionHelper.addIntersectionHandler(this._intersectionHandler),this._elevationProvider=new la({view:this.view,layerElevationSource:this,intersectionHandler:this._intersectionHandler}),this.view.elevationProvider.register(2,this._elevationProvider),this.addHandles([L(()=>this.layer.elevationInfo,t=>this._elevationInfoChanged(t))]),this._suspendedHandle=L(()=>this.suspended,t=>this._wasm?.setEnabled(this,!t),Lt),this.setMaximumGaussianCount(this.view.qualitySettings.gaussianSplat.maximumNumberOfGaussians)});this.addHandles([L(()=>this.view.qualitySettings.fadeDuration,e=>{this.fadeHelper.onFadeDurationChanged(e),this.data.fadingTexture.updateTexture(this.data.textureAtlas.pageAllocator.pageCount)}),L(()=>this.view.qualitySettings.gaussianSplat.maximumNumberOfGaussians,e=>this.setMaximumGaussianCount(e*this.view.quality)),L(()=>this.view.quality,e=>this.setMaximumGaussianCount(this.view.qualitySettings.gaussianSplat.maximumNumberOfGaussians*e))]),this.addResolvingPromise(a),this._frameTask=this.view.resourceController.scheduler.registerTask(je.GAUSSIAN_SPLAT_TEXTURE_ATLAS)}get wasmLayerId(){return this._wasmLayerId}get metersPerVCSUnit(){return this._metersPerVCSUnit}get tileHandles(){return this._tileHandles}get _wasm(){return Nt(this.view)}get usedMemory(){return this._usedMemory}get cachedMemory(){return this._cacheMemory}get unloadedMemory(){return 0}get useEsriCrs(){return this._useEsriCrs}get elevationProvider(){return this._elevationProvider}get elevationOffset(){return qe(this.layer.elevationInfo)}get elevationRange(){const a=this.fullExtent;return a?.zmin&&a?.zmax?new ie(a.zmin,a.zmax):null}getElevationRange(a){return this._intersectionHandler.getElevationRange(a)}get fullExtent(){return this.layer.fullExtent}get visibleAtCurrentScale(){return Ut(this.layer.effectiveScaleRange,this.view.scale)}isUpdating(){const a=this._wasm;return!(this._wasmLayerId<0||a==null)&&(a.isUpdating(this._wasmLayerId)||this.data.updating||this.fadeHelper.updating)}updatingFlagChanged(){this.notifyChange("updating")}async createRenderable(a){const e=a.meshData;if(e.data==null)throw new Error("meshData.data undefined");if(e.desc=JSON.parse(e.desc),e.desc==null)throw new Error("meshData.desc undefined");const t=e.desc.prims[0],i=t.vertexCount,r=t.atrbs[0].view,s=t.atrbs[0].view.byteCount,n=t.atrbs[0].view.byteOffset;let u=null;if(r.type!=="U32")return fe().warnOnce("unexpected meshData.data format"),{memUsageBytes:0,numGaussians:0};u=new Uint32Array(e.data.buffer,n,s/4);const o=this.extractHeader(u),p=Math.ceil(i/W),l=new Uint32Array(i),h=new Array;let c=!1,f=0;const T=async F=>{for(;f<p&&!F.done&&!c;f++){let x=this.data.textureAtlas.requestPage();if(x===null&&(this._freeInvisibleTiles(),x=this.data.textureAtlas.requestPage()),x!==null){h.push(x);const E=i-f*W,$=Math.min(E,W),H=f*W;for(let w=0;w<$;w++)l[w+H]=w+J*x;const y=f*Le;this._pageBuffer.set(u.subarray(y,y+$*se)),this._pageBuffer.set(o.packedHeader,Le);const b=x*J,M=b%P,C=Math.floor(b/P);this.data.textureAtlas.update(M,C,this._pageBuffer),F.madeProgress()}else c=!0}f<p&&!c&&await this._frameTask.schedule(T)};if(await this._frameTask.schedule(T),c)return fe().warnOnce("ran out of gaussian splat memory"),{memUsageBytes:0,numGaussians:0};const G=new Float64Array(3*i),I=new Float32Array(i),S=2.048,ce=o.tileOrigin.x*S,ue=o.tileOrigin.y*S,he=o.tileOrigin.z*S,Z=o.invPosScale,O=new ie,ee=this.view.state.isGlobal,Y=ee?Wt(this.view.spatialReference).radius:0;let d=0,g=0,v=0;const D=async F=>{for(;v<i&&!F.done;v++){const x=v*se,{rawX:E,rawY:$,rawZ:H}=this._extractGaussianPosition(u,x),y=this._extractGaussianSphericalScale(u,x),b=E*Z+ce,M=$*Z+ue,C=H*Z+he;G[d]=b,G[d+1]=M,G[d+2]=C;const w=ee?Math.sqrt(b*b+M*M+C*C)-Y:C;O.expandElevationRangeValues(w,w),I[v]=y*y,g=Math.max(g,y),d+=3,F.madeProgress()}v<i&&await this._frameTask.schedule(D)};await this._frameTask.schedule(D);let A=null;if(e.desc.obb){const F=e.desc.obb.quaternion;A=new Be(e.desc.obb.center,e.desc.obb.halfSize,jt(...F))}A||(fe().warnOnce("encountered tile without a bounding box"),A=new Be);const{fullExtent:z}=this.layer;z?.hasZ&&z.zmax&&z.zmin&&(O.minElevation=Math.max(O.minElevation,z.zmin),O.maxElevation=Math.min(O.maxElevation,z.zmax));const k=new xa(a.handle,A,l,h,G,I,g,O);return this._memCache.put(`${k.handle}`,k),this._tileHandles.set(a.handle,k),this._cacheMemory+=k.usedMemory,{memUsageBytes:k.usedMemory,numGaussians:i}}_extractGaussianPosition(a,e){const t=a[e+1];return{rawX:16383&t,rawY:t>>>14&16383,rawZ:t>>>28&15|(1023&a[e+2])<<4}}_extractGaussianSphericalScale(a,e){const t=a[e+2],i=t>>>10&255,r=t>>>18&255,s=t>>>26&63|(3&a[e+3])<<6,n=Math.exp(i/16-10),u=Math.exp(r/16-10),o=Math.exp(s/16-10);return Math.max(n,u,o)}freeRenderable(a){const e=this._tileHandles.get(a);e&&(e.isVisible&&!this.fadeHelper.isTileFadingOut(e)?this._usedMemory-=e.usedMemory:this._cacheMemory-=e.usedMemory,e.pageIds.forEach(t=>this.data.textureAtlas.freePage(t)),this.freeObject(e),this._tileHandles.delete(a)),this.updateGaussians()}freeObject(a){this._memCache.pop(`${a.handle}`)}setRenderableVisibility(a,e,t){const i=this._tmpObbsWithChangedVisibility;i.length=0;for(let r=0;r<t;r++){if(!e[r])continue;const s=a[r],n=this._tileHandles.get(s);n&&(n.isVisible&&!this.fadeHelper.isTileFadingOut(n)||(n.isVisible=!0,i.push(n.obb),this.fadeHelper.isTileFadingOut(n)||this._popTileFromCache(n),this.fadeHelper.fadeTile(n,0)))}for(let r=0;r<t;r++){if(e[r])continue;const s=a[r],n=this._tileHandles.get(s);n&&n.isVisible&&(i.push(n.obb),this.fadeHelper.fadeTile(n,1))}i.length>0&&this._elevationProvider&&this._elevationProvider.notifyObjectsChanged(i),this.updateGaussians()}_popTileFromCache(a){this._usedMemory+=a.usedMemory,this._cacheMemory-=a.usedMemory,this._memCache.pop(`${a.handle}`)}moveTileToCache(a){this._usedMemory-=a.usedMemory,this._cacheMemory+=a.usedMemory,this._memCache.put(`${a.handle}`,a)}destroy(){Jt(this),this._suspendedHandle&&(this._suspendedHandle=Zt(this._suspendedHandle)),this._intersectionHandler&&(this.view.sceneIntersectionHelper.removeIntersectionHandler(this._intersectionHandler),this._intersectionHandler=null),this._elevationProvider&&this.view.elevationProvider&&(this._elevationProvider.notifyObjectsChangedFunctional(a=>{for(const e of this._tileHandles.values())a(e.obb)}),this.view.elevationProvider.unregister(this._elevationProvider),this._elevationProvider=null),this._frameTask.remove(),this._renderNode.destroy(),this.data.destroy(),this._memCache.destroy()}_canProjectWithoutEngine(){if(this.view.state.viewingMode===1||Yt(this.view.renderSpatialReference)||Xt(this.view.renderSpatialReference))return!0;if(this.layer.esriCrsSpatialReference&&Qt(this.layer.esriCrsSpatialReference,this.view.renderSpatialReference)){if(this.layer.esriCrsSpatialReference.vcsWkid===115700)return!1;let a=na(this.layer.esriCrsSpatialReference);if(!a){const t=this.layer.esriCrsSpatialReference;let i="meters";!Kt(t)&&t.wkid&&t.wkid!==-1&&(i=ea(Ve.units[Ve[t.wkid]])),i&&(a=new ta({heightModel:"gravity-related-height",heightUnit:i}))}const e=this.view.heightModelInfo;return this._useEsriCrs=aa(a,e,!1)===0,this._useEsriCrs&&(a&&(this._metersPerVCSUnit=ia(1,"meters",a.heightUnit)),this.fullExtentInLocalViewSpatialReference=this.layer.esriCrsFullExtent),this._useEsriCrs}return!1}_elevationInfoChanged(a){if(a?.offset)if(this._useEsriCrs){const e=sa(a?.unit)/this._metersPerVCSUnit,t=a?.offset??0;this._wasm?.setLayerOffset(this,t*e)}else this._wasm?.setLayerOffset(this,qe(a));else this._wasm?.setLayerOffset(this,0)}updateGaussians(){const a=new Array;for(const e of this._tileHandles.values())e.isVisible&&a.push(e);this.data.updateGaussianVisibility(a),this.notifyChange("updating")}setMaximumGaussianCount(a){this._wasm?.setMaximumGaussianSplatCount(a)}_freeInvisibleTiles(){for(const a of this._tileHandles.values())a.isVisible||this._deleteTile(a)}extractHeader(a){const e=a.length-4,t=this.reinterpretU32AsFloat(a[e]),i=this.reinterpretU32AsFloat(a[e+1]),r=this.reinterpretU32AsFloat(a[e+2]),s=1/(1<<(255&a[e+3]));return{packedHeader:a.subarray(e,e+4),tileOrigin:{x:t,y:i,z:r},invPosScale:s}}_deleteTile(a){this._wasm?.onRenderableEvicted(this,a.handle,a.usedMemory),this.freeRenderable(a.handle)}reinterpretU32AsFloat(a){return this._u32View[0]=a,this._f32View[0]}get performanceInfo(){let a=0,e=0;return this._tileHandles.forEach(t=>{t.isVisible?a++:e++}),new ua(this.usedMemory,a,e,this.cachedMemory)}get test(){}};m([U()],q.prototype,"layer",void 0),m([U()],q.prototype,"elevationOffset",null),m([U({readOnly:!0})],q.prototype,"visibleAtCurrentScale",null),m([U()],q.prototype,"fullExtentInLocalViewSpatialReference",void 0),q=m([K("esri.views.3d.layers.GaussianSplatLayerView3D")],q);const Wa=q,za=Object.freeze(Object.defineProperty({__proto__:null,GaussianSplatCompositionPassParameters:$e,build:st},Symbol.toStringTag,{value:"Module"})),Fa=Object.freeze(Object.defineProperty({__proto__:null,GaussianSplatDepthCompositionPassParameters:Me,build:rt},Symbol.toStringTag,{value:"Module"})),$a=Object.freeze(Object.defineProperty({__proto__:null,GaussianSplatPassParameters:Fe,build:it},Symbol.toStringTag,{value:"Module"}));export{Wa as default};
