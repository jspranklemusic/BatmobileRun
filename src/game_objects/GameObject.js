import { collision_types } from "../game_container/CollisionListener";
import CollisionListener from "../game_container/CollisionListener";

const collisionListener = new CollisionListener;

class GameObject{

    static activeObjects = {}
    static listeners = {}

    rootElement = {};
    rootId = "";
    collision_type = "";

    constructor(element,collision_type) {
        // sets the rootElement of the Game Object, and registers a unique ID
        if(!collision_types[collision_type]){
            throw new Error("Invalid collision type")
        }
        this.rootElement = element
        this.rootId = Math.random().toString(36).slice(2);
        this.collision_type = collision_type;
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

    async destroy(){
        // first, stop the collisions
        collisionListener.unregisterCollisionObject(this.collision_type,this.rootId);
        // cleanup logic to run
        await this.onDestroy();
        
        delete GameObject.activeObjects[this.rootId];
        this.rootElement.remove();
        delete this;
    }

    static doListenerActions(type,e){
        this.listeners[type].forEach(func=>{
            func(e)
        })
    }

    static listen(type,func){
        if(!this.listeners[type]){
            this.listeners[type] = []
            document.addEventListener(type,e=>{
                this.doListenerActions(type,e)
            })
        }
        this.listeners[type].push(func)
    }

    static getGameObject(id){
        return GameObject.activeObjects[id]
    }
}

export default GameObject;