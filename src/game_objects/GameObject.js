import { collision_types } from "../game_container/CollisionListener";
import CollisionListener from "../game_container/CollisionListener";
import { Game } from "../game_container/GameContainer";
import Emitter from "../game_container/Emitter";

const collisionListener = new CollisionListener;

class GameObject extends Emitter{

    static activeObjects = {}

    rootElement = {};
    rootId = "";
    collision_type = "";

    constructor(element,collision_type) {
        super();
        // sets the rootElement of the Game Object, and registers a unique ID
        if(!collision_types[collision_type]){
            throw new Error("Invalid collision type")
        }
        this.rootElement = element
        this.rootId = Math.random().toString(36).slice(2);
        this.collision_type = collision_type;
        this.game = Game;
        GameObject.activeObjects[this.rootId] = this;
        collisionListener.registerCollisionObject(this);
    }
    
    appendChild(element){
        this.rootElement.appendChild(element)
    }

    styleElement(elem,style){
        for(let key in style){
            elem.style[key] = style[key]
        }
    }

    onDestroy(){
        return new Promise((resolve)=>{
            resolve(console.log("deleting object: ",this.rootId));
        });
    }

    moveLoop(){
        const loop = ()=>{
            return requestAnimationFrame(()=>{
                if(this.game.stoppedState) return loop();
                this.yPosition += this.road.speed/2;
                this.styleElement(this.rootElement,{
                    transform: `translateY(${this.yPosition}px)`
                })
                loop();
            })
        }
        loop();
    }

    async destroy(){
        // first, stop the collisions
        collisionListener.unregisterCollisionObject(this.collision_type,this.rootId);
        // cleanup logic to run
        await this.onDestroy();
        
        delete GameObject.activeObjects[this.rootId];
        this.rootElement.remove();
    }

    static getGameObject(id){
        return GameObject.activeObjects[id]
    }

    static reset(){
        // destroy all other objects first
        for(let i in GameObject.activeObjects){
            const obj = GameObject.activeObjects[i]
            if(obj.name != "Road"){
                obj.destroy();
                GameObject.activeObjects[i] = undefined;
                delete GameObject.activeObjects[i];
            }
        }
        // then destroy road
        for(let i in GameObject.activeObjects){
            GameObject.activeObjects[i].destroy();
            GameObject.activeObjects[i] = undefined;
            delete GameObject.activeObjects[i];
        }

       GameObject.purgeObject(GameObject.activeObjects);
       GameObject.purgeObject(GameObject.emitters);
       GameObject.purgeObject(GameObject.listeners);

    
    }

    static unregisterEvent(id,index){
        GameObject.emitters[id][index] = ()=>{};
    }
}

export default GameObject;