import Road from "../game_objects/road/Road";
import Batmobile from "../game_objects/main_character/Batmobile";
import Bricks from "../game_objects/blockades/Bricks";
import CollisionListener from "../game_container/CollisionListener";
import Ammo from "../game_objects/power_ups/Ammo";
import Health from '../game_objects/power_ups/Health'
import Bomb from "../game_objects/blockades/Bomb";
import Structure from "../game_objects/blockades/Structure";
import GameObject from "../game_objects/GameObject";
import { Game } from "../game_container/GameContainer";
import { pointTypes } from "../game_container/CollisionListener";
import AchievementPoint from "../game_objects/achievement_points/AchievementPoint";

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
            [0,()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});     
                Game.emit("new-dialog","Level 2")       
            }],
            [500,()=>{
                new AchievementPoint(road.rootElement,road,pointTypes.finish_line);
            }]
          
        ]

        startingPositions.forEach(position=>{
            currentPosition += position[0];
            distanceLevels[currentPosition] = position[1];
        })

        // distanceLevels[0] = ()=> new Ammo(road.rootElement,road,10);

        this.index = GameObject.on('pixels-traversed',(distanceFloat)=>{
            let distance = 50*Math.floor(distanceFloat/50);
            if(distanceLevels[distance]){
                distanceLevels[distance]();
                delete distanceLevels[distance]
            }
        })


    }

    destroy(){
        console.log(this.index);
        console.log(GameObject.emitters);
        // GameObject.unregisterEvent('pixels-traversed',this.index);
      
    
    }
}

export default level_1;