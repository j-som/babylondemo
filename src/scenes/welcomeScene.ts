import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Mesh } from "@babylonjs/core";

import {CreateSceneClass} from "./createScene";

export class WelcomeScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 });
        // var sphere1: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 });
        // sphere1.position.x = 4;
        // sphere.addChild(sphere1);
        scene.addMesh(sphere);
        return scene;
    }
}

export default new WelcomeScene();