import { COLLISION_TYPES } from "../game_container/CollisionListener";
import CollisionListener from "../game_container/CollisionListener";

const collisionListener = new CollisionListener;

class GameObject{

    static activeObjects = {}
    static listeners = {}

    rootElement = {};
    rootId = "";
    collisionType = "";

    constructor(element,collisionType) {
        // sets the rootElement of the Game Object, and registers a unique ID
        if(!COLLISION_TYPES[collisionType]){
            throw new Error("Invalid collision type")
        }
        this.rootElement = element
        this.rootId = Math.random().toString(36).slice(2);
        this.collisionType = collisionType;
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

    destroy(){
        // cleanup logic to run if it exists
        if(this.onDestroy){
            this.onDestroy();
        }
        delete GameObject.activeObjects[this.rootId];
        collisionListener.unregisterCollisionObject(this.collisionType,this.rootId);
        this.rootElement.remove();
        console.log("deleting object: ",this.rootId)
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