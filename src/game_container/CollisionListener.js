export const COLLISION_TYPES = {
    player: "player",
    indestructible: "indestructible",
    destructible: "destructible",
    projectile: "projectile",
    enemy: "enemy",
    none: "none"
}

class CollisionListener{

    collisionObjects = {
        player: [],
        indestructible: [],
        destructible: [],
        projectile: []
    }
    constructor(){
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
                        alert("OH NO, YOU CRASHED!")
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
            }
        },30)
    }

    isCollision(rect1, rect2){
        const bumpLeft = rect1.left <= rect2.right && rect1.left >= rect2.left;
        const bumpRight = rect1.right >= rect2.left && rect1.right <= rect2.right;
        const bumpUp = rect1.top <= rect2.bottom && rect1.top >= rect2.top;
        const bumpDown = rect1.bottom >= rect2.top && rect1.bottom <= rect2.bottom
        return (bumpDown && bumpLeft) | (bumpDown && bumpRight) | (bumpUp && bumpLeft) | (bumpUp && bumpRight);
    }

    unregisterCollisionObject(type,rootId){
        let index = this.collisionObjects[type].findIndex(obj=>obj.rootId == rootId);
        this.collisionObjects[type].splice(index,1);
    }

    registerCollisionObject(object){
        if(!COLLISION_TYPES[object.collisionType]){
            throw new Error("Invalid collision type.")
        }else if(object.collisionType === COLLISION_TYPES.none){
            return;
        }

        this.collisionObjects[object.collisionType].push(object)
        return this.collisionObjects
    }
    
}

export default CollisionListener