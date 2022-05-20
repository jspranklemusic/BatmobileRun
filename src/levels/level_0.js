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

class level_0{
    constructor(root){
        const collisionListener = new CollisionListener;
        const road = new Road(root);
        const batmobile = new Batmobile(road.rootElement,road);
        Game.accelerateDisabled = true;
        Game.moveDisabled = true;
        const distanceLevels = {};
        let currentPosition = 0;

        setTimeout(()=>{
            Game.emit("toggle-h&a",false)
        },2000)

        // Two values. 1. The distance from the previous position, 2. the function to run
        const startingPositions = [
            // only structures
            [0,()=>{
                Game.emit("toggle-h&a",false)
                Game.emit("new-dialog","Welcome to Batmobile run.")
            }],
            [600,()=>{
                Game.emit("new-dialog",
                `Chaos has struck Gotham, and the streets are a mess.

                It is feared that Gotham's worst criminals are on the loose. 

                We'd better get to the bottom of this.
                `)
            }],
            [1500,()=>{
                Game.emit("new-dialog",
                `To pause the game at any time, press "ESC".`)
            }],
            [600,()=>{
                Game.emit("new-dialog",
                `To move, use the left and right arrow keys.`
                )
                Game.moveDisabled = false;
            }],
            [500,()=>{
                Game.emit("new-dialog",
                `As you drive, you will find obstacles along your path.
                
                Move out of they way, or they will push you off the map.` 
                )
            }],
            [500,()=>{
                new Structure(road.rootElement,road,null,{right: "0px"});       
            }],
            [500,()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});       
            }],
            [1300,()=>{
                Game.emit("new-dialog",
                `Nice job.` 
                )
            }],
            [400,()=>{
                Game.emit("toggle-h&a",true);
                Game.emit("new-dialog",
                `At the top of the screen, notice your health and ammo.`
                )
            }],
            [700,()=>{
                new Ammo(road.rootElement,road,5, {left:"calc(50% - 3rem)"})
                Game.emit("new-dialog",
                `To get ammo, drive over an ammo powerup for some batarangs.`
                )
            }],
            [1000,()=>{
                Game.emit("new-dialog",
                `To fire a batarang, press "Shift".`
                )
            }],
            [1000,()=>{
                Game.emit("new-dialog",
                `You will also find breakable structures and items on the street. 
                
                You can drive through them, but they will damage your health. 
                
                You can also shoot them.`
                )
            }],
            [1500,()=>{
                new Bricks(road.rootElement,road,{left: `0px`});
                new Bricks(road.rootElement,road,{left: `calc(50% - ${Bricks.width/2}rem)`});
                new Bricks(road.rootElement,road,{right: `0px`});
            }],
            [1000,()=>{
                Game.emit("new-dialog",
                `Got hit? Recharge with a health powerup.`
                )
                new Health(road.rootElement,road,100, {left:"calc(50% - 3rem)"})
            }],
            [1000,()=>{
                Game.emit("new-dialog",
                `If you're in a hurry, you can press the UP arrow to accelerate.
                
                Release the UP arrow to slow down.
                
                Be warned, it can push you off the map even faster.
                `
                )
                Game.accelerateDisabled = false;
            }],
            [1500,()=>{

            }],
            [500,()=>{
                new Structure(road.rootElement,road,null,{right: "0px"});       
            }],
            [500,()=>{
                new Structure(road.rootElement,road,null,{left: "0px"});       
            }],
            [1200,()=>{
                Game.emit("new-dialog",
                `That's it. Now let's go save Gotham!`)
            }],
           
            [300,()=>{
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

export default level_0;