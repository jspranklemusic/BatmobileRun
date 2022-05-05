import GameObject from "../GameObject";

class Road extends GameObject{

    width = 600;
    height = 600;

    constructor(parent) {
        const road = document.createElement("div");
        super(road,"none");
        this.parent = parent;
        this.transform = 0;
        this.speed = 3;
        this.road = road;

        // road
        const roadStyle = {
            // height: `${this.height/10}rem`,
            height: "100%",
            width: `${this.width/10}rem`,
            background: "rgb(125,125,125)",
            margin: "0 auto",
            // transform: "perspective(10rem) rotateX(10deg)",
            overflow: "hidden",
            transformStyle: "preserve-3d"
        }
        this.styleElement(this.road, roadStyle);

        // lines
        const lineStyle = {
            width: "1.5rem",
            height: "3rem",
            position: "absolute",
            left: "calc(50% - 0.75rem)",
            background: "white"
        }
        for(let i = 0; i < 15; i++){
            const line = document.createElement("div");
            let offset = ((i*60) - 60 )/10;
            line.style.top = 0;
            line.setAttribute("transform",offset)
            line.style.transform = `translateY(${offset}rem)`;
            line.classList.add("road-line")
            this.styleElement(line, lineStyle);
            this.road.appendChild(line)
        }

        this.moveLines();


        GameObject.listen("keydown",e=>{
            if(e.keyCode == 38){
                this.accelerate()
            }
        })

        GameObject.listen("keyup",e=>{
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
        let count = 0;
        const itvl = setInterval(()=>{
            if(this.speed >= 7){
                clearInterval(itvl);
                return;
            }
            this.speed *= 1.1;
            window.debug({speed: this.speed})
            count++;
        },50)
    }

    moveLines(){
        setInterval(()=>{
            document.querySelectorAll(".road-line").forEach((line,i) => {
                let diff = parseFloat(line.getAttribute("transform")) + (this.speed/10);
                if((diff*10) - 60 >= window.innerHeight){
                    diff = -6;
                }
                line.setAttribute("transform",diff)
                line.style.transform = `translateY(${diff}rem)`
            })
        },30)
    }

    resumeRegularSpeed(){
        const itvl = setInterval(()=>{
            if(this.speed <= 3){
                this.speed = 3;
                clearInterval(itvl);
                return;
            }
            this.speed *= 0.95;
            window.debug({speed: this.speed})

        },50)
    }

    slow(){

    }
}

export default Road;