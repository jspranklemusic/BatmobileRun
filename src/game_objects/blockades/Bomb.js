import GameObject from "../GameObject";
import { collision_types } from "../../game_container/CollisionListener";
import { svgSequence } from "./BombSvgSequence";
import bomb1 from '../../images/bomb1.svg'
import explosion_animation from '../../images/explosion.gif'

class Bomb extends GameObject{

    yPosition = 0;
    playerDamage = 75;

    constructor(parent,road,coords,fast) {
        const svg = document.createElement("object");
        const wrapper = document.createElement("div");
        super(wrapper,collision_types.destructible);
        this.fast = fast;
        this.i = 0;
        this.road = road;
        svg.type="image/svg+xml";
        svg.data = bomb1;
        let xPosition = coords ? coords : { left: "0px" }
        this.styleElement(svg,{
            width: "100%",
        })
        this.styleElement(wrapper,{
            width: "7.5rem",
            paddingRight: "-10rem",
            height: "8rem",
            position: "absolute",
            top: "-8rem",
            // background: "green",
            ...xPosition
        })

        wrapper.appendChild(svg);
        parent.appendChild(wrapper);


        this.setAnimationSequence(svg);
        this.moveBomb();
    }
    
    setAnimationSequence(svg){
        let i = 0;
        this.interval = setInterval(()=>{
            if(i >= svgSequence.length){
                i = 0;
            }
            svg.contentDocument.getElementById("smoking-fuse").innerHTML = svgSequence[i];
            i++;
        },100)
    }
    
    onDestroy(){
        return new Promise((resolve)=>{
            clearInterval(this.interval)
            const gifImage = document.createElement("img");
            gifImage.src = explosion_animation;
            this.styleElement(gifImage,{
                width: "100%",
                margin: ""
            })
            this.rootElement.appendChild(gifImage);
            this.rootElement.firstChild.style.display = "none"

            setTimeout(()=>{
                resolve(console.log("deleting object: ",this.rootId));
            },1000)
      
        });
    }

    moveBomb(){
        setInterval(()=>{
            if(this.game.stoppedState) return;
            this.yPosition += this.fast ? this.road.speed/5 : this.road.speed/10;
            this.rootElement.style.transform = `translateY(${this.yPosition}rem)`;
            if(this.rootElement.getBoundingClientRect().top > window.innerHeight){
                this.destroy();
            }
        },30)
    }
}

export default Bomb;