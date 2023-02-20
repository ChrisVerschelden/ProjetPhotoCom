import './style.css'
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { VirtualImageBoard } from './VitrualImageBoard.js'
import {onKeyDown, onKeyUp} from './controls.js'
import { ctx } from './context.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, root, renderer, renderer2, 
    controls, glbLoader, sound, footsteps_sound, 
    AudioLoader, listener, lastCameraPosition, 
    mixerAnimPlanetes, vib1, vib2, solsys_rotation;

const grp_chris = new THREE.Group();
const grp_lou   = new THREE.Group();
const grp_actif = new THREE.Group();

function init_chris() {
  let position1 = new THREE.Vector3( 0, 0, 0 );
  vib1 = new VirtualImageBoard("./photos/chris/_1090145.png", "12-12-2022", "un titre", "un texte", position1);
  grp_chris.add(vib1.getVIB());
  ctx.boards.push(vib1);

  vib1.move(new THREE.Vector3( 530, 0, -1340 ), 0.94);

  let position2 = new THREE.Vector3( 860, 0, 0 );
  vib2 = new VirtualImageBoard("./photos/chris/_1090145.png", "12-12-2022", "un titre", "un texte", position2);
  grp_chris.add(vib2.getVIB());
  ctx.boards.push(vib2);

  vib2.move(new THREE.Vector3( -780, 0, -20 ), 1.57);
}

function init_lou() {
  let position1 = new THREE.Vector3( 0, 0, 0 );
  vib1 = new VirtualImageBoard("./photos/chris/_1090145.png", "12-12-2022", "un titre", "un texte", position1);
  grp_lou.add(vib1.getVIB());
  ctx.boards.push(vib1);

  vib1.move(new THREE.Vector3( 530, 0, -1340 ), 0.94);
}

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();


const blocker      = document.getElementById( 'blocker' );
const instructions = document.getElementById( 'instructions' );
const card_lou     = document.getElementById( 'profil_lou' );
const card_chris   = document.getElementById( 'profil_chris' );

let color_factor = 0.75


card_lou.addEventListener('click',() => {
  color_factor = 0.35
  init_lou()
  grp_actif.copy(grp_lou)
  start()
})

card_chris.addEventListener('click',() => {
  color_factor = 0.55
  init_chris()
  grp_actif.copy(grp_chris)
  start()
})

//card_chris.click()

function start() {
  init();
  animate();
  controls.lock();
}



function init() {

  glbLoader = new GLTFLoader();

  camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.y = 130;
  camera.position.x = 1150;
  camera.position.z = -1950;

  // create an AudioListener and add it to the camera
  listener = new THREE.AudioListener();
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
  footsteps_sound = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  AudioLoader = new THREE.AudioLoader();
  AudioLoader.load( 'sounds/footstep_SFX.mp3', function( buffer ) {
    footsteps_sound.setBuffer( buffer );
    footsteps_sound.setLoop  ( true   );
    footsteps_sound.setVolume( 3.5    );

    // Create a delay with an echo delay time
    const delay  = new THREE.Delay(3);
    // Add the delay to the audio source
    footsteps_sound.add(delay);

    // create reverb convolver
    // Create a convolver with a reverb impulse response
    const convolver = new THREE.Convolver();
    const impulseResponseUrl = 'sounds/ImpulseResponses/SteinmanHall.wav';

    AudioLoader.load(impulseResponseUrl, impulseBuffer => {
      convolver.buffer = impulseBuffer;
      footsteps_sound.add(convolver);
      // Play the sound
      footsteps_sound.play();
    });

    //footsteps_sound.connect(listener)
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

  // galaxy 

  var loader = new THREE.TextureLoader();
  loader.load('./models/8k_stars_milky_way.jpg', function ( texture ) {
      var geometry = new THREE.SphereGeometry( 7500, 20, 20 );

      var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
      material.side = THREE.BackSide
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(-500, 0, -0)
      scene.add( mesh );
  } );



  //load glb model of expo center
  var expoCENTER = null
  glbLoader.load( './models/scifi-showroom_reduit_epure_sans_pod.glb', function ( gltf )
  {
    expoCENTER = gltf.scene;
    expoCENTER.scale.set(100, 100, 100)
    expoCENTER.position.set(-2100, 800, -0)
    root.add(expoCENTER)
  } ); 


  var solsys = null
  glbLoader.load( './models/solsystem_fuck_lechel.glb', function ( gltf )
  {
    solsys = gltf.scene;
    solsys.scale.set(11, 11, 11)
    solsys.position.set(2250, -530, 0)

    mixerAnimPlanetes = new THREE.AnimationMixer(gltf.scene);
    mixerAnimPlanetes.timeScale = 0.1
    gltf.animations.forEach((o,i) => {
      mixerAnimPlanetes.clipAction(gltf.animations[i]).play();
    })

    root.add(solsys)
    solsys_rotation = solsys;
  } ); 

  //expoCENTER.position.set(0, 100, 0)
  //root.add(expoCENTER)


  /////// photo objects

  root.add(grp_actif);  

  //

  lastCameraPosition = new THREE.Vector3();

  //root.add(board)

  //root.add(PhotoElement(0,0,0,0))

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
    footsteps_sound.play(0);
  } else {
    footsteps_sound.stop();
  }
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

    

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number( ctx.controls.moveForward ) - Number( ctx.controls.moveBackward );
    direction.x = Number( ctx.controls.moveRight ) - Number( ctx.controls.moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( ctx.controls.moveForward || ctx.controls.moveBackward ) velocity.z -= direction.z * 8000.0 * delta;
    if ( ctx.controls.moveLeft || ctx.controls.moveRight ) velocity.x -= direction.x * 8000.0 * delta;

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

  }
  stayInISaid()

  prevTime = time;

  scene.updateMatrixWorld()

  renderer.render( scene, camera );
  renderer2.render( scene, camera );

  requestAnimationFrame( animate );
}