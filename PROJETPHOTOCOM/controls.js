import {ctx} from './context.js'
import * as THREE from 'three'

export function onKeyDown( event ) {

    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
            ctx.controls.moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            ctx.controls.moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            ctx.controls.moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            ctx.controls.moveRight = true;
            break;

        case 'Backquote':
            ctx.editMode = !ctx.editMode;
            break;

        case 'NumpadAdd':
            ctx.selectedBoard += 1;
            if (ctx.selectedBoard >= ctx.boards.length) ctx.selectedBoard = 0
            break;

        case 'NumpadSubtract':
            ctx.selectedBoard -= 1;
            if (ctx.selectedBoard < 0 ) ctx.selectedBoard = ctx.boards.length-1
            break;

        case 'Numpad8':
            ctx.boards[ctx.selectedBoard].move( new THREE.Vector3( 10, 0, 0 ),  0 )
            break;

        case 'Numpad2':
            ctx.boards[ctx.selectedBoard].move( new THREE.Vector3( -10, 0, 0 ), 0 )
            break;

        case 'Numpad6':
            ctx.boards[ctx.selectedBoard].move( new THREE.Vector3( 0, 0, 10 ),  0 )
            break;

        case 'Numpad4':
            ctx.boards[ctx.selectedBoard].move( new THREE.Vector3( 0, 0, -10 ), 0 )
            break;

        case 'Numpad3':
            ctx.boards[ctx.selectedBoard].move( new THREE.Vector3( 0, 0, 0 ), 0.01 )
            break;

        case 'Numpad1':
            ctx.boards[ctx.selectedBoard].move( new THREE.Vector3( 0, 0, 0 ), -0.01 )
            break;

        default:
            console.log(event.code);
            break;

        }

    };

export function onKeyUp( event ) {

    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
            ctx.controls.moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            ctx.controls.moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            ctx.controls.moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            ctx.controls.moveRight = false;
            break;

    }

};