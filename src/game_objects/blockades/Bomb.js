import GameObject from "../GameObject";
import { collision_types } from "../../game_container/CollisionListener";
import { svgSequence } from "./BombSvgSequence";
import bomb1 from '../../images/bomb1.svg'
import explosion_animation from '../../images/explosion.gif'

class Bomb extends GameObject{
    constructor(parent,road) {
        const svg = document.createElement("object");
        const wrapper = document.createElement("div");
        super(wrapper,collision_types.destructible);

        this.i = 0;
        this.road = road;
        svg.type="image/svg+xml";
        svg.data = bomb1;
        this.styleElement(svg,{
            width: "100%"
        })
        this.styleElement(wrapper,{
            width: "10rem",
            height: "8rem",
            position: "absolute",
            top: "0px",
            left: "0px",
        })

        wrapper.appendChild(svg);
        parent.appendChild(wrapper);


        this.setAnimationSequence(svg)
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
            const gifImage = document.createElement("img")
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
}

export default Bomb;