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

    collisionObjects = {}
    constructor(){
        for(let type in collision_types){
            this.collisionObjects[type] = [];
        }
        this.checkForCollisions();
    }

    checkForCollisions(){
        setInterval(()=>{
            // check player
            if(this.collisionObjects.player.length > 0){
                const playerRect = this.collisionObjects.player[0].rootElement.getBoundingClientRect();
                const projectiles = this.collisionObjects.projectile.map(p=>p.rootElement.getBoundingClientRect());
            
                this.collisionObjects.destructible.forEach(object=>{
                    const objectRect = object.rootElement.getBoundingClientRect();
                    // player is bumping into left
                    if(this.isCollision(playerRect,objectRect)){
                        object.destroy();
                    }
                    projectiles.forEach((rect,i)=>{
                        if(this.isCollision(rect,objectRect)){
                            object.destroy();
                            this.collisionObjects.projectile[i].destroy()
                        }
                    })

                })

                this.collisionObjects.indestructible.forEach(object=>{
                    const objectRect = object.rootElement.getBoundingClientRect();
                    // player is bumping into left
                    if(this.isCollision(playerRect,objectRect)){
                        console.log("BUMP!!!!!!!")
                    }
                })

                this.collisionObjects.powerup.forEach(powerup=>{
                    const powerupRect = powerup.rootElement.getBoundingClientRect();
                    if(this.isCollision(playerRect,powerupRect)){
                        powerup.destroy();
                    }
                })
            }
        },30)
    }

    isCollision(rect1, rect2){
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
        let index = this.collisionObjects[type].findIndex(obj=>obj.rootId == rootId);
        this.collisionObjects[type].splice(index,1);
    }

    registerCollisionObject(object){
        if(!collision_types[object.collision_type]){
            throw new Error("Invalid collision type.")
        }else if(object.collision_type === collision_types.none){
            return;
        }

        this.collisionObjects[object.collision_type].push(object)
        return this.collisionObjects
    }
    
}

export default CollisionListener