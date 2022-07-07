import GameObject from "../GameObject";
import { collision_types } from "../../game_container/CollisionListener";
import batarang_pic from '../../images/bat-silhouette.png'
import Batarang from "../projectile/Batarang";
// adding ammo boost. It just adds more ammo lol
class Ammo extends GameObject{

    top = 0;
    xPosition = 0;
    moveInterval = null;


    constructor(parent,road,capacity=10,position){
        const element = document.createElement("div");
        super(element,collision_types.powerup);
        const img = document.createElement('img')
        img.src = batarang_pic;
        element.appendChild(img);

        this.styleElement(img,{
            width:"100%",
            background: "yellow",
            borderRadius: "50%",
            boxShadow: "0px 0px 10px 5px rgba(255,255,0,.5)",
            animation: "ammo_spinning 1.5s infinite",
            margin: "auto",
            display: "block"
        })
        this.styleElement(element,{
            position: "absolute",
            top: '0px',
            right: '30%',
            width: "6rem",
            height: "6rem",
            ...position
        })


        parent.appendChild(element);

        this.capacity = capacity;
        const loop = ()=>{
            return requestAnimationFrame(()=>{
                if(this.game.stoppedState) return loop();
                const rect = this.rootElement.getBoundingClientRect();
                if(rect.top < window.innerHeight){
                    this.top += road.speed/2;
                    this.rootElement.style.transform = `translateY(${this.top/10}rem)`
                }else{
                    this.outOfBounds = true;
                    this.destroy();
                }
                return loop();
            })
        }
        loop();
 
    }

    powerupFunction(){
        window.changeAmmo(this.capacity)
    }

    onDestroy(){
        return new Promise((resolve)=>{
            if(!this.outOfBounds){
                Batarang.addAmmo(this.capacity);
                GameObject.emit("batarang_capacity_change",Batarang.capacity)
            }

            this.styleElement(this.rootElement.firstChild,{
                transition: "0.5s all linear",
            })

            setTimeout(()=>{
                this.styleElement(this.rootElement.firstChild,{
                    animation: "none",
                    opacity: "0",
                    width: "200%",
                    marginRight: "100%",
                    zIndex: 100
                })
            },0)

            setTimeout(()=>{
                clearInterval(this.moveInterval);
                resolve(console.log("deleting object: ",this.rootId));
            },500)
            
        });
    }
}

export default Ammo;