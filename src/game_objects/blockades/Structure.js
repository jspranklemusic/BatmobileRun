import GameObject from "../GameObject"
import bricks from '../../images/bricks.svg'
import smoke_animation from '../../images/smoke.gif'
import { BricksSvgSequence } from "./BricksSvgSequence"
import { collision_types } from "../../game_container/CollisionListener";

class Structure extends GameObject{

    xPosition = 0;
    yPosition = 0;
    scale = 1;

    constructor(parent,road, dimensions, coords){
        const root = document.createElement("div");
        super(root,collision_types.indestructible);

        let sizeDimensions ={ width: "40rem", height: "8rem", ...dimensions };
        let xPosition = coords ? coords : { right: "0px" }
        this.styleElement(root,{
            top: "-" + sizeDimensions.height,
            position: "absolute",
            background: "radial-gradient(rgb(175,175,175),rgb(150,150,150))",
            borderRadius: "5px",
            border: "5px solid rgb(80,80,80)",
            boxSizing: "border-box",
            ...sizeDimensions,
            ...xPosition
        })

        parent.appendChild(root);
        this.moveStructure(road);

    }

    moveStructure(road){
        setInterval(()=>{
            if(this.game.stoppedState) return;
            this.yPosition += road.speed;
            this.rootElement.style.transform = `translateY(${this.yPosition/10}rem)`
        },30)
    }
}

export default Structure;