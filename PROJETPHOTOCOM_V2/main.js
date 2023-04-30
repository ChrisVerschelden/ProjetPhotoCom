import './style.css'
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { VirtualImageBoard } from './VitrualImageBoard.js'
import {onKeyDown, onKeyUp} from './controls.js'
import { ctx } from './context.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { parcours_chris } from './parcours/parcours_chris';
import { parcours_lou }   from './parcours/parcours_lou';

const delay = ms => new Promise(res => setTimeout(res, ms));

let camera, scene, root, renderer, renderer2, 
    controls, glbLoader, sound, footsteps_sound, 
    AudioLoader, listener, lastCameraPosition, 
    mixerAnimPlanetes, solsys_rotation;

// create an AudioListener and add it to the camera
listener = new THREE.AudioListener();

const audios_actif = [];
let grp_actif = new THREE.Group();
grp_actif.name = "grp_actif";

function init_chris() {
  ctx.boards = [];
  let grp_temp = new THREE.Group();
  parcours_chris.boards.forEach((value) => {
    let position = new THREE.Vector3( value.start_pos.x, value.start_pos.y, value.start_pos.z );
    let vib = new VirtualImageBoard("photos/chris/" + value.img, value.date, value.title, value.text, "chris/"+value.audio, listener, position);
    console.log(value.text)
    ctx.boards.push(vib);
    grp_temp.add(vib.getVIB());
    vib.move(new THREE.Vector3( value.move_to.x, value.move_to.y, value.move_to.z ),value.move_to.r);
  })
  grp_actif.copy(grp_temp)
  init_base();
}

function init_lou() {
  ctx.boards = [];
  let grp_temp = new THREE.Group();
  parcours_lou.boards.forEach((value) => {
    let position = new THREE.Vector3( value.start_pos.x, value.start_pos.y, value.start_pos.z );
    let vib = new VirtualImageBoard("photos/louanne/" + value.img, value.date, value.title, value.text, "louanne/"+value.audio, listener, position);
    ctx.boards.push(vib);
    grp_temp.add(vib.getVIB());
    vib.move(new THREE.Vector3( value.move_to.x, value.move_to.y, value.move_to.z ),value.move_to.r);
  })
  grp_actif.copy(grp_temp)
  init_base();
}

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();


const blocker      = document.getElementById( 'blocker' );
const loading      = document.getElementById( 'loadingScreen' )
const instructions = document.getElementById( 'instructions' );
const card_lou     = document.getElementById( 'profil_lou' );
const card_chris   = document.getElementById( 'profil_chris' );


card_lou.addEventListener('click',async () => {
  loading.style.display = 'block';
  init_lou()
  start()
  await delay(10000);
  loading.style.display = 'none';
})

card_chris.addEventListener('click',async () => {
  loading.style.display = 'block';
  init_chris();
  start();
  await delay(10000);
  loading.style.display = 'none';
})

function start() {
  animate();
  controls.lock();
}



function init_base() {

  glbLoader = new GLTFLoader();

  camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.y = 45;
  camera.position.x = 0;
  camera.position.z = 0;


  camera.add( listener );

  // create a global audio source
  sound = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  AudioLoader = new THREE.AudioLoader();
  AudioLoader.load( 'sounds/ambiance.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.5 );
    sound.play();
  });


  // create a global audio source
  //let coucou_louanne = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  // AudioLoader = new THREE.AudioLoader();
  // AudioLoader.load( 'sounds/Narration/global.ogg', function( buffer ) {
  //   coucou_louanne.setBuffer( buffer );
  //   coucou_louanne.setLoop( false );
  //   coucou_louanne.setVolume( 0.5 );
  //   coucou_louanne.play();
  // });

  // create a global audio source
  footsteps_sound = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  AudioLoader = new THREE.AudioLoader();
  AudioLoader.load( 'sounds/footstep_SFX.mp3', function( buffer ) {
    footsteps_sound.setBuffer( buffer );
    footsteps_sound.setLoop  ( true   );
    footsteps_sound.setVolume( 3.5    );
    footsteps_sound.play();
  });

  scene = new THREE.Scene();

  root = new THREE.Object3D()
  root.position.y = 20
  root.rotation.y = Math.PI / 3
  scene.add(root)

  const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );

  const light1 = new THREE.AmbientLight( 0x404040 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light1 );

  root.add( light );
  root.add( light1 );

  controls = new PointerLockControls( camera, document.body );

  
  controls.addEventListener( 'lock', () => {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  } );

  controls.addEventListener( 'unlock', () => {
    //window.location.reload();
  } );

  scene.add( controls.getObject() );

  document.addEventListener( 'keydown', e => onKeyDown(e) );
  document.addEventListener( 'keyup', e => onKeyUp(e) );

  scene.background = new THREE.Color( "#101010" );

  //load glb model of expo center
  var expoCENTER = null
  //glbLoader.load( './models/scifi-showroom_reduit_epure_sans_pod.glb', function ( gltf )
  glbLoader.load( 'models/photoGalleryV2.glb', function ( gltf )
  {
    expoCENTER = gltf.scene;
    expoCENTER.scale.set(10, 10, 10)
    expoCENTER.position.set(0, 0, 0)
    root.add(expoCENTER)
  } ); 

  var solsys = null
  glbLoader.load( 'models/solsystem_fuck_lechel.glb', function ( gltf )
  {
    solsys = gltf.scene;
    solsys.scale.set(11, 11, 11)
    solsys.position.set(2250, -530, 0)

    mixerAnimPlanetes = new THREE.AnimationMixer(gltf.scene);
    mixerAnimPlanetes.timeScale = 0.1
    gltf.animations.forEach((o,i) => {
      mixerAnimPlanetes.clipAction(gltf.animations[i]).play();
    })

    //root.add(solsys)
    solsys_rotation = solsys;
  } ); 

  //

  root.add(grp_actif); 

  lastCameraPosition = new THREE.Vector3();

  renderer2 = new CSS3DRenderer();
  renderer2.domElement.style.position = 'absolute';
  renderer2.domElement.style.top = 0;
  renderer2.setSize( window.innerWidth, window.innerHeight );
  document.querySelector('#css').appendChild( renderer2.domElement );

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  document.querySelector('#webgl').appendChild( renderer.domElement );

  //
  window.addEventListener( 'resize', onWindowResize );

}

function checkCameraMovement() {
  if (camera.position.distanceTo(lastCameraPosition) > 0.01) {
    if (!footsteps_sound.isPlaying) footsteps_sound.play(0);
  } else {
    footsteps_sound.stop();
  }

  ctx.boards.forEach((value, index, array) => {
    value.check_for_audio_playback(camera);
  })

  lastCameraPosition.copy(camera.position);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer2.setSize( window.innerWidth, window.innerHeight );
}

function stayInISaid() {
  let center_of_exhibition = new THREE.Vector3(1150, 130, -1950)
  
  if (camera.position.distanceTo(center_of_exhibition) > 2400)
    camera.position.copy(center_of_exhibition)
}

const clock = new THREE.Clock()

function animate() {
  if ( ctx.editMode ) {
    ctx.boards.forEach((board) => { 
      board.setUnselected(); 
      console.log(board.printTransformations());
    })
    ctx.boards[ctx.selectedBoard].setSelected();
  }

  if (mixerAnimPlanetes) { mixerAnimPlanetes.update(clock.getDelta()); }

  if (solsys_rotation)   { solsys_rotation.rotateY(0.001) }

  checkCameraMovement();

  // console.log("camera :")
  // console.log(camera.position.x); 
  // console.log(camera.position.z); 

  const time = performance.now();

  if ( controls.isLocked === true ) {
    const delta = Math.min(1, ( time - prevTime ) / 1000);

    

    velocity.x -= velocity.x * 5.0 * delta;
    velocity.z -= velocity.z * 5.0 * delta;

    direction.z = Number( ctx.controls.moveForward ) - Number( ctx.controls.moveBackward );
    direction.x = Number( ctx.controls.moveRight ) - Number( ctx.controls.moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( ctx.controls.moveForward || ctx.controls.moveBackward ) velocity.z -= direction.z * 300.0 * delta;
    if ( ctx.controls.moveLeft || ctx.controls.moveRight ) velocity.x -= direction.x * 300.0 * delta;

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

  }
  //stayInISaid()

  prevTime = time;

  scene.updateMatrixWorld()

  renderer.render( scene, camera );
  renderer2.render( scene, camera );

  requestAnimationFrame( animate );
}