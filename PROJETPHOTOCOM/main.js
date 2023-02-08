import './style.css'
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { VirtualImageBoard } from './VitrualImageBoard.js'
import {onKeyDown, onKeyUp} from './controls.js'
import { ctx } from './context.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, root, renderer, renderer2, controls, glbLoader;
let vib1, vib2;
const objects = [];

let raycaster;


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
  start()
})

card_chris.addEventListener('click',() => {
  color_factor = 0.55
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

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  //scene.fog = new THREE.Fog( 0xffffff, 0, 1750 );

  root = new THREE.Object3D()
  root.position.y = 20
  root.rotation.y = Math.PI / 3
  scene.add(root)

  const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );

  root.add( light );

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

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );


  //load glb model of expo center
  var expoCENTER = null
  glbLoader.load( './models/scifi-showroom_reduit.glb', function ( gltf )
  {
    expoCENTER = gltf.scene;
    expoCENTER.scale.set(100, 100, 100)
    expoCENTER.position.set(-2050, 800, -0)
    root.add(expoCENTER)
  } ); 


  /////// photo objects

  let position1 = new THREE.Vector3( 0, 0, 0 );
  vib1 = new VirtualImageBoard("./photos/chris/_1090145.png", "12-12-2022", "un titre", "un texte", position1);
  root.add(vib1.getVIB());
  ctx.boards.push(vib1);

  //vib1.move(new THREE.Vector3( 0, 0, 0 ), 1)
  vib1.move(new THREE.Vector3( 530, 0, -1340 ), 0.94)

  let position2 = new THREE.Vector3( 860, 0, 0 );
  vib2 = new VirtualImageBoard("./photos/chris/_1090145.png", "12-12-2022", "un titre", "un texte", position2);
  root.add(vib2.getVIB());
  ctx.boards.push(vib2);

  vib2.move(new THREE.Vector3( -780, 0, -20 ), 1.57)

  //

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

function animate() {
  if ( ctx.editMode ) {
    ctx.boards.forEach((board) => { board.setUnselected(); })
    ctx.boards[ctx.selectedBoard].setSelected();
  }

  ctx.boards.forEach((board) => { 
    console.log(board.printTransformations())
  })

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