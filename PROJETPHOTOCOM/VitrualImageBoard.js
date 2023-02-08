import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

class VirtualImageBoard {

    constructor(p_image_src, p_date, p_title, p_text, p_position) {
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
    }

    getVIB() {return this.vib;}


    setUnselected() {
        if (this.selected) {
            this.vib.remove(this.edges)
            this.selected = false
        }
        //this.board.material.color.setHex('0x991d65')
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


    //getBoard() {return this.board}

    //getPoster() {return this.poster}

    build_poster() {
        var html = `
            <ul id="Frames">
            <li class="Frame">
                <img class="card-picture" src="${this.image_src}" alt="photo grenouille" />
            </li>
            </ul>
            <div class="card-side">
                <div class="card-date">
                    <time>${this.date}</time>
                </div>
                <div class="card-title">
                    <h2>${this.title}</h2>
                </div>
                <div class="card-text">
                    ${this.text}
                </div>
            </div>
        `;

        //card container
        const div_card  = document.createElement( 'div' );
            div_card.classList.add("card");
            div_card.style.opacity = "1";
            
        div_card.innerHTML = html ;

        const object = new THREE.Object3D
        const obj = new CSS3DObject( div_card );
        object.css3dObject = obj
        object.add(obj)

        object.css3dObject.element.style.opacity = "1"
        object.position.set( 0, 0, 0 )

        const boxGeometry = new THREE.BoxGeometry( 660, 320, 1 ).toNonIndexed();
        const boxMaterial = new THREE.MeshPhongMaterial( { opacity:0.15,color:new THREE.Color( 0x111111 ),blending:THREE.NoBlending, transparent: true} );
        const box = new THREE.Mesh( boxGeometry, boxMaterial );

        box.position.addVectors(this.position, new THREE.Vector3(-this.position.x, 90, 16))
        box.rotation.y = 0;
        box.add(object);
        return box; 
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
    
        var geometry = new THREE.BoxGeometry( 670, 600, 30 );
    
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
    
        var board = new THREE.Mesh( geometry, material );
        board.position.addVectors(this.position, new THREE.Vector3( 0, 100, 0 ))

        return board;
    }
} 


export { VirtualImageBoard }