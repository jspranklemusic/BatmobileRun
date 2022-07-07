import { collision_types, pointTypes } from "../../game_container/CollisionListener";
import GameObject from "../GameObject";

 
class AchievementPoint extends GameObject{
    yPosition = 0;
    height = 2;
    width = 60;
    constructor(parent, road, pointType, coords){
        if(!pointType | !pointTypes[pointType]){
            throw new Error("Invalid point type.");
        }
        const root = document.createElement("div");
        super(root,collision_types.achievement_point);
        this.pointType = pointType;
        this.road = road;
        if(pointType === pointTypes.finish_line){
            this.styleElement(root,{
                width: `${this.width}rem`,
                height: `${this.height}rem`,
                background: `
                    repeating-linear-gradient(
                    130deg,
                    black 0%,
                    black 7.5px,
                    #C7A224 7.5px,
                    #C7A224 15px,
                    black 15px,
                    black 22.5px,
                    #C7A224 22.5px,
                    #C7A224 30px)
                `,
                borderTop: "2px solid rgb(20,20,20)",
                borderBottom: "2px solid rgb(20,20,20)",
                position: "absolute",
                top: `-${this.height}rem`,
                left: `0px`,
                ...coords
            })
        }

        this.moveLines();
        parent.appendChild(root);
    }

    moveLines(){
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
}

export default AchievementPoint;

