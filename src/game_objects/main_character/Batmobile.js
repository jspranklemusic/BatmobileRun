import GameObject from "../GameObject";
import { Game } from "../../game_container/GameContainer";
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

        GameObject.listen("keydown",e=>{
            if(this.game.stoppedState) return;
            // if(!this.pressingKey){
                if(e.keyCode == 37){
                    this.pressingKey = e.keyCode;
                    this.move("left");
                }else if(e.keyCode == 39){
                    this.pressingKey = e.keyCode;
                    this.move("right");
                }
            // }
            if(e.shiftKey){
                let curPos = this.rootElement.getBoundingClientRect()
                let top = curPos.top;
                let left = this.xPosition + 250 + (35);
                new Batarang(parent,left,top);
            }
        })

       

        GameObject.listen("keyup",e=>{
            if(this.game.stoppedState) return;
            if(this.pressingKey == e.keyCode){
                if(e.keyCode == 37){
                    this.cancelMove();
                }else if(e.keyCode == 39){
                    this.cancelMove();
                }
                this.pressingKey = null;
            }
        })

        
        const resumeRegularSpeed = ()=>{
            if(this.slowdownInterval | this.stuck) return;
            clearInterval(this.accelerateInterval);
            this.accelerateInterval = null;
            this.slowdownInterval = 1;
            const slowDown = ()=>{
                if(!this.slowdownInterval){
                    return;
                }
                return requestAnimationFrame(()=>{
                    if(!!this.game.stoppedState | this.stuck | !this.slowdownInterval) return;
                    console.log(this.yPosition,this.game.stoppedState)
                    if(this.yPosition < -2){
                        this.yPosition += 2;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                    }else if(this.yPosition > 2){
                        this.yPosition -= 2;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                    }else{
                        this.yPosition = 0;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`;
                        clearInterval(this.slowdownInterval);
                        this.slowdownInterval = null;
                    }
                    window.debug({yPosition:this.yPosition});
                    slowDown();
                })
            }
            slowDown();
        }
        GameObject.on('resumeRegularSpeed',resumeRegularSpeed);

        const accelerate = ()=> {
            if(this.accelerateInterval | this.stuck) return;
            this.slowdownInterval = null;
            this.accelerateInterval = 1;
            const accelerateLoop = ()=>{
                if(!this.accelerateInterval){
                    return;
                }
                return requestAnimationFrame(()=>{
                    if(this.game.stoppedState) return;
                    if(this.stuck) return;
                    if(this.yPosition > -200){
                        this.yPosition -= 1;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`
                    }else{
                        this.yPosition = -200;
                        this.rootElement.style.transform = `translateX(${this.xPosition/10}rem) translateY(${this.yPosition/10}rem)`;
                        this.accelerateInterval = null;
                    }
                    window.debug({yPosition:this.yPosition});
                    accelerateLoop();
                })
            }
            accelerateLoop();
        }

        GameObject.on("accelerate",accelerate);

        GameObject.on("indestructible_collision",(objectRect)=>{
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

        });


        // after pausing, reset player controls back to default
        Game.on("unpause",()=>{
            this.cancelMove();
            clearInterval(this.accelerateInterval);
            this.accelerateInterval = null;
        })


        Game.on("death",()=>{
            this.cancelMove();
            clearInterval(this.accelerateInterval);
            clearInterval(this.slowdownInterval);
            this.accelerateInterval = null;
            this.slowdownInterval = null;
        })

       parent.appendChild(wrapper);
    }
    

    onDestroy(){
        return new Promise(resolve=>{
            this.cancelMove();
            this.accelerateInterval = 0;
            this.slowdownInterval = 0;
            resolve("deleting object",this.rootId);
        });
    }


    // move to the left or right
    move(direction = "left"){

        if(Game.moveDisabled) return;
  
        const directions = {
            left: -5,
            right: 5
        }
        
        if(!this.moveInterval[direction]){
            let opposite;
            if(direction == "left"){
                opposite = "right"
            }else{
                opposite = "left";
            }
            this.moveInterval[opposite] = null;
            this.moveInterval[direction] = 1;
            const moveInterval = ()=>{
                if(!this.moveInterval[direction]){
                    this.cancelMove();
                    return;
                }
                return requestAnimationFrame(()=>{
                if(this.game.stoppedState) return moveInterval();
                const playerRect = this.rootElement.getBoundingClientRect();
                const modifiedRect = {
                    top: playerRect.top,
                    bottom: playerRect.bottom,
                    left: playerRect.left + directions[direction],
                    right: playerRect.right + directions[direction]
                }
                
                // return if colliding with indestructible object
                if(CollisionListener.willPlayerCollide(playerRect,modifiedRect)){
                    return moveInterval();
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
                window.setDebugState({...window.debugState, xPosition: this.xPosition});
                moveInterval();
                })
            }
            moveInterval();

        }
    }

    cancelMove(){
        this.moveInterval = { left: null, right: null };
        this.svgTransform.rotateZ = 0;
        this.svg.style.transform = `
            rotateZ(${this.svgTransform.rotateZ}deg)
            `
    }

  
}

export default Batmobile;