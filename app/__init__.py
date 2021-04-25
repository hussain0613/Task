from .models import Task

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount(path="/statics", app = StaticFiles(directory="app/statics"), name="statics")
templates = Jinja2Templates(directory="app/templates")

_id_ = 0
sockets: dict[int, WebSocket] = {}


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse(name="task.html", context={"request": request})



@app.websocket("/ws")
async def hanled_socket(websocket:WebSocket):
    await websocket.accept()
    global _id_
    _id_+=1
    id = _id_
    sockets[id] = websocket
    
    await websocket.send_json({"message": f"[*] connection established as {id}"})
    
    for i in sockets:
        if sockets[i]!=websocket:
            await sockets[i].send_json({"message": f"[*] {id} joined"})
    try:
        while True:
            data = await websocket.receive_json()
            if(data.get('type') == "instruction"):
                if data.get('instruction') == "create_new":
                    t = Task(title=data.get('title'))
                    await websocket.send_json({"type": "instruction", "instruction":"change_id", "old_id":data['id'], 'new_id':t.id})
                    data['id'] = t.id
                elif data.get('instruction') == "state change":
                    
                    id = data["id"]
                    new_state = data["new_state"]
                    t = Task.tasks[id]; # mismatch can happen, then will have to handle that too..
                    if (new_state == 1):
                        if(t.state == 0):
                            t.start(data['ts'])
                        
                        else: t.resume(data['ts'])
                    elif(new_state == 2):
                        t.pause(data['ts'])
                    else: t.stop(data['ts'])

            for i in sockets:
                if sockets[i]!=websocket:
                    await sockets[i].send_json(data)
    
    except WebSocketDisconnect as err:
        sockets.pop(id)
        for i in sockets:
            if sockets[i]!=websocket:
                await sockets[i].send_json({"message": f"[*] {id} disconnected"})