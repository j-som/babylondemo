
import { Engine, Scene, SceneLoader, Tools } from "@babylonjs/core";
import { getSceneModuleWithName } from "./scenes/createScene";
// import { Extensions } from "babylonjs-editor";


export enum GameState {STOPED = 0, RUNNING = 1, CHANGE_SCENE = 2};
export class Game {
    /**
     * instance
     */
    private static _instance:Game = null;
    public static first_instance():Game {
        if (Game._instance == null){
            Game._instance = new Game();
        }
        return Game._instance;
    }
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _state:GameState = GameState.STOPED;
    private _curScene:Scene;
    constructor() {
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        this._init(canvas, engine);
    }

    public get canvas() : HTMLCanvasElement {
        return this._canvas;
    }

    public get engine() : Engine {
        return this._engine;
    }

    /**
     * changeToScene
     */
    public async changeToScene(moduleName:string) :Promise<boolean> {
        if (this._state == GameState.CHANGE_SCENE){
            return false;
        }
        this._engine.displayLoadingUI();
        this._state = GameState.CHANGE_SCENE;
        const renderScene = this._curScene;
        this._curScene = null;

        const createSceneModule = await getSceneModuleWithName(moduleName);
        await Promise.all(createSceneModule.preTasks || []);
        const scene = await createSceneModule.createScene(this._engine, this._canvas);
        this._engine.hideLoadingUI(); //when the scene is ready, hide loading

        if (renderScene){
            this._releaseScene(renderScene);
        }
        this._curScene = scene;
        this._curScene.attachControl();
        this._state = GameState.RUNNING;
        return true;
    }

    /**
     * loadAndChangeToScene
     */
    public async loadAndChangeToScene(sceneName:string) :Promise<boolean> {
        if (this._state == GameState.CHANGE_SCENE){
            return false;
        }
        this._engine.displayLoadingUI();
        this._state = GameState.CHANGE_SCENE;
        const renderScene = this._curScene;
        this._curScene = null;
        this._engine.displayLoadingUI();
        const scene = await SceneLoader.LoadAsync("assets/scenes/"+sceneName+"/", "scene.babylon", this._engine, (evt) => {});
        this._engine.hideLoadingUI(); //when the scene is ready, hide loading
        // No camera?
        if (!scene.activeCamera) {
            scene.createDefaultCamera(false, true, true);
        }
        // Attach camera
        scene.activeCamera.attachControl(this._canvas, true);
        if (renderScene){
            this._releaseScene(renderScene);
        }
        // Tools.LoadFile("./scene/project.editorproject", (data: string) => {
        //     // Apply extensions (such as custom code, custom materials etc.)
        //     Extensions.RoolUrl = "./scene/";
        //     Extensions.ApplyExtensions(scene, JSON.parse(data));
  
        //     // Run render loop
        //     this.engine.runRenderLoop(() => {
        //       this.scene.render();
        //     });
        //   });

        this._curScene = scene;
        this._curScene.attachControl();
        this._state = GameState.RUNNING;
        return true;
    }
    
    /**
     * init
     */
    private _init(canvas:HTMLCanvasElement, engine:Engine) {
        this._canvas = canvas;
        this._engine = engine;
        const game = this;
        this._engine.runRenderLoop(function () {
            if (game._curScene){
                game._curScene.render();
            }
        })

        window.addEventListener("resize", function () {
            engine.resize();
        });

        // window.addEventListener("keydown", (ev) => {
        //     // Shift+Ctrl+Alt+I
        //     const scene = this._curScene;
        //     if (scene && ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        //         if (scene.debugLayer.isVisible()) {
        //             scene.debugLayer.hide();
        //         } else {
        //             scene.debugLayer.show();
        //         }
        //     }
        // });
    }

    private _releaseScene(scene:Scene):void {
        if (scene != null && !scene.isDisposed){
            scene.dispose();
        }
    }
    
}