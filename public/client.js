import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    AmbientLight,
    PointLight,
    DirectionalLight,
    DirectionalLightHelper,
    LineSegments,
    LineBasicMaterial,
    Matrix4,
    CircleGeometry, PlaneGeometry, Raycaster, DoubleSide,
    Quaternion, Vector3, Euler, MeshPhongMaterial, TextureLoader,
    BufferGeometry, Float32BufferAttribute, AdditiveBlending, Line, RingGeometry, MeshNormalMaterial,
} from 'three';

import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { VRButton } from './jsm/webxr/VRButton.js'
import { OBJLoader } from './jsm/loaders/OBJLoader.js';
import { XRControllerModelFactory } from './jsm/webxr/XRControllerModelFactory.js';
import { BoxLineGeometry } from './jsm/geometries/BoxLineGeometry.js';
import { DecalGeometry } from './jsm/geometries/DecalGeometry.js';
import { MeshSurfaceSampler } from './jsm/math/MeshSurfaceSampler.js';


// ref : https://medium.com/@kl.yap/how-to-add-vr-to-any-three-js-website-709480457deb 
// scale issuez webxr : https://github.com/mrdoob/three.js/issues/13225 
// controls : 

// https://discourse.threejs.org/t/orbitcontrols-stop-working-when-grouping-camera-for-xr/33756/7
// https://threejs.org/examples/?q=vr#webxr_vr_teleport

// NodeJS use both import and require : https://www.kindacode.com/article/node-js-how-to-use-import-and-require-in-the-same-file/?utm_content=cmp-true

let camera, scene, raycaster, renderer, mouseHelper, sampler;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let room, marker, floor, baseReferenceSpace;

let firstTime = true;

let INTERSECTION;
const tempMatrix = new Matrix4();
const orientation = new Euler();
const size = new Vector3( 10, 10, 10 );

const textureLoader = new TextureLoader();


const params = {
        
        minScale: 1,
        maxScale: 2,
        rotate: true,
        clear: function () {
            removeDecals();
        }
};


function toyTraces() {

    sampler = new MeshSurfaceSampler(room.children[0])
        .setWeightAttribute('color')
        .build();

    const _position = new Vector3();

    // Sample randomly from the surface, creating an instance of the sample
    // geometry at each sample point.
    for (let i = 0; i < 10; i++) {

        sampler.sample(_position);

        _position.bumpmap = "bumpmap.png"
        _position.map = "map.png"
        _position.freq = 0.6
        genTrace(_position);

    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Trace constructor 
function genTrace(data) {

    var position = new Vector3(data.x, data.y, data.z);


    orientation.copy(mouseHelper.rotation);


    // Size of trace : 
    const scale = params.minScale + Math.random() * (params.maxScale - params.minScale);
    size.set(scale, scale, scale);

    const material = new MeshPhongMaterial({
        map: textureLoader.load('texture/cv/' + data.map),
        bumpMap: textureLoader.load('texture/cv/' + data.bumpmap),
        //bumpScale: 30,
        opacity: 0.6,
        depthWrite: false,
        alphaTest: 0.05,
        shininess: 25,
        transparent: true,
        depthTest: true,
        side: DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false
    });




    const m = new Mesh(new DecalGeometry(room.children[0], position, orientation, size), material);

    /*
    m.userData.freq = data.freq;
    var endDate = new Date();
    var startDate = new Date(data.day + 'T' + data.hour);
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    m.userData.timeSpent = seconds;

    m.layers.enable(BLOOM_SCENE);
    decals.push(m);

    */
    scene.add(m);

    /*

    var nSound = getRandomInt(1, 3);
    var sound = new THREE.PositionalAudio2(listener, position);
    sound.setDirectionalCone(360, 360, 1.); //( 10, 90, 1. );



    var audioElem = null;


    var checkExist = setInterval(function() {


        if (audioElem = document.getElementById(data.sound)) {


            clearInterval(checkExist);
            audioElem.play();
            sound.setMediaElementSource(audioElem);
            sound.setRefDistance(5);
            m.add(sound);


        }
    }, 100);

    */

}

function loadFlesh(){

        // instantiate a loader
            const loader = new OBJLoader();

            // load a resource
            loader.load(
                // resource URL
                'models/monster.obj',
                // called when resource is loaded
                function ( object ) {

                    scene.add( object );
                    room = object;

                },
                // called when loading is in progresses
                function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                },
                // called when loading has errors
                function ( error ) {

                    console.log( 'An error happened' );

                }
            );

    }


class App {


    init() {


        //camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        //camera.position.z = 4;

        camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
        camera.position.set( 0, 1, 3 );

        scene = new Scene();

        mouseHelper = new Mesh( new BoxGeometry( 1, 1, 10 ), new MeshNormalMaterial() );
        mouseHelper.rotateX( - Math.PI / 2 );
        mouseHelper.visible = false;
        scene.add( mouseHelper );


        // QUE LA LUMIERE SOIT 
        const light = new AmbientLight( 0x404040 ); // soft white light
        scene.add( light );
        const pointLight = new PointLight( 0xff0000, 10, 100 );
        pointLight.position.set( 50, 50, 50 );
        scene.add( pointLight );

        const directionalLight = new DirectionalLight( 0xffffff, 0.5 );
        scene.add( directionalLight );

        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial();

        //const mesh = new Mesh( geometry, material );
        //scene.add( mesh );
/*
        room = new LineSegments(
            new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
        new LineBasicMaterial( { color: 0x808080 } )
        );
        scene.add( room );
*/

        marker = new Mesh(
            new CircleGeometry( 0.25, 32 ).rotateX( - Math.PI / 2 ),
            new MeshBasicMaterial( { color: 0x808080 } )
        );
        scene.add( marker );
/*
        floor = new Mesh(
            new PlaneGeometry( 4.8, 4.8, 2, 2 ).rotateX( - Math.PI / 2 ),
            new MeshBasicMaterial( { color: 0x808080, transparent: true, opacity: 0.25 } )
        );
        scene.add( floor );
*/

        raycaster = new Raycaster();

        

        renderer = new WebGLRenderer( { antialias: true } );
        renderer.xr.enabled = true; // VR
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.xr.addEventListener( 'sessionstart', () => baseReferenceSpace = renderer.xr.getReferenceSpace() );

        document.body.appendChild( renderer.domElement );
        document.body.appendChild(VRButton.createButton(renderer)); // VR

        window.addEventListener( 'resize', onWindowResize, false );

        const controls = new OrbitControls( camera, renderer.domElement );

        // controllers
        function onSelectStart() {

            this.userData.isSelecting = true;

        }

        function onSelectEnd() {

            this.userData.isSelecting = false;

            if (INTERSECTION) {

                const offsetPosition = {
                    x: -INTERSECTION.x,
                    y: -INTERSECTION.y,
                    z: -INTERSECTION.z,
                    w: 1
                };
                const offsetRotation = new Quaternion();
                const transform = new XRRigidTransform(offsetPosition, offsetRotation);
                const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);

                renderer.xr.setReferenceSpace(teleportSpaceOffset);

            }

        }

        controller1 = renderer.xr.getController(0);
        controller1.addEventListener('selectstart', onSelectStart);
        controller1.addEventListener('selectend', onSelectEnd);
        controller1.addEventListener('connected', function(event) {

            this.add(buildController(event.data));

        });
        controller1.addEventListener('disconnected', function() {

            this.remove(this.children[0]);

        });
        scene.add(controller1);

        controller2 = renderer.xr.getController(1);
        controller2.addEventListener('selectstart', onSelectStart);
        controller2.addEventListener('selectend', onSelectEnd);
        controller2.addEventListener('connected', function(event) {

            this.add(buildController(event.data));

        });
        controller2.addEventListener('disconnected', function() {

            this.remove(this.children[0]);

        });
        scene.add(controller2);

        // The XRControllerModelFactory will automatically fetch controller models
        // that match what the user is holding as closely as possible. The models
        // should be attached to the object returned from getControllerGrip in
        // order to match the orientation of the held device.

        const controllerModelFactory = new XRControllerModelFactory();

        controllerGrip1 = renderer.xr.getControllerGrip(0);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        scene.add(controllerGrip1);

        controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        scene.add(controllerGrip2);

        loadFlesh();

        animate();
    } 

}

function buildController(data) {

        console.log("ok")

            let geometry, material;

            switch (data.targetRayMode) {

                case 'tracked-pointer':

                    geometry = new BufferGeometry();
                    geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));
                    geometry.setAttribute('color', new Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

                    material = new LineBasicMaterial({
                        vertexColors: true,
                        blending: AdditiveBlending
                    });

                    return new Line(geometry, material);

                case 'gaze':

                    geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
                    material = new MeshBasicMaterial({
                        opacity: 0.5,
                        transparent: true
                    });
                    return new Mesh(geometry, material);

            }

    }

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
/*
function animate() {

    //requestAnimationFrame( animate );
    renderer.setAnimationLoop(animate);
    renderer.render( scene, camera );

}
*/

function animate() {


    renderer.setAnimationLoop( render );

}

function render() {

    if(room!=undefined && firstTime){
        //console.log("room ok 2");
        //console.log(room.children[0])
        toyTraces();
        firstTime = false;
    }


    INTERSECTION = undefined;

    if (controller1.userData.isSelecting === true) {

        console.log("CONTROL 1 SELECTING")

        tempMatrix.identity().extractRotation(controller1.matrixWorld);

        raycaster.ray.origin.setFromMatrixPosition(controller1.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObjects([room]); // or floor

        if (intersects.length > 0) {

            INTERSECTION = intersects[0].point;

        }

    } else if (controller2.userData.isSelecting === true) {

        console.log("CONTROL 2 SELECTING")

        tempMatrix.identity().extractRotation(controller2.matrixWorld);

        raycaster.ray.origin.setFromMatrixPosition(controller2.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObjects([room]);

        if (intersects.length > 0) {

            INTERSECTION = intersects[0].point;

        }

    }

    if (INTERSECTION) marker.position.copy(INTERSECTION);

    marker.visible = INTERSECTION !== undefined;

    renderer.render(scene, camera);

}

const app = new App();
app.init();

