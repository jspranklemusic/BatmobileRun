import GameObject from "../GameObject";
import { collision_types } from "../../game_container/CollisionListener";

// adding Health boost. It just adds more Health lol
class Health extends GameObject{

    top = 0;
    xPosition = 0;
    moveInterval = null;

    constructor(parent,road,capacity=100,position={}){
        const element = document.createElement("div");
        super(element,collision_types.powerup);
        const div = document.createElement('div')
        const cross = document.createElement("div");
        cross.classList.add("cross");
        element.appendChild(div);
        div.appendChild(cross);

        this.styleElement(div,{
            width:"100%",
            height: "100%",
            background: "rgb(20,190,20)",
            borderRadius: "50%",
            boxShadow: "0px 0px 10px 5px rgba(20,200,20,.5)",
            animation: "ammo_spinning 1.5s infinite",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid white"
        })
        
        this.styleElement(element,{
            position: "absolute",
            top: '0px',
            left: '30%',
            width: "6rem",
            height: "6rem",
            ...position
        })


        parent.appendChild(element);

        this.capacity = capacity;
        this.moveInterval = setInterval(()=>{
            if(this.game.paused) return;
            const rect = this.rootElement.getBoundingClientRect();
            if(rect.top < window.innerHeight){
                this.top += road.speed;
                this.rootElement.style.transform = `translateY(${this.top/10}rem)`
            }else{
                this.outOfBounds = true;
                this.destroy();
            }

        },30)
    }

    powerupFunction(){
        console.log(this.capacity)
        window.changeHealth(this.capacity)
    }

    onDestroy(){
        return new Promise((resolve)=>{
       

            this.styleElement(this.rootElement.firstChild,{
                transition: "0.5s all linear",
            })

            setTimeout(()=>{
                this.styleElement(this.rootElement.firstChild,{
                    animation: "none",
                    opacity: "0",
                    width: "200%",
                    height: "200%",
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

export default Health;