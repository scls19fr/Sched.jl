var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Sched.jl",
    "title": "Sched.jl",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Sched",
    "page": "Sched.jl",
    "title": "Sched",
    "category": "Module",
    "text": "A generally useful event scheduler class. Each instance of this class manages its own queue. No multi-threading is implied; you are supposed to hack that yourself, or use a single instance per application. Each instance is parametrized with two functions, one that is supposed to return the current time, one that is supposed to implement a delay.    You can implement real-time scheduling by substituting time and sleep from built-in module time, or you can implement simulated time by writing your own functions.    This can also be used to integrate scheduling with STDWIN events; the delay function is allowed to modify the queue.    Time can be expressed as integers or floating point numbers, as long as it is consistent. Events are specified by tuples (time, priority, action, argument, kwargs). As in UNIX, lower priority numbers mean higher priority; in this way the queue can be maintained as a priority queue.    Execution of the event means calling the action function, passing it the argument sequence in \"argument\" (remember that in Python, multiple function arguments are be packed in a sequence) and keyword parameters in \"kwargs\". The action function may be an instance method so it has another way to reference private data (besides global variables).\n\n\n\n"
},

{
    "location": "index.html#Sched.jl-1",
    "page": "Sched.jl",
    "title": "Sched.jl",
    "category": "section",
    "text": "A Julia event scheduler inspired by Python sched.CurrentModule = SchedSched"
},

{
    "location": "index.html#Install-1",
    "page": "Sched.jl",
    "title": "Install",
    "category": "section",
    "text": "Pkg.clone(\"https://github.com/scls19fr/Sched.jl\")"
},

{
    "location": "index.html#Usage-1",
    "page": "Sched.jl",
    "title": "Usage",
    "category": "section",
    "text": "Markdown.parse(\"\"\"\n```julia\n$(readstring(\"sample/sample.jl\"))\n```\n\"\"\")Download example"
},

{
    "location": "index.html#Contents-1",
    "page": "Sched.jl",
    "title": "Contents",
    "category": "section",
    "text": "Pages = [\n    \"index.md\",\n]"
},

{
    "location": "index.html#Sched.Scheduler",
    "page": "Sched.jl",
    "title": "Sched.Scheduler",
    "category": "Type",
    "text": "Scheduler(; timefunc=_time, delayfunc=sleep)\n\nInitialize a new Scheduler instance, passing optionaly the time and delay functions\n\nThe scheduler struct defines a generic interface to scheduling events.  It needs two functions to actually deal with the “outside world”\n\nThe timefunc should be callable without arguments, and return a number (the “time”, in any units whatsoever). timefunc default is UTCDateTimeFunc.\nThe delayfunc function should be callable with one argument, compatible  with the output of timefunc, and should delay that many time units. delayfunc  will also be called with the argument 0 after each event is run to allow other threads an opportunity to run in multi-threaded applications.\n\n\n\n"
},

{
    "location": "index.html#Sched.enterabs",
    "page": "Sched.jl",
    "title": "Sched.enterabs",
    "category": "Function",
    "text": "enterabs(sched, time_, priority, action, args...; kwargs...)\n\nEnter a new event in the queue at an absolute time. Returns an ID for the event which can be used to remove it, if necessary.\n\n\n\n"
},

{
    "location": "index.html#Sched.enter",
    "page": "Sched.jl",
    "title": "Sched.enter",
    "category": "Function",
    "text": "enter(sched, delay, priority, action, args...; kwargs...)\n\nEnter a new event in the queue at a relative time. A variant of enterabs that specifies the time as a relative time. This is actually the more commonly used interface.\n\n\n\n"
},

{
    "location": "index.html#Sched.cancel",
    "page": "Sched.jl",
    "title": "Sched.cancel",
    "category": "Function",
    "text": "cancel(sched, event)\n\nRemove an event from the queue. This must be presented the ID as returned by enter(). If the event is not in the queue, this raises ValueError.\n\n\n\n"
},

{
    "location": "index.html#Base.isempty",
    "page": "Sched.jl",
    "title": "Base.isempty",
    "category": "Function",
    "text": "isempty(collection) -> Bool\n\nDetermine whether a collection is empty (has no elements).\n\nExamples\n\njulia> isempty([])\ntrue\n\njulia> isempty([1 2 3])\nfalse\n\n\n\n"
},

{
    "location": "index.html#Base.run",
    "page": "Sched.jl",
    "title": "Base.run",
    "category": "Function",
    "text": "run(command, args...)\n\nRun a command object, constructed with backticks. Throws an error if anything goes wrong, including the process exiting with a non-zero status.\n\n\n\nrun(sched; blocking=true)\n\nExecute events until the queue is empty. If blocking is False executes the scheduled events due to expire soonest (if any) and then return the deadline of the next scheduled call in the scheduler. When there is a positive delay until the first event, the delay function is called and the event is left in the queue; otherwise, the event is removed from the queue and executed (its action function is called, passing it the argument).  If the delay function returns prematurely, it is simply restarted. It is legal for both the delay function and the action function to modify the queue or to raise an exception; exceptions are not caught but the scheduler's state remains well-defined so run() may be called again. A questionable hack is added to allow other threads to run: just after an event is executed, a delay of 0 is executed, to avoid monopolizing the CPU when other threads are also runnable.\n\n\n\n"
},

{
    "location": "index.html#Sched.queue",
    "page": "Sched.jl",
    "title": "Sched.queue",
    "category": "Function",
    "text": "queue(sched)\n\nReturn an ordered list of upcoming events.\n\n\n\n"
},

{
    "location": "index.html#Syntax-1",
    "page": "Sched.jl",
    "title": "Syntax",
    "category": "section",
    "text": "SchedulerenterabsentercancelisemptySched.runqueue"
},

{
    "location": "index.html#Sched.Event",
    "page": "Sched.jl",
    "title": "Sched.Event",
    "category": "Type",
    "text": "Event(time_, priority, action, args...; kwargs...)\n\nEvent structure\n\ntime_: Numeric type compatible with the return value of the timefunc function passed to the constructor.'\npriority: Events scheduled for the same time will be executed in the order of their priority.\naction: Executing the event means executing action(args...; kwargs...)\nargs: args is a sequence holding the positional arguments for the action.\nkwargs: kwargs is a dictionary holding the keyword arguments for the action.\n\n\n\n"
},

{
    "location": "index.html#Sched.Priority",
    "page": "Sched.jl",
    "title": "Sched.Priority",
    "category": "Type",
    "text": "Priority(time_, priority)\n\nPriority of events\n\n\n\n"
},

{
    "location": "index.html#Sched.TimeFunc",
    "page": "Sched.jl",
    "title": "Sched.TimeFunc",
    "category": "Type",
    "text": "Abstract type for struct that returns real-time or simulated time when called (functor)\n\n\n\n"
},

{
    "location": "index.html#Sched.UTCDateTimeFuncStruct",
    "page": "Sched.jl",
    "title": "Sched.UTCDateTimeFuncStruct",
    "category": "Type",
    "text": "UTCDateTimeFuncStruct()\n\nFunctor that return real-time as DateTime (UTC) when called\n\n\n\n"
},

{
    "location": "index.html#Sched.FloatTimeFuncStruct",
    "page": "Sched.jl",
    "title": "Sched.FloatTimeFuncStruct",
    "category": "Type",
    "text": "FloatTimeFuncStruct()\n\nFunctor that return real-time as Float when called\n\n\n\n"
},

{
    "location": "index.html#Package-Internals-1",
    "page": "Sched.jl",
    "title": "Package Internals",
    "category": "section",
    "text": "EventPriorityTimeFuncUTCDateTimeFuncStructFloatTimeFuncStruct"
},

{
    "location": "index.html#See-also-1",
    "page": "Sched.jl",
    "title": "See also",
    "category": "section",
    "text": "https://discourse.julialang.org/t/julia-cron-like-event-scheduler/6899"
},

]}
