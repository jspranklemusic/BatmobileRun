import GameObject from "../GameObject";
import { Game } from "../../game_container/GameContainer";
import road_bg from '../../images/road.png'

class Road extends GameObject{

    width = 600;
    height = 600;
    pixelsTraversed = 0;
    yPosition = 0;
    name = 'Road'
    

    // what should a map be? how many road units?

    /*
        speed ranges between 4-8 pixels per 1/3 second
    */

    constructor(parent) {
        const road = document.createElement("div");
        super(road,"none");
        this.parent = parent;
        this.transform = 0;
        this.speed = 4;
        this.road = road;

        // road
        const roadStyle = {
            // height: `${this.height/10}rem`,
            height: "100%",
            width: `${this.width/10}rem`,
            margin: "0 auto",
            backgroundImage:`url(${road_bg})`,
            boxSizing: "content-box",
            backgroundSize: "contain",
            backgroundRepeat: "repeat",
            transformStyle: "preserve-3d",

        }

        this.styleElement(this.road, roadStyle);

        if(this.width > window.innerWidth){
            document.querySelector("html").style.fontSize = `${10*(window.innerWidth/this.width)}px`;
        }

        this.moveLines();

        GameObject.listen("keydown",e=>{
            if(this.game.stoppedState) return;
            if(e.keyCode == 38){
                this.accelerate()
            }
        })

        GameObject.listen("keyup",e=>{
            if(this.game.stoppedState) return;
            if(e.keyCode == 38){
                this.resumeRegularSpeed();
            }
        })

        Game.on("unpause",()=>{
            this.resumeRegularSpeed();
        })

        parent.appendChild(this.road);
    }

    accelerate(){
        if(this.game.stoppedState | this.accelerateInterval) return;
        GameObject.emit("accelerate");
        let interval = 50
        this.accelerateInterval = setInterval(()=>{
            if(this.game.stoppedState) return;
            if(this.speed > 8){
                
                this.speed = 8;
                clearInterval(this.accelerateInterval);
                this.accelerateInterval = null;
                return;
            }
            this.speed *= 1.1;
            window.debug({speed: this.speed});
         

        },interval)
    }



    moveLines(){
        this.moveLinesInterval = setInterval(()=>{
            if(this.game.stoppedState) return;
            this.pixelsTraversed += (this.speed*1.5);
            GameObject.emit("pixels-traversed",this.pixelsTraversed );
            window.debug({pixelsTraversed: this.pixelsTraversed});
            this.yPosition += (this.speed);
            this.rootElement.style.backgroundPositionY = `${this.yPosition/10}rem`
        },30)
    }

    onDestroy(){
        return new Promise(resolve=>{
            clearInterval(this.slowdownInterval);
            clearInterval(this.accelerateInterval);
            clearInterval(this.moveLinesInterval);
            this.slowdownInterval = null;
            this.accelerateInterval = null;
            this.moveLinesInterval = null;
            resolve("deleting road");
        })
    }

    resumeRegularSpeed(){
        if(this.game.stoppedState | this.slowdownInterval) return;
        GameObject.emit('resumeRegularSpeed')

        this.slowdownInterval = setInterval(()=>{
            if(this.game.stoppedState) return;
            if(this.speed < 4){
                this.speed = 4;
                window.debug({speed: this.speed});
                clearInterval(this.slowdownInterval);
                this.slowdownInterval = null;
                return;
            }
            this.speed *= 0.95;
            window.debug({speed: this.speed});
        },50)
    }

    slow(){

    }
}

export default Road;