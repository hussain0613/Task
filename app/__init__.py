from fastapi import FastAPI, WebSocket, Request, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/statics", app=StaticFiles(directory="app/statics"), name="statics")
templates = Jinja2Templates("app/templates")


@app.get("/")
async def get(request:Request):
    return templates.TemplateResponse("ok.html", context = {'request': request})


websockets = []
@app.websocket("/ws")
async def websocket_endpoint(uname, websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text(f"[*] welcome {uname}")
    websockets.append(websocket)
    for ws in websockets:
        if(ws != websocket): await ws.send_text(f"[*] {uname} has joined")
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"You: {data}")
            for ws in websockets:
                if(ws != websocket): await ws.send_text(f"{uname}: {data}")
    except WebSocketDisconnect as err:
        websockets.remove(websocket)
        for ws in websockets:
            await ws.send_text(f"[*] {uname} disconnect")