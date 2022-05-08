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

        // Two values. 1. The distance from the previous position, 2. the generations to run
        const startingPositions = [
            [0,()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});            
            }],
            [1000,()=>{
                new Structure(road.rootElement,road);
            }],
            [500,()=>{
                new Bricks(road.rootElement,road,{left: `calc(50% - ${Bricks.width/2}rem)`})
            }],
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
            [500,()=>{
                new Bricks(road.rootElement,road,{left:`${Bricks.width*3}rem`});
                new Bricks(road.rootElement,road,{left:`${Bricks.width*4}rem`});
                new Bricks(road.rootElement,road,{left:`${Bricks.width*5}rem`});
            }],
            [500,()=>{
                new Health(road.rootElement,road);
                new Ammo(road.rootElement,road);
            }],
            [1000,()=>{
                new Bomb(road.rootElement,road,{left:"0%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"15%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"30%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"45%"},true);
            }],
            [50,()=>{
                new Bomb(road.rootElement,road,{left:"60%"},true);
            }],
            [50, ()=>{
                new Bomb(road.rootElement,road,{left:"75%"},true);
            }]
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