ws = new WebSocket( location.origin.replace(location.protocol, "ws:") + "/ws")
document.onload = ()=>{
    ws.send(JSON.stringify({
        "type": "info",
        "current_id": Task.__id__
    }));
}

ws.onmessage = function (event){
    data = JSON.parse(event.data);
    if (data["type"] == "instruction"){
        if(data["instruction"] == "create_new"){
            
        }
        else if(data["instruction"] == "change_id"){
            old_id = data["old_id"];
            new_id = data["new_id"];
            Task.tasks[old_id].id = new_id;
            Task.tasks[new_id] = Task.tasks[old_id]; // if there's any conflict then will have to take of that too
            delete Task.tasks[old_id];
        }
        else if(data["instruction"] == "state change"){
            id = data["id"];
            new_state = data["new_state"];
            t = Task.tasks[id]; // mismatch can happen, then will have to handle that too..
            if (new_state == 1){
                if(t.state == 0){
                    t.start();
                }
                else t.resume();
            }
            else if(new_state = 2){
                t.pause();
            }
            else t.stop();
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
