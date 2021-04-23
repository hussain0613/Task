# Task
class Task: <br>
  Attributes: <br>
    int id, state; // state = 0,1,2,3 = uninitialized/not started yet, running/active, paused, ended/finished <br>
    string title, tags[], details; <br>
    timestamp timestamps[]; <br>
    timedelta duration; <br><br>

    Task supertask, subtasks[]; // !!<br><br>

  Methods:<br>
    start();<br>
    pause();<br>
    resume();<br>
    end();<br><br>

    calculate_duration();<br>
    calculate_duration_by_tags(int flag /* and/or */, string tags[])<br><br>

    set_supertask(Task task);<br>
    add_subtask(Task task);<br>
