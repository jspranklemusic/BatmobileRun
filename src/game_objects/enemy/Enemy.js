import GameObject from "../GameObject"
import { collision_types } from "../../game_container/CollisionListener"

class Enemy extends GameObject{
    xPosition = 0;
    constructor(parent,road){
        const root = document.createElement("div");
        super(root,collision_types.enemy);
        this.road = road;
        parent.appendChild(root);
    }
}

export default Enemy;