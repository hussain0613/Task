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
            await websocket.send_json({"message": "yo", "data": data})
            
            for i in sockets:
                if sockets[i]!=websocket:
                    await sockets[i].send_json({"message": data, "from": id})
    
    except WebSocketDisconnect as err:
        sockets.pop(id)
        for i in sockets:
            if sockets[i]!=websocket:
                await sockets[i].send_json({"message": f"[*] {id} disconnected"})