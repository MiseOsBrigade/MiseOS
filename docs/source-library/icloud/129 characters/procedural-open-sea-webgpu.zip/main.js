import * as THREE from 'three/webgpu';
import {
  abs,
  cameraPosition,
  clamp,
  cos,
  cross,
  distance,
  dot,
  exp,
  float,
  floor,
  fract,
  max,
  mix,
  normalize,
  oneMinus,
  pass,
  positionGeometry,
  positionWorld,
  pow,
  reflect,
  sin,
  smoothstep,
  uniform,
  vec2,
  vec3,
  vec4
} from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TAU = Math.PI * 2;
const GRAVITY = 9.81;
const THREE_VERSION = '0.184.0';

// Exactly five fixed Gerstner components. Sea-state scales the shared amplitude envelope.
const GERSTNER_WAVES = Object.freeze([
  Object.freeze({ direction: [ 0.981, 0.194 ], amplitude: 1.35, wavelength: 42.0, speed: 0.93, steepness: 0.54 }),
  Object.freeze({ direction: [ 0.684, 0.730 ], amplitude: 0.78, wavelength: 24.0, speed: 1.08, steepness: 0.46 }),
  Object.freeze({ direction: [ -0.286, 0.958 ], amplitude: 0.48, wavelength: 13.5, speed: 1.18, steepness: 0.38 }),
  Object.freeze({ direction: [ -0.918, 0.396 ], amplitude: 0.27, wavelength: 7.2, speed: 1.36, steepness: 0.31 }),
  Object.freeze({ direction: [ 0.358, -0.934 ], amplitude: 0.14, wavelength: 3.8, speed: 1.58, steepness: 0.24 })
]);

if ( GERSTNER_WAVES.length !== 5 ) {
  throw new Error( 'The ocean must use exactly five Gerstner waves.' );
}

const dom = {
  viewport: document.querySelector( '#viewport' ),
  hud: document.querySelector( '#hud' ),
  showControls: document.querySelector( '#show-controls' ),
  pauseButton: document.querySelector( '#pause-button' ),
  fps: document.querySelector( '#fps-value' ),
  seaState: document.querySelector( '#sea-state' ),
  seaStateValue: document.querySelector( '#sea-state-value' ),
  timeOfDay: document.querySelector( '#time-of-day' ),
  timeOfDayValue: document.querySelector( '#time-of-day-value' ),
  drift: document.querySelector( '#drift' ),
  driftValue: document.querySelector( '#drift-value' ),
  state: document.querySelector( '#state' ),
  stateTitle: document.querySelector( '#state-title' ),
  stateMessage: document.querySelector( '#state-message' )
};

const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );
const coarsePointer = window.matchMedia( '(pointer: coarse)' ).matches;

const shared = {
  time: uniform( 0 ),
  seaState: uniform( Number( dom.seaState.value ) ),
  timeOfDay: uniform( Number( dom.timeOfDay.value ) / 24 ),
  sunDirection: uniform( new THREE.Vector3( 0.4, 0.7, -0.4 ).normalize() )
};

let renderer;
let renderPipeline;
let camera;
let controls;
let sky;
let ocean;
let animationPaused = false;
let hiddenByPage = document.hidden;
let stoppedByFailure = false;
let simulationTime = 0;
let lastFrameTime = performance.now();
let fpsFrames = 0;
let fpsElapsed = 0;
let displayedFps = 60;
let adaptiveElapsed = 0;
let qualityCooldown = 0;
let currentPixelRatio = 1;
let maxPixelRatio = 1;
let resizeQueued = false;

function setLoading( title, message ) {
  dom.state.hidden = false;
  dom.state.dataset.ready = 'false';
  dom.state.dataset.kind = 'loading';
  dom.state.setAttribute( 'role', 'status' );
  dom.stateTitle.textContent = title;
  dom.stateMessage.textContent = message;
}

function setReady() {
  dom.state.dataset.ready = 'true';
  window.setTimeout( () => {
    dom.state.hidden = true;
  }, 450 );
}

function formatError( error ) {
  if ( error instanceof Error && error.message ) return error.message;
  if ( typeof error === 'string' ) return error;
  return 'The WebGPU renderer could not start on this device.';
}

function showFailure( error ) {
  if ( stoppedByFailure ) return;
  stoppedByFailure = true;

  if ( renderer ) renderer.setAnimationLoop( null );

  dom.state.hidden = false;
  dom.state.dataset.ready = 'false';
  dom.state.dataset.kind = 'failure';
  dom.state.setAttribute( 'role', 'alert' );
  dom.stateTitle.textContent = 'WebGPU unavailable';
  dom.stateMessage.textContent = `${ formatError( error ) } This experience intentionally has no WebGL fallback. Open it from localhost or HTTPS in a browser with WebGPU enabled.`;
}

function chooseOceanSegments() {
  const memory = Number( navigator.deviceMemory || 8 );
  const pixels = window.innerWidth * window.innerHeight;

  if ( coarsePointer || memory <= 4 ) return 192;
  if ( memory <= 8 || pixels > 3_000_000 ) return 256;
  return 320;
}

function computePixelRatioCap() {
  const memory = Number( navigator.deviceMemory || 8 );
  const deviceCap = coarsePointer || memory <= 4 ? 1.25 : memory <= 8 ? 1.5 : 1.8;
  return Math.min( window.devicePixelRatio || 1, deviceCap );
}

function updateSunDirection( hours ) {
  const dayAngle = ( ( hours - 6 ) / 24 ) * TAU;
  const altitude = Math.sin( dayAngle ) * 1.02;
  const azimuth = dayAngle * 0.82 + 0.72;
  const cosAltitude = Math.cos( altitude );

  shared.sunDirection.value.set(
    cosAltitude * Math.cos( azimuth ),
    Math.sin( altitude ),
    cosAltitude * Math.sin( azimuth )
  ).normalize();

  shared.timeOfDay.value = hours / 24;
}

function timeLabel( hours ) {
  const wrapped = ( hours + 24 ) % 24;
  const whole = Math.floor( wrapped );
  const minutes = Math.round( ( wrapped - whole ) * 60 ) % 60;
  return `${ String( whole ).padStart( 2, '0' ) }:${ String( minutes ).padStart( 2, '0' ) }`;
}

function seaStateLabel( value ) {
  if ( value < 0.32 ) return 'Calm';
  if ( value < 0.56 ) return 'Light';
  if ( value < 0.78 ) return 'Moderate';
  return 'Rough';
}

function hashGradient2( point ) {
  const angles = vec2(
    dot( point, vec2( 127.1, 311.7 ) ),
    dot( point, vec2( 269.5, 183.3 ) )
  );

  return normalize( fract( sin( angles ).mul( 43758.5453123 ) ).mul( 2 ).sub( 1 ) );
}

function gradientNoise2( point ) {
  const cell = floor( point );
  const local = fract( point );
  const smooth = local.mul( local ).mul( vec2( 3 ).sub( local.mul( 2 ) ) );

  const n00 = dot( hashGradient2( cell ), local );
  const n10 = dot( hashGradient2( cell.add( vec2( 1, 0 ) ) ), local.sub( vec2( 1, 0 ) ) );
  const n01 = dot( hashGradient2( cell.add( vec2( 0, 1 ) ) ), local.sub( vec2( 0, 1 ) ) );
  const n11 = dot( hashGradient2( cell.add( vec2( 1, 1 ) ) ), local.sub( vec2( 1, 1 ) ) );

  const row0 = mix( n00, n10, smooth.x );
  const row1 = mix( n01, n11, smooth.x );
  return mix( row0, row1, smooth.y ).mul( 0.5 ).add( 0.5 );
}

function fbm4( point ) {
  const octave0 = gradientNoise2( point ).mul( 0.5333333 );
  const octave1 = gradientNoise2( point.mul( 2.03 ).add( vec2( 17.13, 9.21 ) ) ).mul( 0.2666667 );
  const octave2 = gradientNoise2( point.mul( 4.11 ).add( vec2( -4.72, 31.41 ) ) ).mul( 0.1333333 );
  const octave3 = gradientNoise2( point.mul( 8.17 ).add( vec2( 48.13, -11.91 ) ) ).mul( 0.0666667 );
  return octave0.add( octave1 ).add( octave2 ).add( octave3 );
}

function gerstnerSurface( point ) {
  const amplitudeEnvelope = mix( float( 0.32 ), float( 1.18 ), shared.seaState );

  let displacementX = float( 0 );
  let displacementY = float( 0 );
  let height = float( 0 );
  let tangentX = vec3( 1, 0, 0 );
  let tangentY = vec3( 0, 1, 0 );

  for ( const wave of GERSTNER_WAVES ) {
    const direction = vec2( wave.direction[ 0 ], wave.direction[ 1 ] );
    const waveNumber = TAU / wave.wavelength;
    const angularSpeed = Math.sqrt( GRAVITY * waveNumber ) * wave.speed;
    const amplitude = amplitudeEnvelope.mul( wave.amplitude );
    const horizontalAmplitude = amplitude.mul( wave.steepness );
    const phase = dot( point, direction ).mul( waveNumber ).sub( shared.time.mul( angularSpeed ) );
    const sine = sin( phase );
    const cosine = cos( phase );
    const derivativeScale = horizontalAmplitude.mul( waveNumber ).mul( sine );

    displacementX = displacementX.add( direction.x.mul( horizontalAmplitude ).mul( cosine ) );
    displacementY = displacementY.add( direction.y.mul( horizontalAmplitude ).mul( cosine ) );
    height = height.add( amplitude.mul( sine ) );

    tangentX = tangentX.add( vec3(
      direction.x.mul( direction.x ).mul( derivativeScale ).mul( -1 ),
      direction.x.mul( direction.y ).mul( derivativeScale ).mul( -1 ),
      amplitude.mul( waveNumber ).mul( direction.x ).mul( cosine )
    ) );

    tangentY = tangentY.add( vec3(
      direction.x.mul( direction.y ).mul( derivativeScale ).mul( -1 ),
      direction.y.mul( direction.y ).mul( derivativeScale ).mul( -1 ),
      amplitude.mul( waveNumber ).mul( direction.y ).mul( cosine )
    ) );
  }

  return {
    position: vec3( point.x.add( displacementX ), point.y.add( displacementY ), height ),
    localNormal: normalize( cross( tangentX, tangentY ) ),
    height
  };
}

function timePaletteFactors() {
  const dawn = exp( abs( shared.timeOfDay.sub( 0.245 ) ).mul( -34 ) );
  const dusk = exp( abs( shared.timeOfDay.sub( 0.755 ) ).mul( -34 ) );
  const day = smoothstep( 0.19, 0.31, shared.timeOfDay )
    .mul( oneMinus( smoothstep( 0.69, 0.82, shared.timeOfDay ) ) );
  const twilight = clamp( dawn.add( dusk ), 0, 1 );
  const night = oneMinus( clamp( day.add( twilight.mul( 0.62 ) ), 0, 1 ) );

  return { dawn, dusk, day, twilight, night };
}

// One analytic sky graph, called by both the sky dome and the water reflection.
function analyticSky( directionInput ) {
  const direction = normalize( directionInput );
  const palette = timePaletteFactors();
  const up = clamp( direction.y, 0, 1 );
  const vertical = pow( up, 0.38 );

  const zenithNight = vec3( 0.0025, 0.006, 0.018 );
  const horizonNight = vec3( 0.012, 0.022, 0.043 );
  const zenithDay = vec3( 0.035, 0.19, 0.46 );
  const horizonDay = vec3( 0.47, 0.72, 0.88 );
  const zenithTwilight = mix( vec3( 0.075, 0.09, 0.22 ), vec3( 0.11, 0.045, 0.16 ), palette.dusk );
  const horizonTwilight = mix( vec3( 1.18, 0.43, 0.18 ), vec3( 1.28, 0.25, 0.12 ), palette.dusk );

  const zenith = zenithNight
    .mul( palette.night )
    .add( zenithDay.mul( palette.day ) )
    .add( zenithTwilight.mul( palette.twilight ) );

  const horizon = horizonNight
    .mul( palette.night )
    .add( horizonDay.mul( palette.day ) )
    .add( horizonTwilight.mul( palette.twilight ) );

  let skyColor = mix( horizon, zenith, vertical );

  const sunDot = clamp( dot( direction, shared.sunDirection ), 0, 1 );
  const sunVisibility = smoothstep( -0.08, 0.06, shared.sunDirection.y );
  const disk = smoothstep( 0.99945, 0.99992, sunDot ).mul( sunVisibility );
  const halo = exp( sunDot.sub( 1 ).mul( 92 ) ).mul( sunVisibility );
  const warmSun = mix( vec3( 1.0, 0.42, 0.13 ), vec3( 1.0, 0.92, 0.71 ), palette.day );

  skyColor = skyColor
    .add( warmSun.mul( halo ).mul( mix( 0.8, 1.85, palette.twilight ) ) )
    .add( warmSun.mul( disk ).mul( 10.0 ) );

  const projected = direction.xz
    .div( max( abs( direction.y ), 0.12 ) )
    .mul( 0.34 )
    .add( shared.time.mul( vec2( 0.0044, 0.0021 ) ) );
  const cloudNoise = fbm4( projected );
  const cloudBand = smoothstep( 0.01, 0.22, direction.y )
    .mul( oneMinus( smoothstep( 0.72, 0.96, direction.y ) ) );
  const cloudMask = smoothstep( 0.57, 0.72, cloudNoise )
    .mul( cloudBand )
    .mul( clamp( palette.day.add( palette.twilight.mul( 0.75 ) ).add( palette.night.mul( 0.18 ) ), 0, 1 ) );
  const cloudLighting = smoothstep( -0.15, 0.75, dot( direction, shared.sunDirection ) );
  const cloudColor = mix(
    mix( vec3( 0.035, 0.052, 0.072 ), vec3( 0.18, 0.23, 0.28 ), palette.day ),
    mix( vec3( 0.68, 0.32, 0.2 ), vec3( 1.12, 0.82, 0.58 ), palette.day ),
    cloudLighting
  );

  skyColor = mix( skyColor, cloudColor, cloudMask.mul( 0.72 ) );

  const horizonHaze = exp( abs( direction.y ).mul( -26 ) );
  const hazeColor = horizon
    .add( warmSun.mul( exp( sunDot.sub( 1 ).mul( 18 ) ) ).mul( 0.28 ) );

  return mix( skyColor, hazeColor, horizonHaze.mul( 0.46 ) );
}

function createSkyMaterial() {
  const material = new THREE.MeshBasicNodeMaterial();
  const direction = normalize( positionWorld.sub( cameraPosition ) );
  material.fragmentNode = vec4( analyticSky( direction ), 1 );
  material.side = THREE.BackSide;
  material.depthWrite = false;
  material.depthTest = true;
  material.toneMapped = true;
  return material;
}

function createWaterMaterial() {
  const material = new THREE.MeshBasicNodeMaterial();
  const surface = gerstnerSurface( positionGeometry.xy );

  material.positionNode = surface.position;

  // PlaneGeometry is rotated -90° around X: local +Z becomes world +Y.
  const swellNormalWorld = normalize( vec3(
    surface.localNormal.x,
    surface.localNormal.z,
    surface.localNormal.y.mul( -1 )
  ) );

  const capillaryScale = mix( float( 0.18 ), float( 0.46 ), shared.seaState );
  const capillaryPoint = positionWorld.xz
    .mul( capillaryScale )
    .add( shared.time.mul( vec2( 0.095, 0.071 ) ) );
  const epsilon = float( 0.065 );
  const baseNoise = fbm4( capillaryPoint );
  const noiseX = fbm4( capillaryPoint.add( vec2( epsilon, 0 ) ) );
  const noiseZ = fbm4( capillaryPoint.add( vec2( 0, epsilon ) ) );
  const capillaryStrength = mix( float( 0.08 ), float( 0.34 ), shared.seaState );
  const slopeX = noiseX.sub( baseNoise ).div( epsilon ).mul( capillaryStrength );
  const slopeZ = noiseZ.sub( baseNoise ).div( epsilon ).mul( capillaryStrength );
  const normal = normalize( vec3(
    swellNormalWorld.x.sub( slopeX ),
    swellNormalWorld.y,
    swellNormalWorld.z.sub( slopeZ )
  ) );

  const viewDirection = normalize( cameraPosition.sub( positionWorld ) );
  const facing = clamp( dot( normal, viewDirection ), 0, 1 );
  const fresnel = float( 0.018 ).add( oneMinus( facing ).pow( 5 ).mul( 0.982 ) );
  const reflectionDirection = reflect( viewDirection.mul( -1 ), normal );
  const reflectedSky = analyticSky( reflectionDirection );
  const palette = timePaletteFactors();

  const deepNight = vec3( 0.0018, 0.009, 0.018 );
  const deepDay = vec3( 0.004, 0.048, 0.074 );
  const bodyNight = vec3( 0.006, 0.026, 0.039 );
  const bodyDay = vec3( 0.015, 0.16, 0.205 );
  const daylight = clamp( palette.day.add( palette.twilight.mul( 0.42 ) ), 0, 1 );
  const deepWater = mix( deepNight, deepDay, daylight );
  const bodyWater = mix( bodyNight, bodyDay, daylight );
  const opticalDepth = pow( facing, 0.55 );
  let waterColor = mix( deepWater, bodyWater, opticalDepth.mul( 0.52 ) );
  waterColor = mix( waterColor, reflectedSky, clamp( fresnel.mul( 0.92 ), 0, 0.96 ) );

  const crest = smoothstep(
    mix( float( 0.46 ), float( 1.05 ), shared.seaState ),
    mix( float( 0.95 ), float( 1.9 ), shared.seaState ),
    surface.height
  );
  const oppositeSun = smoothstep( 0.05, 0.82, dot( viewDirection.mul( -1 ), shared.sunDirection ) );
  const backlight = crest
    .mul( oneMinus( facing ).pow( 1.7 ) )
    .mul( oppositeSun )
    .mul( smoothstep( -0.04, 0.32, shared.sunDirection.y ) );
  const crestColor = mix( vec3( 0.08, 0.55, 0.55 ), vec3( 1.15, 0.54, 0.18 ), palette.twilight );
  waterColor = waterColor.add( crestColor.mul( backlight ).mul( 1.6 ) );

  const halfVector = normalize( viewDirection.add( shared.sunDirection ) );
  const roughnessExponent = mix( float( 420 ), float( 150 ), shared.seaState );
  const glitterLobe = pow( max( dot( normal, halfVector ), 0 ), roughnessExponent );
  const glitterBreakup = smoothstep( 0.46, 0.76, fbm4(
    positionWorld.xz.mul( 1.15 ).add( shared.time.mul( vec2( -0.19, 0.12 ) ) )
  ) );
  const sunAbove = smoothstep( -0.02, 0.12, shared.sunDirection.y );
  const glitter = glitterLobe.mul( glitterBreakup.mul( 0.75 ).add( 0.25 ) ).mul( sunAbove );
  const glitterColor = mix( vec3( 1.0, 0.46, 0.18 ), vec3( 1.0, 0.94, 0.74 ), palette.day );
  waterColor = waterColor.add( glitterColor.mul( glitter ).mul( 8.0 ) );

  const slope = oneMinus( clamp( swellNormalWorld.y, 0, 1 ) );
  const foamNoise = fbm4( positionWorld.xz.mul( 0.74 ).add( shared.time.mul( vec2( 0.052, -0.041 ) ) ) );
  const foamDriver = slope.mul( 1.05 ).add( crest.mul( 0.44 ) ).add( foamNoise.mul( 0.23 ) );
  const foam = smoothstep( 0.62, 0.88, foamDriver )
    .mul( smoothstep( 0.28, 0.66, shared.seaState ) );
  const foamColor = mix( vec3( 0.22, 0.34, 0.38 ), vec3( 0.82, 0.98, 1.08 ), daylight );
  waterColor = mix( waterColor, foamColor, foam.mul( 0.9 ) );
  waterColor = waterColor.add( foamColor.mul( foam.pow( 3 ) ).mul( 0.55 ) );

  const viewDistance = distance( cameraPosition, positionWorld );
  const distanceHaze = smoothstep( 210, 820, viewDistance );
  const horizonDirection = normalize( vec3( reflectionDirection.x, max( reflectionDirection.y, 0.018 ), reflectionDirection.z ) );
  const horizonColor = analyticSky( horizonDirection );
  waterColor = mix( waterColor, horizonColor, distanceHaze.mul( 0.72 ) );

  material.fragmentNode = vec4( waterColor, 1 );
  material.side = THREE.DoubleSide;
  material.depthWrite = true;
  material.toneMapped = true;
  return material;
}

function createScene() {
  const scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 49, window.innerWidth / window.innerHeight, 0.1, 1300 );
  camera.position.set( 0, 12.5, 43 );

  const skyGeometry = new THREE.SphereGeometry( 940, 48, 24 );
  sky = new THREE.Mesh( skyGeometry, createSkyMaterial() );
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  scene.add( sky );

  const segments = chooseOceanSegments();
  const oceanGeometry = new THREE.PlaneGeometry( 2000, 2000, segments, segments );
  ocean = new THREE.Mesh( oceanGeometry, createWaterMaterial() );
  ocean.rotation.x = -Math.PI * 0.5;
  ocean.frustumCulled = false;
  scene.add( ocean );

  return scene;
}

function configureControls() {
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 2.1, -12 );
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.enablePan = false;
  controls.minDistance = 20;
  controls.maxDistance = 82;
  controls.minPolarAngle = 1.08;
  controls.maxPolarAngle = Math.PI * 0.494;
  controls.autoRotate = !prefersReducedMotion.matches;
  controls.autoRotateSpeed = Number( dom.drift.value ) * 0.48;
  controls.update();

  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute( 'role', 'img' );
  renderer.domElement.setAttribute(
    'aria-label',
    'Interactive procedural open sea. Drag or swipe to orbit, pinch or wheel to zoom, or focus this canvas and use arrow keys.'
  );
  renderer.domElement.addEventListener( 'keydown', onCanvasKeyDown );
}

function onCanvasKeyDown( event ) {
  const allowed = new Set( [ 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '_', ' ' ] );
  if ( !allowed.has( event.key ) ) return;
  event.preventDefault();

  if ( event.key === ' ' ) {
    togglePause();
    return;
  }

  const offset = camera.position.clone().sub( controls.target );
  const spherical = new THREE.Spherical().setFromVector3( offset );

  if ( event.key === 'ArrowLeft' ) spherical.theta += 0.055;
  if ( event.key === 'ArrowRight' ) spherical.theta -= 0.055;
  if ( event.key === 'ArrowUp' ) spherical.phi = Math.max( controls.minPolarAngle, spherical.phi - 0.045 );
  if ( event.key === 'ArrowDown' ) spherical.phi = Math.min( controls.maxPolarAngle, spherical.phi + 0.045 );
  if ( event.key === '+' || event.key === '=' ) spherical.radius = Math.max( controls.minDistance, spherical.radius * 0.92 );
  if ( event.key === '-' || event.key === '_' ) spherical.radius = Math.min( controls.maxDistance, spherical.radius * 1.08 );

  camera.position.copy( new THREE.Vector3().setFromSpherical( spherical ).add( controls.target ) );
  controls.update();
}

function applyRendererSize() {
  if ( !renderer ) return;
  const width = Math.max( 1, window.innerWidth );
  const height = Math.max( 1, window.innerHeight );
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio( currentPixelRatio );
  renderer.setSize( width, height );
}

function queueResize() {
  if ( resizeQueued ) return;
  resizeQueued = true;
  requestAnimationFrame( () => {
    resizeQueued = false;
    maxPixelRatio = computePixelRatioCap();
    currentPixelRatio = Math.min( currentPixelRatio, maxPixelRatio );
    applyRendererSize();
  } );
}

function setAnimationRunningState() {
  if ( !renderer || stoppedByFailure ) return;
  const shouldRun = !animationPaused && !hiddenByPage;
  renderer.setAnimationLoop( shouldRun ? renderFrame : null );

  if ( shouldRun ) lastFrameTime = performance.now();
}

function togglePause() {
  animationPaused = !animationPaused;
  dom.pauseButton.textContent = animationPaused ? 'Resume' : 'Pause';
  dom.pauseButton.setAttribute( 'aria-pressed', String( animationPaused ) );
  setAnimationRunningState();
}

function updateAdaptiveQuality( delta ) {
  adaptiveElapsed += delta;
  qualityCooldown = Math.max( 0, qualityCooldown - delta );

  if ( adaptiveElapsed < 3 || qualityCooldown > 0 ) return;
  adaptiveElapsed = 0;

  let nextRatio = currentPixelRatio;
  if ( displayedFps < 34 && currentPixelRatio > 0.82 ) {
    nextRatio = Math.max( 0.82, currentPixelRatio - 0.12 );
  } else if ( displayedFps > 56 && currentPixelRatio < maxPixelRatio ) {
    nextRatio = Math.min( maxPixelRatio, currentPixelRatio + 0.08 );
  }

  if ( Math.abs( nextRatio - currentPixelRatio ) > 0.01 ) {
    currentPixelRatio = nextRatio;
    applyRendererSize();
    qualityCooldown = 4;
  }
}

function renderFrame( now ) {
  const rawDelta = ( now - lastFrameTime ) / 1000;
  const delta = Math.min( Math.max( rawDelta, 0 ), 0.05 );
  lastFrameTime = now;

  simulationTime += delta * ( prefersReducedMotion.matches ? 0.42 : 1 );
  shared.time.value = simulationTime;

  controls.autoRotate = !prefersReducedMotion.matches && Number( dom.drift.value ) > 0.001;
  controls.autoRotateSpeed = Number( dom.drift.value ) * 0.48;
  controls.update( delta );

  sky.position.copy( camera.position );
  renderPipeline.render();

  fpsFrames += 1;
  fpsElapsed += delta;
  if ( fpsElapsed >= 0.5 ) {
    const instantFps = fpsFrames / fpsElapsed;
    displayedFps = displayedFps * 0.72 + instantFps * 0.28;
    dom.fps.textContent = String( Math.round( displayedFps ) );
    fpsFrames = 0;
    fpsElapsed = 0;
  }

  updateAdaptiveQuality( delta );
}

function bindUI() {
  dom.seaState.addEventListener( 'input', () => {
    const value = Number( dom.seaState.value );
    shared.seaState.value = value;
    dom.seaStateValue.textContent = seaStateLabel( value );
  } );

  dom.timeOfDay.addEventListener( 'input', () => {
    const hours = Number( dom.timeOfDay.value );
    updateSunDirection( hours );
    dom.timeOfDayValue.textContent = timeLabel( hours );
  } );

  dom.drift.addEventListener( 'input', () => {
    const value = Number( dom.drift.value );
    dom.driftValue.textContent = `${ Math.round( value * 100 ) }%`;
  } );

  dom.pauseButton.addEventListener( 'click', togglePause );

  dom.showControls.addEventListener( 'click', () => {
    dom.hud.dataset.collapsed = 'false';
    dom.showControls.dataset.visible = 'false';
    dom.seaState.focus();
  } );

  window.addEventListener( 'keydown', ( event ) => {
    if ( event.key.toLowerCase() !== 'h' || event.target instanceof HTMLInputElement ) return;
    const collapsed = dom.hud.dataset.collapsed === 'true';
    dom.hud.dataset.collapsed = String( !collapsed );
    dom.showControls.dataset.visible = String( !collapsed );
  } );

  document.addEventListener( 'visibilitychange', () => {
    hiddenByPage = document.hidden;
    setAnimationRunningState();
  } );

  window.addEventListener( 'resize', queueResize, { passive: true } );
  window.addEventListener( 'orientationchange', queueResize, { passive: true } );

  prefersReducedMotion.addEventListener( 'change', () => {
    if ( prefersReducedMotion.matches ) {
      dom.drift.value = '0';
      dom.driftValue.textContent = '0%';
    }
  } );
}

async function assertWebGPUAvailable() {
  if ( !window.isSecureContext ) {
    throw new Error( 'WebGPU requires a secure context.' );
  }

  if ( !navigator.gpu ) {
    throw new Error( 'This browser does not expose navigator.gpu.' );
  }

  const adapter = await navigator.gpu.requestAdapter( { powerPreference: 'high-performance' } );
  if ( !adapter ) {
    throw new Error( 'No compatible WebGPU adapter was returned.' );
  }
}

async function bootstrap() {
  setLoading( 'Starting WebGPU', 'Checking the graphics adapter.' );
  await assertWebGPUAvailable();

  bindUI();
  updateSunDirection( Number( dom.timeOfDay.value ) );
  dom.seaStateValue.textContent = seaStateLabel( Number( dom.seaState.value ) );
  dom.timeOfDayValue.textContent = timeLabel( Number( dom.timeOfDay.value ) );
  dom.driftValue.textContent = `${ Math.round( Number( dom.drift.value ) * 100 ) }%`;

  setLoading( 'Building the ocean', 'Creating the dense mesh and TSL shader graph.' );
  const scene = createScene();

  renderer = new THREE.WebGPURenderer( {
    antialias: true,
    alpha: false
  } );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor( 0x06141c, 1 );
  renderer.onError = ( error ) => showFailure( error );
  renderer.onDeviceLost = ( info ) => {
    const reason = info?.message || info?.reason || 'The GPU device was lost.';
    showFailure( new Error( reason ) );
  };

  maxPixelRatio = computePixelRatioCap();
  currentPixelRatio = maxPixelRatio;
  renderer.setPixelRatio( currentPixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  dom.viewport.appendChild( renderer.domElement );

  setLoading( 'Compiling WebGPU shaders', `Initializing Three.js ${ THREE_VERSION } without a fallback backend.` );
  await renderer.init();

  if ( renderer.coordinateSystem !== THREE.WebGPUCoordinateSystem ) {
    renderer.dispose();
    throw new Error( 'Three.js selected a non-WebGPU backend.' );
  }

  configureControls();

  renderPipeline = new THREE.RenderPipeline( renderer );
  const scenePass = pass( scene, camera );
  const sceneColor = scenePass.getTextureNode( 'output' );
  const bloomPass = bloom( sceneColor );
  bloomPass.threshold.value = 0.92;
  bloomPass.strength.value = coarsePointer ? 0.28 : 0.38;
  bloomPass.radius.value = 0.32;
  renderPipeline.outputNode = sceneColor.add( bloomPass );

  await renderer.compileAsync( scene, camera );
  sky.position.copy( camera.position );
  renderPipeline.render();

  setReady();
  setAnimationRunningState();
}

window.addEventListener( 'unhandledrejection', ( event ) => {
  showFailure( event.reason );
} );

window.addEventListener( 'error', ( event ) => {
  if ( event.error ) showFailure( event.error );
} );

window.addEventListener( 'pagehide', () => {
  if ( renderer ) {
    renderer.setAnimationLoop( null );
    renderer.dispose();
  }
} );

bootstrap().catch( showFailure );
