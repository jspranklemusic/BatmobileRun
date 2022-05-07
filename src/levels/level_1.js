import Road from "../game_objects/road/Road";
import Batmobile from "../game_objects/main_character/Batmobile";
import Bricks from "../game_objects/blockades/Bricks";
import CollisionListener from "../game_container/CollisionListener";
import Ammo from "../game_objects/power_ups/Ammo";
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
        

        const distanceLevels = {
            0: ()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});
                new Bricks(road.rootElement,road,{right: "0px"});
            },
            1000: ()=>{
                new Structure(road.rootElement,road);
                new Bricks(road.rootElement,road);
            },
            2000: ()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});
                new Bricks(road.rootElement,road,{right: "0px"});
            },
            2500: ()=>{
                new Structure(road.rootElement,road);
                new Bricks(road.rootElement,road);
            },
            3000: ()=>{
                new Structure(road.rootElement,road,{width:"50%"},{left: "0px"});
                new Bricks(road.rootElement,road,{right: "0px"});
            },
            3500: ()=>{
                new Structure(road.rootElement,road,{width:"50%"});
                new Bricks(road.rootElement,road);
            },

                5000: ()=>{
                    new Bomb(road.rootElement,road,{left:"0%"},true);
                },
                5050: ()=>{
                    new Bomb(road.rootElement,road,{left:"15%"},true);
                },
                5100: ()=>{
                    new Bomb(road.rootElement,road,{left:"30%"},true);
                },
                5150: ()=>{
                    new Bomb(road.rootElement,road,{left:"45%"},true);
                },
                5200: ()=>{
                    new Bomb(road.rootElement,road,{left:"60%"},true);
                },
                5250: ()=>{
                    new Bomb(road.rootElement,road,{left:"75%"},true);
                }
        }

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