import GameObject from "../GameObject";
import { COLLISION_TYPES } from "../../game_container/CollisionListener";
import batarang_pic from "../../images/bat-silhouette.png"

// if a batarang collides with any object, or goes out of bounds, the batarang will be destroyed.
// if a batarang collides with a destructible object, the object will also be destroyed
// if a batarang collides with an enemy, the enemy will lose health or be destroyed

class Batarang extends GameObject{

    yPosition = 0

    // to fix: the position of the batarang
    constructor(parent,xPos,yPos){
        const batarang = document.createElement("img");
        const wrapper = document.createElement("div");
        super(wrapper,COLLISION_TYPES.projectile);
        batarang.src = batarang_pic
        batarang.classList.add("batarang")
        this.styleElement(batarang,{
            width: "3rem",
            background: "yellow",
            borderRadius: "50%",
            animation: "spinning 0.6s infinite linear",
            boxShadow: "0px 0px 10px 5px rgba(255,255,0,.25)"
        })
        wrapper.appendChild(batarang)
        this.styleElement(wrapper,{
            position: "absolute",
            top: `${yPos}px`,
            left: `${xPos}px`,
            transition: "0.1s"
        })
        parent.appendChild(wrapper)
        this.shootBatarang();
    }

    shootBatarang(){
        setInterval(()=>{
            if(this.rootElement.getBoundingClientRect().bottom < 0){
                this.destroy();
            }else{
                this.yPosition -= 20;
                this.rootElement.style.transform = `translateY(${this.yPosition}px)`
            }
        },30)
    }
}

export default Batarang;