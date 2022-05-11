import GameObject from "../GameObject"
import bricks from '../../images/bricks.svg'
import smoke_animation from '../../images/smoke.gif'
import { BricksSvgSequence } from "./BricksSvgSequence"
import { collision_types } from "../../game_container/CollisionListener";

class Bricks extends GameObject{

    xPosition = 0;
    yPosition = 0;
    scale = 1;
    playerDamage = 25;
    static width = 10

    constructor(parent,road,coords){
        const svg = document.createElement("object");
        const wrapper = document.createElement("div")
        wrapper.classList.add("brick")
        super(wrapper,collision_types.destructible);
        this.road = road
        svg.type="image/svg+xml"
        svg.data = bricks

        let xPosition = coords ? coords : {left: "0px"}
        
        this.styleElement(svg,{
            transform: "scale(13%)",
            transformOrigin: "top left",
        })
        this.styleElement(wrapper,{
            width: `${Bricks.width}rem`,
            height: "8rem",
            position: "absolute",
            top: "-8rem",
            ...xPosition
        })
        this.brick = wrapper;
        wrapper.appendChild(svg);
        parent.appendChild(wrapper);
        this.moveBrick();
    }


    onDestroy(){
        return new Promise((resolve)=>{
            const gifImage = document.createElement("img")
            gifImage.src = smoke_animation;
            this.styleElement(gifImage,{
                width: "100%",
                position: "absolute",
                top: "0px",
                left: "0px",

            })
            this.styleElement(gifImage,{
                opacity: 0.7
            })
            this.rootElement.appendChild(gifImage);
            this.scale = 1.1
            this.styleElement(this.rootElement.firstChild,{
                transition: "0.5s",
                borderRadius: "50%",
            })
           
            this.scale = 1.2;
            // this.rootElement.firstChild.data = bricksBreak1;
            const time = 75;
            let i = 0;
            const interval = setInterval(()=>{
                if(i >= BricksSvgSequence.length){
                    clearInterval(interval);
                }
                const contentDocument = this.rootElement.firstChild.contentDocument;
                if(contentDocument){
                    contentDocument.getElementById("Layer_1").innerHTML = BricksSvgSequence[i];
                    i++;
                }
    
            },time)
            setTimeout(()=>{
                clearInterval(interval)
                return resolve(console.log("deleting object: ",this.rootId));
            },500)
        });
    }

    
    moveBrick(){
        setInterval(()=>{
            if(this.game.paused) return;
            this.yPosition += this.road.speed
            this.brick.style.transform = `translateY(${this.yPosition/10}rem) scale(${this.scale})`
            if(this.rootElement.getBoundingClientRect().top > window.innerHeight){
                this.destroy();
            }
        },30)
    }
}

export default Bricks