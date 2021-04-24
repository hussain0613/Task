from __future__ import annotations
import typing
import time

class Task:
    __modelname__: str = 'Task'
    __id__:typing.ClassVar[int] = 0
    tasks: typing.ClassVar[typing.Dict[int, Task]] = {}

    # id: int
    # supertask: Task = None
    # subtasks: typing.List[Task] = None
    # timestamps: typing.List[int] = [] ## first one means start_time, after that every odd numbered time means pause time and even
    #                              ## numbered time means resueme time (indexing from 0), however if state == 3 last one means end time
    # title: str = None
    # details: str = None
    # tags: typing.List[str] = []## example study, entertainment, physic, coding etc
    # duration: int = 0 ## or float or timedelta
    # state: int  = 0## possible values = uninitialized, active, paused, ended (0, 1, 2 3)

    def __init__(self, title:typing.Optional[str] = None, supertask: typing.optional[Task] = None, from_dict:bool = False):
        if not from_dict:
            Task.__id__ += 1
            self.id = Task.__id__
            Task.tasks[self.id] = self
        
        if not title:
            self.title = f"Task-{self.id}"
        else:
            self.title = title


        self.supertask: Task = None
        self.subtasks: typing.List[Task] = None
        self.timestamps: typing.List[int] = [] ## first one means start_time, after that every odd numbered time means pause time and even
                                          ## numbered time means resueme time (indexing from 0), however if state == 3 last one means end time
        self.details: str = None
        self.tags: typing.List[str] = []## example study, entertainment, physic, coding etc
        self.duration: int = 0 ## or float or timedelta
        self.state: int  = 0## possible values = uninitialized, active, paused, ended (0, 1, 2 3)

    def start(self):
        if self.state == 0:
            self.timestamps.append(time.time_ns())
            self.state = 1
        else:
            raise Exception(f"Task-{self.id} already started before")

    def pause(self):
        if self.state == 1:
            self.timestamps.append(time.time_ns())
            self.state = 2
        else:
            raise Exception(f"Task-{self.id} not active")

    def resume(self):
        if self.state == 2:
            self.timestamps.append(time.time_ns())
            self.state = 1
        else:
            raise Exception(f"Task-{self.id} is not paused")


    def end(self):
        if self.state == 3:
            raise Exception(f"Task-{self.id} already ended")
        
        self.timestamps.append(time.time_ns())
        self.state = 3

    def calculate_duration(self):
        if self.state == 3 and len(self.timestamps) == 1:
            self.duration = 0
            return self.duration

        d = 0
        for i in range(1, len(self.timestamps), 2):
            d += self.timestamps[i] - self.timestamps[i-1]

        if self.state == 1: ## if true, that means it is still running
            if len(self.timestamps)%2 == 0:
                raise Excepion("Continuation Error") ## it must have ended or be puased
            else:
                d += time.time_ns() - self.timestamps[-1]

        self.duration = d
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

    def __repr__(self):
        return f"Task<id={self.id}, title={self.title}, state={self.state}, duration={self.calculate_duration()}>"

    def to_dict(self):
        d = {
            'id' : self.id,
            'title' : self.title,
            'timestamps': self.timestamps,
            'details': self.details,
            'tags': self.tags,
            'state': self.state,
            'duration': self.calculate_duration()
        }
        return d
    

    def from_dict(task_dict:dict):
        task = Task(task_dict[title], from_dict=True)
        task.id = task_dict['id']
        task.timestamps = task_dict['timestamps']
        task.details = task_dict['details']
        task.tags = task_dict['tags']
        task.state = task_dict['state']
        task.duration = task_dict['duration']

        return task
