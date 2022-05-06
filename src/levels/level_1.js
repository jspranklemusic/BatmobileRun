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
        const structure = new Structure(road.rootElement,road);

        const distanceLevels = {
            0: ()=>{
                new Bricks(road.rootElement,road);
            },
            1000: ()=>{
                new Bricks(road.rootElement,road);
            },
        }

        GameObject.on('pixels-traversed',(distanceFloat)=>{
            let distance = Math.floor(distanceFloat);
            if(distanceLevels[distance]){
                distanceLevels[distance]();
            }
        })
        

    }
}

export default level_1;