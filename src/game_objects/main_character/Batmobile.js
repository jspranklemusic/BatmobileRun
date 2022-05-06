import GameObject from "../GameObject";
import car_svg from "../../images/car_topview.svg";
import batman_logo from "../../images/bat-silhouette.png";
import { collision_types } from "../../game_container/CollisionListener";
import Batarang from "../projectile/Batarang";
import CollisionListener from "../../game_container/CollisionListener";

class Batmobile extends GameObject{

    stuck = false;
    xPosition = 0;
    yPosition = 0;
    moveInterval = {};
    pressingKey = null;
    svgTransform = {
        perspective: 10000,
        rotateX: 0,
        rotateZ: 0
    }

    constructor(parent, road){
       const svg = document.createElement("object");
       const wrapper = document.createElement("div")
       super(wrapper,collision_types.player);
       this.svg = svg;
       svg.type="image/svg+xml"
       svg.data = car_svg
       svg.style.width = "100%"
       svg.style.transition = "0.2s"
       

       const logo = document.createElement("img");
       
       logo.src = batman_logo
       logo.width = 50;
       this.styleElement(logo,{
           position: "absolute",
           top: "calc(50% - 8px)",
           left: "calc(50% - 25px)",
           background: "rgb(100,100,100)",
           height: "40px",
           borderRadius: "50%"
       })
       

       wrapper.appendChild(svg);
       wrapper.appendChild(logo);

        this.boundary = road.width;
        this.road = road;
      
       const wrapperStyle = {
           position: "absolute",
           bottom: "2rem",
           left: "calc(50% - 4.5rem)",
           zIndex: 1,
           width: "9rem",
           height: "21.2rem",
       }

       this.styleElement(wrapper,wrapperStyle);
       this.styleElement(svg,{
           width: "110%",
           marginLeft: "-.5rem",
           transform: `
           perspective(${this.svgTransform.perspective/10}rem) 
           rotateX(${this.svgTransform.rotateX}deg)
           rotateZ(${this.svgTransform.rotateZ}deg)
           `
        })

        GameObject.on("batarang_capacity_change",(capacity)=>{
            let num = 100 - 100*capacity/Batarang.maxCapacity;
            
            this.styleElement(logo,{
                // background: `linear-gradient(
                //     rgb(100,100,100) 0%,
                //     rgb(100,100,100) ${num}%,
                //     yellow ${num}%,
                //     yellow 100%
                // )`
            })
        })

        GameObject.listen("keydown",e=>{
            if(!this.pressingKey){
                if(e.keyCode == 37){
                    this.pressingKey = e.keyCode;
                    this.move("left");
                }else if(e.keyCode == 39){
                    this.pressingKey = e.keyCode;
                    this.move("right");
                }else if(e.keyCode == 38){

                }
            }
            if(e.shiftKey){
                let curPos = this.rootElement.getBoundingClientRect()
                let left = curPos.left - parent.offsetWidth/2 - this.rootElement.offsetWidth*0.85
                let top = curPos.top;
                new Batarang(parent,left,top);
            }
        })

        GameObject.listen("keyup",e=>{
            if(this.pressingKey == e.keyCode){
                if(e.keyCode == 37){
                    this.move("left",true);
                }else if(e.keyCode == 39){
                    this.move("right",true);
                }
                this.pressingKey = null
            }
        })

        
        const resumeRegularSpeed = ()=>{
            if(this.slowdownInterval | this.stuck) return;
            clearInterval(this.accelerateInterval);
            this.accelerateInterval = null;
            this.slowdownInterval = setInterval(()=>{
                if(this.stuck) return;
                if(this.yPosition < 0){
                    this.yPosition += 2;
                    this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                }else if(this.yPosition > 0){
                    this.yPosition -= 2;
                    this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                }else{
                    this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`;
                    clearInterval(this.slowdownInterval);
                    this.slowdownInterval = null;
                }
                window.debug({yPosition:this.yPosition})
            },30)
        }
        GameObject.on('resumeRegularSpeed',resumeRegularSpeed);

        const accelerate = ()=> {
                if(this.accelerateInterval | this.stuck) return;
                clearInterval(this.slowdownInterval);
                this.slowdownInterval = null;
                this.accelerateInterval = setInterval(()=>{
                    if(this.stuck) return;
                    if(this.yPosition > -200){
                        this.yPosition -= 2;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                    }else{
                        this.yPosition = -200;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`;
                        clearInterval(this.accelerateInterval);
                        this.accelerateInterval = null
                    }
                    window.debug({yPosition:this.yPosition})
                },30)

        }
        GameObject.on("accelerate",accelerate);

        GameObject.on("indestructible_collision",()=>{
            this.stuck = true;
            clearInterval(this.slowdownInterval);
            clearInterval(this.accelerateInterval);
            this.accelerateInterval = null;
            this.slowdownInterval = null;
            this.yPosition += this.road.speed;
            this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`;
            setTimeout(()=>{
                this.stuck = false;
                resumeRegularSpeed();
            },30)

        })
   

       parent.appendChild(wrapper);
    }
    


    // move to the left or right
    move(direction = "left", clear = false){
  
        const directions = {
            left: -10,
            right: 10
        }
        
        if(!this.moveInterval[direction]){
            this.moveInterval[direction] = setInterval(()=>{
                const playerRect = this.rootElement.getBoundingClientRect();
                const modifiedRect = {
                    top: playerRect.top,
                    bottom: playerRect.bottom,
                    left: playerRect.left + directions[direction],
                    right: playerRect.right + directions[direction]
                }
                
                // return if colliding with indestructible object
                if(CollisionListener.willPlayerCollide(playerRect,modifiedRect)){
                    return;
                }
                const diff = this.xPosition + directions[direction];
                // return if out of bounds
                if( diff < ((-this.boundary/2)+50) | diff > (this.boundary/2) - 40){
                    return;
                }
                this.xPosition += directions[direction];
                this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                // rotate the car like turning
                this.svgTransform.rotateZ = directions[direction]
                this.svg.style.transform = `
                    rotateZ(${this.svgTransform.rotateZ}deg)
                    `
                window.setDebugState({...window.debugState, xPosition: this.xPosition})
            },30)

        }else if(clear){
            clearInterval(this.moveInterval[direction]);
            this.moveInterval[direction] = null;
            this.svgTransform.rotateZ = 0
            this.svg.style.transform = `
                rotateZ(${this.svgTransform.rotateZ}deg)
                `
        }
    }

  

  
}

export default Batmobile;