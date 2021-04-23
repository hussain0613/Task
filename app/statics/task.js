class Task{
    static __id__ = 0;
    constructor(title=null){
        Task.__id__ += 1;
        this.id = Task.__id__;
        if(title == null) this.title = "Task-"+this.id;
        else this.title = title;
        this.timestamps = new Array();
        this.details = "";
        this.tags = new Array();
        this.duration = 0;
        this.state = 0;
    }

    start() {
        if(this.state == 0){
            this.timestamps.push(Date.now());
            this.state = 1;
        }
        else{
            throw Error("already started");
        }
    }
    pause(){
        if(this.state == 1){
            this.timestamps.push(Date.now());
            this.state = 2;
        }
        else{
            throw Error("Not running");
        }
    }
    resume(){
        if(this.state == 2){
            this.timestamps.push(Date.now());
            this.state = 1;
        }
        else{
            throw Error("Not paused");
        }
    }
    stop(){
        if(this.state == 3){
            throw Error("Already stopped");
        }
        else{
            this.timestamps.push(Date.now());
            this.state = 3;
        }
    }

    calculate_duration(){
        
    }

    add_tag(tag){
        this.tags.push(tag);
    }
}