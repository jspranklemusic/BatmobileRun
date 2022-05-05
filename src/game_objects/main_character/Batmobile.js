import GameObject from "../GameObject";
import car_svg from "../../images/car_topview.svg";
import batman_logo from "../../images/bat-silhouette.png";
import { collision_types } from "../../game_container/CollisionListener";
import Batarang from "../projectile/Batarang";


class Batmobile extends GameObject{

    xPosition = 0;
    moveInterval = {};
    pressingKey = null;
    svgTransform = {
        perspective: 10000,
        rotateX: 0,
        rotateZ: 0
    }

    constructor(parent, boundary=600){
       const svg = document.createElement("object");
       const wrapper = document.createElement("div")
       super(wrapper,collision_types.player);
       this.svg = svg;
       svg.type="image/svg+xml"
       svg.data = car_svg
       svg.style.width = "100%"
       

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
    
        function percentWidth(num=100){
            return parent.offsetWidth*(num/100);
        }

        function percentHeight(num=100){
            return parent.offsetHeight*(num/100);
        }

        this.boundary = boundary;
      
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

   

       parent.appendChild(wrapper);
    }

    move(direction = "left", clear = false){

        const directions = {
            left: -10,
            right: 10
        }

        if(!this.moveInterval[direction]){
            this.moveInterval[direction] = setInterval(()=>{

                const diff = this.xPosition + directions[direction];
                // return if out of bounds
                if( diff < ((-this.boundary/2)+50) | diff > (this.boundary/2) - 40){
                    return;
                }
                this.xPosition += directions[direction];
                this.rootElement.style.transform = `translateX(${this.xPosition/10}rem)`
                // move the car's perspective
                this.svg.style.transform = `
                    perspective(${this.svgTransform.perspective/10}rem) 
                    rotateX(${this.svgTransform.rotateX}deg)
                    rotateZ(${this.svgTransform.rotateZ}deg)
                    `
                window.setDebugState({...window.debugState, xPosition: this.xPosition})
            },30)
        }else if(clear){
            clearInterval(this.moveInterval[direction]);
            this.moveInterval[direction] = null;
        }
    }

  

  
}

export default Batmobile;