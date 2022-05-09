import Road from "../game_objects/road/Road";
import Batmobile from "../game_objects/main_character/Batmobile";
import Bricks from "../game_objects/blockades/Bricks";
import CollisionListener from "../game_container/CollisionListener";
import Ammo from "../game_objects/power_ups/Ammo";
import Health from '../game_objects/power_ups/Health'
import Bomb from "../game_objects/blockades/Bomb";
import Structure from "../game_objects/blockades/Structure";
import GameObject from "../game_objects/GameObject";

class level_1{
    constructor(root){
        const collisionListener = new CollisionListener;
        const road = new Road(root);
        const batmobile = new Batmobile(road.rootElement,road);
        // const bricks = new Bricks(road.rootElement,road);
        // const ammo = new Ammo(road.rootElement,road);
        // const bomb = new Bomb(road.rootElement,road)
        const distanceLevels = {};
        let currentPosition = 0;

        // Two values. 1. The distance from the previous position, 2. the function to run
        const startingPositions = [
            // only structures
            // [0,()=>{
            //     new Structure(road.rootElement,road,null,{left: "0px"});            
            // }],
            // [1000,()=>{
            //     new Structure(road.rootElement,road);
            // }],
            // [750,()=>{
            //     new Structure(road.rootElement,road,{width:"84%"},{left:"0px"});
            // }],
            [750,()=>{
                new Structure(road.rootElement,road,{width:"84%"},{right:"0px"});
            }],
            [750,()=>{
                new Structure(road.rootElement,road,{width:"80%",height:"64rem"},{left:"0px"});
            }],
            [1400,()=>{
                new Structure(road.rootElement,road,{width:"80%",height:"64rem"},{right:"0px"});
            }],
            [1500,()=>{
                new Ammo(road.rootElement,road,5,{left:"calc(50% - 3rem)"});
            }],

            // only bricks
            [300,()=>{
                new Bricks(road.rootElement,road,{left: `0px`});
                new Bricks(road.rootElement,road,{left: `calc(50% - ${Bricks.width/2}rem)`});
                new Bricks(road.rootElement,road,{right: `0px`});
            }],
        
            [800,()=>{

                new Bricks(road.rootElement,road,{left: "10rem"});
                new Bricks(road.rootElement,road,{left: "15rem"});
                new Bricks(road.rootElement,road,{left: "35rem"});
                new Bricks(road.rootElement,road,{left: "40rem"});
   
            }],
            [800,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
                new Bricks(road.rootElement,road,{left: "10rem"});
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "30rem"});
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [800,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "30rem"});
                new Bricks(road.rootElement,road,{left: "40rem"});
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],

            // bricks and structures, closer together
     
            [500,()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});
                new Bricks(road.rootElement,road,{right: `0rem`});
            }],
            [500,()=>{
                new Structure(road.rootElement,road);
                new Bricks(road.rootElement,road);
            }],
            [500,()=>{
                new Structure(road.rootElement,road,{width:"50%"},{left: "0px"});
                new Bricks(road.rootElement,road,{right: "0px"});
            }],
            [550,()=>{
                new Bricks(road.rootElement,road,{left:`${Bricks.width*3}rem`});
                new Bricks(road.rootElement,road,{left:`${Bricks.width*4}rem`});
                new Bricks(road.rootElement,road,{left:`${Bricks.width*5}rem`});
            }],
            [500,()=>{
                new Health(road.rootElement,road);
                new Ammo(road.rootElement,road,5);
            }],

            // first bombs section

            [650,()=>{
                new Bomb(road.rootElement,road,{left:"10%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"30%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"50%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"70%"},true);
            }],
            [650,()=>{
                new Bomb(road.rootElement,road,{left:"83.33%"},true);
            }],
           
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"49.99%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"66.66%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"16.67%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"33.32%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"0%"},true);
            }],

            [300, ()=>{
                new Health(road.rootElement,road,100,{left:"calc(50% - 3rem)"});
            }],         

                

            // give a bit of a breather, and then it will go to town and end the first level
            [1200, ()=>{
                    new Bricks(road.rootElement,road,{left:`${Bricks.width*3}rem`});
                    new Bricks(road.rootElement,road,{left:`${Bricks.width*4}rem`});
                    new Bricks(road.rootElement,road,{left:`${Bricks.width*5}rem`});
                }
            ],

            // waves of bricks
            
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "30rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
            }],
            // 
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "30rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            // speed up
            [0,()=>{
                new Health(road.rootElement,road,100,{left:"calc(50% - 3rem)"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
            }],
            // 
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "30rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            // now TWO bricks at once

            [0,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [550,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "30rem"});
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [400,()=>{
                new Bricks(road.rootElement,road,{left: "30rem"});
            }],
            [150,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
                new Bricks(road.rootElement,road,{left: "20rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [350,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [200,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [0,()=>{
                new Ammo(road.rootElement,road,5,{left:"calc(50% - 3rem)"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
                new Bricks(road.rootElement,road,{left: "30rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
                new Bricks(road.rootElement,road,{left: "10rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
                new Bricks(road.rootElement,road,{left: "50rem"});
            }],
            // 
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
                new Bricks(road.rootElement,road,{left: "0rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "10rem"});
                new Bricks(road.rootElement,road,{left: "20rem"});
            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "40rem"});
                new Bricks(road.rootElement,road,{left: "0rem"});

            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "50rem"});
                new Bricks(road.rootElement,road,{left: "10rem"});

            }],
            [175,()=>{
                new Bricks(road.rootElement,road,{left: "20rem"});
                new Bricks(road.rootElement,road,{left: "40rem"});

            }],

            




        
          
        ]

        startingPositions.forEach(position=>{
            currentPosition += position[0];
            distanceLevels[currentPosition] = position[1];
        })

        // const distanceLevels = {}

        GameObject.on('pixels-traversed',(distanceFloat)=>{
            let distance = 50*Math.floor(distanceFloat/50);
            if(distanceLevels[distance]){
                distanceLevels[distance]();
                delete distanceLevels[distance]
            }
        })


        

    }
}

export default level_1;