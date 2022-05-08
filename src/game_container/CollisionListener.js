import GameObject from "../game_objects/GameObject";

export const collision_types = {
    player: "player",
    indestructible: "indestructible",
    destructible: "destructible",
    projectile: "projectile",
    powerup: "powerup",
    enemy: "enemy",
    none: "none"
}

class CollisionListener{

    static collisionObjects = {}
    constructor(){
        for(let type in collision_types){
            CollisionListener.collisionObjects[type] = [];
        }
        this.checkForCollisions();
    }

    checkForCollisions(){
        this.interval = setInterval(()=>{
            // check player
            if(CollisionListener.collisionObjects.player.length > 0){
                const player = CollisionListener.collisionObjects.player[0];
                const playerRect = player.rootElement.getBoundingClientRect();
                const projectiles = CollisionListener.collisionObjects.projectile.map(p=>p.rootElement.getBoundingClientRect());

                CollisionListener.collisionObjects.destructible.forEach(object=>{
                    const objectRect = object.rootElement.getBoundingClientRect();
                    // player is bumping into left
                    if(CollisionListener.isCollision(playerRect,objectRect)){
                        window.changeHealth(-1*object.playerDamage);
                        object.destroy();
                    }
                    projectiles.forEach((rect,i)=>{
                        if(CollisionListener.isCollision(rect,objectRect)){
                            object.destroy();
                            CollisionListener.collisionObjects.projectile[i].destroy()
                        }
                    })

                })

                CollisionListener.collisionObjects.indestructible.forEach(object=>{
                    const objectRect = object.rootElement.getBoundingClientRect();
                    // player is bumping into left
                    const boundary = CollisionListener.isBoundary(playerRect,objectRect)
                    if(boundary && playerRect.bottom > objectRect.bottom){
                        GameObject.emit('indestructible_collision')
                    }
                    projectiles.forEach((rect,i)=>{
                        if(CollisionListener.isCollision(rect,objectRect)){
                            CollisionListener.collisionObjects.projectile[i].destroy()
                        }
                    })
                })

                CollisionListener.collisionObjects.powerup.forEach(powerup=>{
                    const powerupRect = powerup.rootElement.getBoundingClientRect();
                    if(CollisionListener.isCollision(playerRect,powerupRect)){
                        powerup.powerupFunction()
                        powerup.destroy();
                    }
                })

                // check to see if car is out of map
                if(playerRect.top > window.innerHeight){
                    alert("YOU LOSE!");
                    clearInterval(this.interval)
                }
            }
        },30)
    }

    static willPlayerCollide(playerRect1, playerRect2){
        let willPlayerCollide = false;
        CollisionListener.collisionObjects.indestructible.forEach(object=>{
            const objectRect = object.rootElement.getBoundingClientRect();
            if(!CollisionListener.isCollision(playerRect1,objectRect) && CollisionListener.isCollision(playerRect2,objectRect)){
                willPlayerCollide = true;
            }
        })
     
        return willPlayerCollide;
    }

  

    static isBoundary(rect1,rect2){
        const bumpLeft = rect1.left <= rect2.right && rect1.left >= rect2.left;
        const bumpRight = rect1.right >= rect2.left && rect1.right <= rect2.right;
        const bumpUp = rect1.top <= rect2.bottom && rect1.top >= rect2.top;
        const bumpDown = rect1.bottom >= rect2.top && rect1.bottom <= rect2.bottom
        const bumpLeft2 = rect2.left <= rect1.right && rect2.left >= rect1.left;
        const bumpRight2 = rect2.right >= rect1.left && rect2.right <= rect1.right;
        const bumpUp2 = rect2.top <= rect1.bottom && rect2.top >= rect1.top;
        const bumpDown2 = rect2.bottom >= rect1.top && rect2.bottom <= rect1.bottom;

        if(bumpDown && bumpLeft) return "downleft1";
        if(bumpDown && bumpRight) return "downright1";
        if(bumpUp && bumpLeft) return "upleft1";
        if(bumpUp && bumpRight) return "upright1";
        if(bumpDown2 && bumpLeft2) return "downleft2";
        if(bumpDown2 && bumpRight2) return "downright2"
        if(bumpUp2 && bumpLeft2) return "upleft2";
        if(bumpUp2 && bumpRight2) return "upright2";

        return undefined;
    }

    static isCollision(rect1, rect2){
        const bumpLeft = rect1.left <= rect2.right && rect1.left >= rect2.left;
        const bumpRight = rect1.right >= rect2.left && rect1.right <= rect2.right;
        const bumpUp = rect1.top <= rect2.bottom && rect1.top >= rect2.top;
        const bumpDown = rect1.bottom >= rect2.top && rect1.bottom <= rect2.bottom
        const bumpLeft2 = rect2.left <= rect1.right && rect2.left >= rect1.left;
        const bumpRight2 = rect2.right >= rect1.left && rect2.right <= rect1.right;
        const bumpUp2 = rect2.top <= rect1.bottom && rect2.top >= rect1.top;
        const bumpDown2 = rect2.bottom >= rect1.top && rect2.bottom <= rect1.bottom
        return (
            (bumpDown && bumpLeft) | 
            (bumpDown && bumpRight) | 
            (bumpUp && bumpLeft) | 
            (bumpUp && bumpRight) |
            (bumpDown2 && bumpLeft2) | 
            (bumpDown2 && bumpRight2) | 
            (bumpUp2 && bumpLeft2) | 
            (bumpUp2 && bumpRight2)
        );
    }

    unregisterCollisionObject(type,rootId){
        let index = CollisionListener.collisionObjects[type].findIndex(obj=>obj.rootId == rootId);
        if (index < 0) return;
        CollisionListener.collisionObjects[type].splice(index,1);
    }

    registerCollisionObject(object){
        if(!collision_types[object.collision_type]){
            throw new Error("Invalid collision type.")
        }else if(object.collision_type === collision_types.none){
            return;
        }

        CollisionListener.collisionObjects[object.collision_type].push(object)
        return CollisionListener.collisionObjects
    }
    
}

export default CollisionListener