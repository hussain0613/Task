# Task

```
class Task:
  Attributes:
    int id, state; // state = 0,1,2,3 = uninitialized/not started yet, running/active, paused, ended/finished
    string title, tags[], details;
    timestamp timestamps[];
    timedelta duration;

    Task supertask, subtasks[]; // !!

  Methods:
    start();
    pause();
    resume();
    end();

    calculate_duration();
    calculate_duration_by_tags(int flag/* and/or */, string tags[])

    set_supertask(Task task);
    add_subtask(Task task);
```
