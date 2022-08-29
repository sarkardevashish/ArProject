// let engine;
let sceneToRender;

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, {});

// const createDefaultEngine = function () {
//     return new BABYLON.Engine(canvas, true, {
//         preserveDrawingBuffer: true,
//         stencil: true,
//     });
// };

const createScene = async () => {
    const scene = new BABYLON.Scene(engine);

    // scene.clearColor = new BABYLON.Color3.Black();

    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.x = 2;
    box.position.y = 1;

    const fish = BABYLON.SceneLoader.ImportMesh(
        "",
        "./assets/",
        "fish.glb",
        scene,
        function (newMeshes) {
            newMeshes[0].scaling = new BABYLON.Vector3(4, 4, 4);
        }
    );

    // // UniversalCamera
    // const camera1 = new BABYLON.FreeCamera(
    //     "freeCamera",
    //     new BABYLON.Vector3(0, 0, -10),
    //     scene
    // );

    // Device Orientation camera
    // Parameters : name, position, scene
    var camera = new BABYLON.DeviceOrientationCamera(
        "DevOr_camera",
        new BABYLON.Vector3(0, 0, -10),
        scene
    );

    // Targets the camera to a particular position
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    // Sets the sensitivity of the camera to movement and rotation
    camera.angularSensibility = 10;
    camera.moveSensibility = 10;

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Arc Camera
    // const alpha = Math.PI / 4;
    // const beta = Math.PI / 3;
    // const radius = 8;
    // const target = BABYLON.Vector3(0, 1, 1);
    // const camera = new BABYLON.ArcRotateCamera(
    //     "Camera",
    //     alpha,
    //     beta,
    //     radius,
    //     target,
    //     scene
    // );

    // // Targets the camera to a particular position. In this case the scene origin
    // camera.setTarget(BABYLON.Vector3.Zero());

    // camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(1, 1, 0)
    );

    const layer = new BABYLON.Layer("layer", null, scene, true);
    BABYLON.VideoTexture.CreateFromWebCam(
        scene,
        (videoTexture) => {
            videoTexture.vScale = -1.0;
            videoTexture.uScale =
                ((canvas.width / canvas.height) *
                    videoTexture.getSize().height) /
                videoTexture.getSize().width;
            layer.texture = videoTexture;
        },
        {
            maxWidth: canvas.width,
            maxHeight: canvas.height,
            facingMode: "environment",
        }
    );

    // GUI
    var advancedTexture =
        BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
    button1.width = "150px";
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(() => {
        alert("you did it!");
    });
    advancedTexture.addControl(button1);

    // const sessionManager = new WebXRSessionManager(scene);
    // const xrCamera = new WebXRCamera("camera", scene, sessionManager);

    // // Initialize XR experience with default experience helper.
    // const xrHelper = await scene.createDefaultXRExperienceAsync({
    //     uiOptions: {
    //         sessionMode: "immersive-ar",
    //         referenceSpaceType: "local-floor",
    //     },
    //     optionalFeatures: true,
    // });
    // if (!xrHelper.baseExperience) {
    //     // XR support is unavailable.
    //     console.log("WebXR support is unavailable");
    // } else {
    //     // XR support is available; proceed.
    //     // const supported = await WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
    //     // if (supported) {
    //     // // xr available, session supported
    //     // const sessionManager = new WebXRSessionManager(scene);
    //     // const xrCamera = new WebXRCamera("freeCamera", scene, sessionManager);
    //     // }

    //     return scene;
    // }
    return scene;
};



// const sceneToRender = createScene();

// engine.runRenderLoop(() => {
//     sceneToRender.render();
// });

// engine = createDefaultEngine();
// if (!engine) {
//     throw "Engine should not be null";
// }

// Create scene.
scene = createScene();
console.log(scene);
scene.then(function (returnedScene) {
    sceneToRender = returnedScene;
});

// Run render loop to render future frames.
engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
    }
});

// Handle browser resize.
window.addEventListener("resize", function () {
    engine.resize();
});
