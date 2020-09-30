import { Engine, Scene } from "@babylonjs/core";

export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>;
    preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
    default: CreateSceneClass;
}

export const getSceneModuleWithName = (
    name:string
): Promise<CreateSceneClass> => {
        return import('./' + name).then((module: CreateSceneModule) => {
            return module.default;
        });
    };


