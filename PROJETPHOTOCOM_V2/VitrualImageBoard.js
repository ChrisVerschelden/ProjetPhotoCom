import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

class VirtualImageBoard {

    constructor(p_image_src, p_date, p_title, p_text, p_audio, p_audio_listener, p_position) {
        this.AudioListenner = p_audio_listener;
        this.image_src = p_image_src;
        this.date = p_date;
        this.title = p_title;
        this.text = p_text;
        this.position = p_position;
        this.countmove = new THREE.Vector3(0,0,0)
        this.countrotation = 0
        this.selected = false;
        this.poster = this.build_poster();
        this.board  = this.build_board(); 
        this.edges  = this.build_edges();
        this.vib    = this.board.add(this.poster);
        this.center = null;
        this.audio  = null;
        this.setAudio(p_audio)
        console.log(p_audio)
    }

    getVIB() {return this.vib;}

    getCenter(){
        if (this.center != null) return this.center

        let middle = new THREE.Vector3();
        let geometry = this.board;

        geometry.computeBoundingBox();
        geometry.boundingBox.getSize(middle);

        middle.x = middle.x / 2;
        middle.y = middle.y / 2;
        middle.z = middle.z / 2;

        mesh.localToWorld(middle);
        this.center = middle;
        return middle;
    }

    setUnselected() {
        if (this.selected) {
            this.vib.remove(this.edges)
            this.selected = false
        }
    }

    setSelected() {
        this.vib.add(this.edges)
        this.selected = true
    }

    move(vector, rotation) {
        this.vib.position.addVectors(this.vib.position, vector)
        this.vib.rotateY( rotation );
        this.countmove = new THREE.Vector3().addVectors(this.countmove, vector);
        this.countrotation += rotation;
    }

    printTransformations() {
        console.log("vector :")
        console.log(this.countmove.toArray())
        console.log("rotation :")
        console.log(this.countrotation)
    }

    build_poster() {
        var html = `<div>${this.text}</div>`;
        
        //card container
        const div_card  = document.createElement( 'div' );
            div_card.classList.add("card");
            //div_card.style.opacity = "1";
            
        div_card.innerHTML = html ;

        const object = new THREE.Object3D
        const obj = new CSS3DObject( div_card );
        object.css3dObject = obj
        object.add(obj)

        object.css3dObject.element.style.opacity = "1"
        object.position.set( 0, 0, 0 )

        const boxGeometry = new THREE.BoxGeometry( 500 / 18 - 1, 6.5, 0.5 ).toNonIndexed();
        const boxMaterial = new THREE.MeshPhongMaterial( { opacity: 0,color:new THREE.Color( 0x111111 ),blending:THREE.NoBlending, transparent: true} );
        const box = new THREE.Mesh( boxGeometry, boxMaterial );

        box.position.addVectors(this.position, new THREE.Vector3(0, -13.5, 0))
        box.rotation.y = 0;
        box.add(object);
        return box;
        
        //boxGeometry.add(object);
        //return BoxGeometry; 

        
        /*
        // convert the string to dome elements
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var div = wrapper.firstChild;

        // set some values on the div to style it.
        // normally you do this directly in HTML and 
        // CSS files.
        div.style.width = '500px';
        div.style.height = '50px';
        div.style.opacity = 0.7;
        div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

        // create a CSS3Dobject and return it.
        var object = new CSS3DObject(div);
        return object;*/
    }

    build_edges() {
        //let geometry = new THREE.BoxGeometry( 670, 600, 30 );
        let edges = new THREE.EdgesGeometry( this.board.geometry );
        let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffff00 } ) );
        return line;
    }

    build_board() {
            var material = new THREE.MeshPhongMaterial({
            color: 0x991d65,
            emissive: 0x000000,
            specular: 0x111111,
            side: THREE.DoubleSide,
            flatShading: false,
            shininess: 0,
            vertexColors: true,
        })
    
        var geometry = new THREE.BoxGeometry( 500 / 18 , 376 / 18 , 1 );
    
        // give the geometry custom colors for each vertex {{
        geometry = geometry.toNonIndexed(); // ensure each face has unique vertices
    
        var position = geometry.attributes.position;
        var colors = [];
        var color = new THREE.Color
    
        for ( var i = 0, l = position.count; i < l; i ++ ) {
            color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.15 + 0.85 );
            colors.push( color.r, color.g, color.b );
        }
    
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // }}
        const loader = new THREE.TextureLoader()
        material = new THREE.MeshLambertMaterial({
            map: loader.load(this.image_src)
        });
    
        var board = new THREE.Mesh( geometry, material );
        board.position.addVectors(this.position, new THREE.Vector3( 0, 35.5, 0 ))

        return board;
    }

    setAudio(p_audio) {
        // load a sound and set it as the Audio object's buffer
        let audiotmp = new THREE.Audio( this.AudioListenner );
        let AudioLoader = new THREE.AudioLoader();
        AudioLoader.load( 'sounds/Narration/'+p_audio, function( buffer ) {
            audiotmp.setBuffer( buffer );
            audiotmp.setLoop( false );
            audiotmp.setVolume( 3.5 );
            audiotmp
        });
        this.audio = audiotmp;
    }

    check_for_audio_playback(camera) {
        if (this.audio == null) return

        
        if (camera.position.distanceTo(this.board.position) < 100) {
            //if (!this.audio.isPlaying) this.audio.play(0);
        } else {
            //if (this.audio.isPlaying) this.audio.stop();
        }
    }
} 


export { VirtualImageBoard }