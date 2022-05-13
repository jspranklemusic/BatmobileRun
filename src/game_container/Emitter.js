class Emitter{

    static emitters = {}
    static listeners = {}

    static doListenerActions(type,e){
        this.listeners[type].forEach(func=>{
            func(e)
        })
    }

    static listen(type,func){
        if(!this.listeners[type]){
            this.listeners[type] = []
            document.addEventListener(type,e=>{
                this.doListenerActions(type,e)
            })
        }
        this.listeners[type].push(func)
    }

    static emit(id,data){
        if(!this.emitters[id]){
            this.emitters[id] = [];
        }
        this.emitters[id].forEach(func=>func(data));
    }

    static on(id,func){
        if(!this.emitters[id]){
            this.emitters[id] = [];
        }
        this.emitters[id].push(func);
        return this.emitters[id].length - 1;
    }

    static purgeObject(obj){
        Object.keys(obj).forEach(key=>{
            obj[key] = undefined;
            delete obj[key];
        })
    }
}

export default Emitter;