import GameObject from "../GameObject";
import road_bg from '../../images/road.png'

class Road extends GameObject{

    width = 600;
    height = 600;
    pixelsTraversed = 0;
    yPosition = 0;
    

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

        // lines
        // const lineStyle = {
        //     width: "1.5rem",
        //     height: "3rem",
        //     position: "absolute",
        //     left: "calc(50% - 0.75rem)",
        //     background: "white"
        // }
        // for(let i = 0; i < 15; i++){
        //     const line = document.createElement("div");
        //     let offset = ((i*60) - 60 )/10;
        //     line.style.top = 0;
        //     line.setAttribute("transform",offset)
        //     line.style.transform = `translateY(${offset}rem)`;
        //     line.classList.add("road-line")
        //     this.styleElement(line, lineStyle);
        //     this.road.appendChild(line)
        // }

        this.moveLines();


        GameObject.listen("keydown",e=>{
            if(this.game.paused) return;
            if(e.keyCode == 38){
                this.accelerate()
            }
        })

        GameObject.listen("keyup",e=>{
            if(this.game.paused) return;
            if(e.keyCode == 38){
                this.resumeRegularSpeed();
            }
        })

        parent.appendChild(this.road);
    }

    destroy(){
        this.parent.road.destroy();
    }

    accelerate(){
        if(this.game.paused) return;
        GameObject.emit("accelerate");
        let interval = 50
        const itvl = setInterval(()=>{
            if(this.game.paused) return;
            if(this.speed >= 8){
                this.speed = 8;
                clearInterval(itvl);
                return;
            }
            this.speed *= 1.1;
        },interval)
    }

    moveLines(){
        setInterval(()=>{
            if(this.game.paused) return;
            this.pixelsTraversed += (this.speed*1.5);
            GameObject.emit("pixels-traversed",this.pixelsTraversed );
            window.debug({pixelsTraversed: this.pixelsTraversed});

            // document.querySelectorAll(".road-line").forEach((line,i) => {
            //     let diff = parseFloat(line.getAttribute("transform")) + (this.speed/10);
            //     if((diff*10) - 60 >= window.innerHeight){
            //         diff = -6;
            //     }
            //     line.setAttribute("transform",diff)
            //     line.style.transform = `translateY(${diff}rem)`;
            // })
            this.yPosition += (this.speed);
            this.rootElement.style.backgroundPositionY = `${this.yPosition/10}rem`
        },30)
    }

    resumeRegularSpeed(){
        if(this.game.paused) return;
        GameObject.emit('resumeRegularSpeed')

        const itvl = setInterval(()=>{
            if(this.game.paused) return;
            if(this.speed <= 4){
                this.speed = 4;
                clearInterval(itvl);
                return;
            }
            this.speed *= 0.95;
        },50)
    }

    slow(){

    }
}

export default Road;