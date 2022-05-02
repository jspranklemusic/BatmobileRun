import GameObject from "../GameObject"
import bricks from '../../images/bricks.svg'
import { COLLISION_TYPES } from "../../game_container/CollisionListener";

class Bricks extends GameObject{

    xPosition = 0;
    yPosition = 0;

    constructor(parent,road){
        const svg = document.createElement("object");
        const wrapper = document.createElement("div")
        wrapper.classList.add("brick")
        super(wrapper,COLLISION_TYPES.destructible);
        this.road = road
        svg.type="image/svg+xml"
        svg.data = bricks
        this.styleElement(svg,{
            transform: "scale(13%)",
            transformOrigin: "top left",
            boxShadow: "15px 15px 50px black",
            background: "rgba(255,255,255,0.5)",
        })
        this.styleElement(wrapper,{
            width: "10rem",
            height: "8rem",
            position: "absolute",
            top: "0px",
            left: "0px"
        })
        this.brick = wrapper;
        wrapper.appendChild(svg);
        parent.appendChild(wrapper);
        this.moveBrick();
    }

    initialize(){

    }

    
    moveBrick(){
        setInterval(()=>{
            this.yPosition += this.road.speed
            this.brick.style.transform = `translateY(${this.yPosition/10}rem)`
            if(this.rootElement.getBoundingClientRect().top > window.innerHeight){
                this.destroy();
            }
        },30)
    }
}

export default Bricks