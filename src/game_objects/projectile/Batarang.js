import GameObject from "../GameObject";
import { collision_types } from "../../game_container/CollisionListener";
import batarang_pic from "../../images/bat-silhouette.png"

// if a batarang collides with any object, or goes out of bounds, the batarang will be destroyed.
// if a batarang collides with a destructible object, the object will also be destroyed
// if a batarang collides with an enemy, the enemy will lose health or be destroyed

class Batarang extends GameObject{

    static capacity = 0;
    static maxCapacity = 10;
    static shooting = false;
    yPosition = 0
    shootInterval = null;


    // to fix: the batarang can shoot crazy crap ton full auto with unlimited ammo
    constructor(parent,xPos,yPos){
        if(Batarang.shooting | !Batarang.capacity){
            return undefined;
        }
        const batarang = document.createElement("img");
        const wrapper = document.createElement("div");
        super(wrapper,collision_types.projectile);
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
        })
        parent.appendChild(wrapper)
        this.shootBatarang();
    }

    onDestroy(){
        return new Promise((resolve)=>{
            Batarang.shooting = false;
            resolve(console.log("deleting object: ",this.rootId));
        });
    }

    shootBatarang(){
        if(this.game.stoppedState) return;
        if(!this.shootInterval && !Batarang.shooting && Batarang.capacity > 0){
            Batarang.shooting = true;
            Batarang.capacity -= 1;
            window.changeAmmo(-1);
            window.debug({batarangs: Batarang.capacity});
            this.shootInterval = 1;
            const loop = ()=>{
                if(!this.shootInterval){
                    return;
                }
                return requestAnimationFrame(()=>{
                    if(this.game.stoppedState) return loop();
                    const rect = this.rootElement.getBoundingClientRect();
                    if(rect.bottom < 0){
                        this.shootInterval = null;
                        Batarang.shooting = false;
                        this.destroy();
                        window.clearDebug("batarang_position");
                    }else{
                        this.yPosition -= 10;
                        this.rootElement.style.transform = `translateY(${this.yPosition}px)`
                        window.debug({batarang_position: rect.top})
                    }
                    loop();
                })
            }
            loop();
        }
    }

    static addAmmo(count){
        if(Batarang.capacity == Batarang.maxCapacity) return;
        Batarang.capacity += count;
        if(Batarang.capacity > Batarang.maxCapacity){
            Batarang.capacity = Batarang.maxCapacity
        }
        window.debug({batarangs: Batarang.capacity})
    }
}

export default Batarang;