SERVER_TIMESTAMP = 0.0;
LOCAL_TIMESTAMP = 0.0;

ws = new WebSocket( location.origin.replace(location.protocol, "ws:") + "/ws")
document.onload = ()=>{
    ws.send(JSON.stringify({
        "type": "info",
        "current_id": Task.__id__
    }));
}

ws.onmessage = function (event){
    SERVER_TIMESTAMP = Date.now();// server theke asha kono value hoile valos hoy
    LOCAL_TIMESTAMP = Date.now(); // eita local hoilei valo may be

    data = JSON.parse(event.data);
    if (data["type"] == "info"){
        Task.__id__ = data["current_id"];
    }
    else if (data["type"] == "instruction"){
        if(data["instruction"] == "create_new"){
            new Task(data["title"], data["id"])
        }
        else if(data["instruction"] == "change_id"){
            old_id = data["old_id"];
            new_id = data["new_id"];
            if(old_id != new_id){
                Task.tasks[old_id].id = new_id;
                Task.tasks[new_id] = Task.tasks[old_id]; // if there's any conflict then will have to take of that too
                delete Task.tasks[old_id];
                if(Task.__id__ == old_id) Task.__id__ = new_id;
            }
        }
        else if(data["instruction"] == "state change"){
            id = data["id"];
            new_state = data["new_state"];
            t = Task.tasks[id]; // mismatch can happen, then will have to handle that too..
            if (new_state == 1){
                if(t.state == 0){
                    t.start(data['ts']);
                }
                else t.resume(data['ts']);
            }
            else if(new_state == 2){
                t.pause(data['ts']);
            }
            else t.stop(data['ts']);
        }
    }
}

ws.onclose = function(event){
    console.log("[*] server dead")
}

function add_task(){
    t = new Task();
    
    ws.send(JSON.stringify({
        "type": "instruction",
        "instruction":  "create_new",
        "title": t.title,
        "id": t.id
    }));
}



function send_state_change(new_state, ts) {
    ws.send(JSON.stringify({
        "type": "instruction",
        "instruction":  "state change",
        "id": t.id,
        "new_state": new_state,
        "ts": ts
    }));
}






function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mill_to_dur(ms){
    let s = ms/1000;
    let min = s/60;
    let hr = min/60;
    return Math.floor(hr)+":"+Math.floor(min)+":"+Math.floor(s);
}

async function loop(){
    while (true){
        await sleep(500)
        for (let id in Task.tasks){
            t = Task.tasks[id];
            if(t.state == 1){
                let d = t.calculate_duration();
                t.dur.innerText = mill_to_dur(d);
            }
        }
    }
}


async function main(){
    let prom = new Promise(loop)
}

main();
