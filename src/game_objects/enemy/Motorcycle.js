import Enemy from "./Enemy";
import motorcycleSvg from "../../images/motorcycle.svg";
import { Game } from "../../game_container/GameContainer";
import "./Motorcycle.css"

const directions = {
    back: "back",
    forward: "forward"
}

class Motorcycle extends Enemy{
    // can either spawn on back direction or forward direction, if regular road map
    xPosition = 2;
    yPosition = 0;
    constructor(parent,road,direction){
        if(!directions[direction]){
            throw new Error("Must either have a back or forward direction.");
        }
        super(parent,road)
        const object = document.createElement("object");
        const headlight = document.createElement("div");
        headlight.classList.add("headlight")
        object.type = "image/svg+xml";
        object.data = motorcycleSvg;
        this.styleElement(object,{
            width: "60px"
        })
        this.rootElement.appendChild(object);
        this.rootElement.appendChild(headlight);
        this.rootElement.classList.add("motorcycle")
        this.styleElement(this.rootElement,{
          top: "-25rem",
          left: "4rem",
          transform: "translateY(0px)"
        })
        if(direction == directions.back){
            this.styleElement(object,{
                transform: "rotateZ(180deg)"
            })
            this.movebackdirection()
        }else{
            this.styleElement(headlight,{
                transform: "rotateZ(180deg)"
            })
        }
    }

    movebackdirection(){
        this.movebackInterval = setInterval(()=>{
            if(this.game.stoppedState) return;
            this.yPosition += this.road.speed + 2;
            this.styleElement(this.rootElement,{
                transform: `translateY(${this.yPosition}px)`
            })
        },30)
    }
    
}

export default Motorcycle;