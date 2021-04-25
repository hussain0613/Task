

class Task{
    static __id__ = 0;
    static tasks = {};
    constructor(title=null, id = null){
        Task.__id__ += 1;
        
        if(id == null){
            this.id = Task.__id__;
        }
        else this.id =id; // if given id != Task.__id__ that means error in continuation, will have to take care of that too
                            // probably will have to ask server for the missing ons or something
        Task.tasks[this.id] = this;
        if(title == null) this.title = "Task-"+this.id;
        else this.title = title;
        this.timestamps = new Array();
        this.details = "";
        this.tags = new Array();
        this.duration = 0;
        this.state = 0;

        /*this.card = ``;
        this.card_node=null;
        this.btn1 = null;
        this.btn2 = null;
        this.dur = null;
        this.container = document.getElementById("paused")
        this.create_card()
        this.container.innerHTML += this.card;
        */
        this.container = document.getElementById("paused")
        this.create_card()
        this.container.appendChild(this.card)
    }

    start(ts = null) {
        if(this.state == 0){
            if(ts == null) {
                ts = Date.now();
                send_state_change(1, ts);
            }
            this.timestamps.push(ts)
            this.state = 1;

            
            this.card.remove();
            this.container = document.getElementById("active")
            this.container.appendChild(this.card);
            
            this.b1.innerText = "Pause";
            //this.b1.setAttribute("onclick", `Task.tasks[${this.id}].pause()`);
            this.b1.onclick = ()=>{this.pause()}
        }
        else{
            throw Error("already started");
            //console.log("weird thing, state = " + this.state)
        }
    }
    pause(ts = null){
        if(this.state == 1){
            if(ts == null) {
                ts = Date.now();
                send_state_change(2, ts);
            }
            this.timestamps.push(ts)
            this.state = 2;

            
            this.card.remove();
            this.container = document.getElementById("paused")
            this.container.appendChild(this.card);
            
            this.b1.innerText = "Resume";
            //this.b1.setAttribute("onclick", `Task.tasks[${this.id}].resume()`);
            this.b1.onclick = ()=>{this.resume()}

        }
        else{
            throw Error("Not running");
        }
    }
    resume(ts = null){
        if(this.state == 2){
            if(ts == null) {
                ts = Date.now();
                send_state_change(1, ts);
            }
            this.timestamps.push(ts)
            this.state = 1;


            this.card.remove();
            this.container = document.getElementById("active")
            this.container.appendChild(this.card);
            
            this.b1.innerText = "Pause";
            //this.b1.setAttribute("onclick", `Task.tasks[${this.id}].pause()`);
            this.b1.onclick = ()=>{this.pause()}
        }
        else{
            throw Error("Not paused");
        }
    }
    stop(ts=null){
        if(this.state == 3){
            throw Error("Already stopped");
        }
        else{
            if(ts == null) {
                ts = Date.now();
                send_state_change(3, ts);
            }
            this.timestamps.push(ts)
            this.state = 3;

            
            this.card.remove();
            this.container = document.getElementById("ended")
            this.container.appendChild(this.card);
            
            this.b1.remove()
            this.b2.remove()
        }
    }

    calculate_duration(){
        if (this.state == 3 && this.timestamps.length == 1){
            this.duration = 0
            return this.duration
        }
        let d = 0;
        for (let i=1; i<this.timestamps.length; i+=2){
            d += this.timestamps[i] - this.timestamps[i-1]
        }

        if (this.state == 1) // if true, that means it is still running
            if (this.timestamps.length%2 == 0)
                throw Error("Continuation Error") // it must have ended or be puased
            else
                d += Date.now() - this.timestamps[this.timestamps.length-1]
        return d
    }

    add_tag(tag){
        this.tags.push(tag);
    }

    
    create_card(){
        /*this.card = `
        <div id = "task-${this.id}">
            <h2>${this.title}</h2>
            <button id="t${this.id}b1" onclick="Task.tasks[${this.id}].start()">Start</button><button id="t${this.id}b2" Task.tasks[${this.id}].stop()>Stop</button>
            <p>Details....</p>
            <text>Duration: </text> <text id="dur-${this.id}">${this.duration}</text>
        </div>
    `*/
    this.card = document.createElement("div");
    this.card.id= "task-"+this.id;
    
    this.title_node = document.createElement("h2");
    this.title_node.innerText = this.title;
    
    this.b1 = document.createElement('button')
    this.b1.id= "t"+this.id+"b1";
    this.b1.innerText = "Start";
    this.b1.onclick = ()=>{this.start()}
    
    this.b2 = document.createElement('button')
    this.b2.id= "t"+this.id+"b2";
    this.b2.innerText = "Stop"
    //this.b2.setAttribute("onclick", `Task.tasks[${this.id}].stop()`);
    this.b2.onclick = ()=>{this.stop()}
    
    this.det = document.createElement("p")
    this.det.appendChild(document.createTextNode(this.details));

    this.dur = document.createElement("text")
    this.dur.innerText = this.duration;
    
    this.card.appendChild(this.title_node);
    this.card.appendChild(this.b1);
    this.card.appendChild(this.b2);
    this.card.appendChild(this.det);
    this.card.appendChild(this.dur);
    }
}

