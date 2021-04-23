from __future__ import annotations
import typing
import time

class Task:
    __modelname__: str = 'Task'
    __id__:typing.ClassVar[int] = 0

    # id: int
    # supertask: Task = None
    # subtasks: typing.List[Task] = None
    # timestamps: typing.List[int] = [] ## first one means start_time, after that every odd numbered time means pause time and even
    #                              ## numbered time means resueme time (indexing from 0), however if state == 3 last one means end time
    # title: str = None
    # details: str = None
    # tags: typing.List[str] = []## example study, entertainment, physic, coding etc
    # total_duration: int = 0 ## or float or timedelta
    # state: int  = 0## possible values = uninitialized, active, paused, ended (0, 1, 2 3)

    def __init__(self, title:typing.Optional[str] = None, supertask: typing.optional[Task] = None):
        Task.__id__ += 1
        self.id = Task.__id__
        if not title:
            self.title = f"Task-{self.id}"


        self.supertask: Task = None
        self.subtasks: typing.List[Task] = None
        self.timestamps: typing.List[int] = [] ## first one means start_time, after that every odd numbered time means pause time and even
                                          ## numbered time means resueme time (indexing from 0), however if state == 3 last one means end time
        self.details: str = None
        self.tags: typing.List[str] = []## example study, entertainment, physic, coding etc
        self.total_duration: int = 0 ## or float or timedelta
        self.state: int  = 0## possible values = uninitialized, active, paused, ended (0, 1, 2 3)

    def start(self):
        if self.state == 0:
            self.timestamps.append(time.time_ns())
            self.state = 1
        else:
            raise Exception("Task already started before")

    def pause(self):
        if self.state == 1:
            self.timestamps.append(time.time_ns())
            self.state = 2
        else:
            raise Exception("Task not active")

    def resume(self):
        if self.state == 2:
            self.timestamps.append(time.time_ns())
            self.state = 1
        else:
            raise Exception("Task is not paused")


    def end(self):
        if self.state == 3:
            raise Exception("Task already ended")
        
        self.timestamps.append(time.time_ns())
        self.state = 3

    def calculate_duration(self):
        if self.state == 3 and len(self.timestamps) == 1:
            self.total_duration = 0
            return self.total_duration

        d = 0
        for i in range(1, len(self.timestamps), 2):
            d += self.timestamps[i] - self.timestamps[i-1]

        if self.state == 1: ## if true, that means it is still running
            if len(self.timestamps)%2 == 0:
                raise Excepion("Continuation Error") ## it must have ended or be puased
            else:
                d += time.time() - self.timestamps[-1]

        self.total_duration = d
        return d
    def add_tag(self, tag: str):
        self.tags.append(tag)
    
    def set_supertask(self, task:Task):
        pass
    def add_subtask(self, task:Task):
        pass
    

    def calculate_dur_by_tags(and_or:str, query_tags:typin.List[str]):
        """
        and_or: maane taglist er gula ke ki or kore search dibe naki and kore

        """
        pass
