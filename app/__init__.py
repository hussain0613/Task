from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/statics", app=StaticFiles(directory="app/statics"), name="statics")
templates = Jinja2Templates("app/templates")


@app.get("/")
async def get(request:Request):
    return templates.TemplateResponse("ok.html", context = {'request': request})


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")