var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Sched.jl",
    "title": "Sched.jl",
    "category": "page",
    "text": ""
},

{
    "location": "#Sched.Sched",
    "page": "Sched.jl",
    "title": "Sched.Sched",
    "category": "module",
    "text": "A generally useful event scheduler class. Each instance of this class manages its own queue. No multi-threading is implied; you are supposed to hack that yourself, or use a single instance per application. Each instance is parametrized with two functions, one that is supposed to return the current time, one that is supposed to implement a delay.    You can implement real-time scheduling by substituting time and sleep from built-in module time, or you can implement simulated time by writing your own functions.    This can also be used to integrate scheduling with STDWIN events; the delay function is allowed to modify the queue.    Time can be expressed as integers or floating point numbers, as long as it is consistent. Events are specified by tuples (time, priority, action, argument, kwargs). As in UNIX, lower priority numbers mean higher priority; in this way the queue can be maintained as a priority queue.    Execution of the event means calling the action function, passing it the argument sequence in \"argument\" (remember that in Python, multiple function arguments are be packed in a sequence) and keyword parameters in \"kwargs\". The action function may be an instance method so it has another way to reference private data (besides global variables).\n\n\n\n\n\n"
},

{
    "location": "#Sched.jl-1",
    "page": "Sched.jl",
    "title": "Sched.jl",
    "category": "section",
    "text": "A Julia event scheduler inspired by Python sched.CurrentModule = SchedSched"
},

{
    "location": "#Install-1",
    "page": "Sched.jl",
    "title": "Install",
    "category": "section",
    "text": "Sched is a registered package. To add it to your Julia packages, simply do the following in REPL:Pkg.add(\"Sched\")"
},

{
    "location": "#Usage-1",
    "page": "Sched.jl",
    "title": "Usage",
    "category": "section",
    "text": "Markdown.parse(\"\"\"\n```julia\n$(readstring(\"sample/sample.jl\"))\n```\n\"\"\")Download example"
},

{
    "location": "#Contents-1",
    "page": "Sched.jl",
    "title": "Contents",
    "category": "section",
    "text": "Pages = [\n    \"index.md\",\n]"
},

{
    "location": "#Sched.Scheduler",
    "page": "Sched.jl",
    "title": "Sched.Scheduler",
    "category": "type",
    "text": "Scheduler(; timefunc=_time, delayfunc=sleep)\n\nInitialize a new Scheduler instance, passing optionaly the time and delay functions\n\nThe scheduler struct defines a generic interface to scheduling events.  It needs two functions to actually deal with the “outside world”\n\nThe timefunc should be callable without arguments, and return a number (the “time”, in any units whatsoever). timefunc default is UTCDateTimeFunc.\nThe delayfunc function should be callable with one argument, compatible  with the output of timefunc, and should delay that many time units. delayfunc  will also be called with the argument 0 after each event is run to allow other threads an opportunity to run in multi-threaded applications.\n\n\n\n\n\n"
},

{
    "location": "#Sched.enterabs",
    "page": "Sched.jl",
    "title": "Sched.enterabs",
    "category": "function",
    "text": "enterabs(sched, time_, priority, action, args...; kwargs...)\n\nEnter a new event in the queue at an absolute time. Returns an ID for the event which can be used to remove it, if necessary.\n\n\n\n\n\n"
},

{
    "location": "#Sched.enter",
    "page": "Sched.jl",
    "title": "Sched.enter",
    "category": "function",
    "text": "enter(sched, delay, priority, action, args...; kwargs...)\n\nEnter a new event in the queue at a relative time. A variant of enterabs that specifies the time as a relative time. This is actually the more commonly used interface.\n\n\n\n\n\n"
},

{
    "location": "#Sched.cancel",
    "page": "Sched.jl",
    "title": "Sched.cancel",
    "category": "function",
    "text": "cancel(sched, event)\n\nRemove an event from the queue. This must be presented the ID as returned by enter(). If the event is not in the queue, this raises ValueError.\n\n\n\n\n\n"
},

{
    "location": "#Base.isempty",
    "page": "Sched.jl",
    "title": "Base.isempty",
    "category": "function",
    "text": "isempty(collection) -> Bool\n\nDetermine whether a collection is empty (has no elements).\n\nExamples\n\njulia> isempty([])\ntrue\n\njulia> isempty([1 2 3])\nfalse\n\n\n\n\n\nisempty(cb)\n\nTest whether the buffer is empty.\n\n\n\n\n\nisempty(sched) -> Bool\n\nCheck whether the queue is empty.\n\n\n\n\n\n"
},

{
    "location": "#Base.run",
    "page": "Sched.jl",
    "title": "Base.run",
    "category": "function",
    "text": "run(command, args...; wait::Bool = true)\n\nRun a command object, constructed with backticks. Throws an error if anything goes wrong, including the process exiting with a non-zero status (when wait is true).\n\nIf wait is false, the process runs asynchronously. You can later wait for it and check its exit status by calling success on the returned process object.\n\nWhen wait is false, the process\' I/O streams are directed to devnull. When wait is true, I/O streams are shared with the parent process. Use pipeline to control I/O redirection.\n\n\n\n\n\nrun(sched; blocking=true)\n\nExecute events until the queue is empty. If blocking is False executes the scheduled events due to expire soonest (if any) and then return the deadline of the next scheduled call in the scheduler. When there is a positive delay until the first event, the delay function is called and the event is left in the queue; otherwise, the event is removed from the queue and executed (its action function is called, passing it the argument).  If the delay function returns prematurely, it is simply restarted. It is legal for both the delay function and the action function to modify the queue or to raise an exception; exceptions are not caught but the scheduler\'s state remains well-defined so run() may be called again. A questionable hack is added to allow other threads to run: just after an event is executed, a delay of 0 is executed, to avoid monopolizing the CPU when other threads are also runnable.\n\n\n\n\n\n"
},

{
    "location": "#Sched.queue",
    "page": "Sched.jl",
    "title": "Sched.queue",
    "category": "function",
    "text": "queue(sched)\n\nReturn an ordered list of upcoming events.\n\n\n\n\n\n"
},

{
    "location": "#Syntax-1",
    "page": "Sched.jl",
    "title": "Syntax",
    "category": "section",
    "text": "SchedulerenterabsentercancelisemptySched.runqueue"
},

{
    "location": "#Sched.Event",
    "page": "Sched.jl",
    "title": "Sched.Event",
    "category": "type",
    "text": "Event(time_, priority, action, args...; kwargs...)\n\nEvent structure\n\ntime_: Numeric type compatible with the return value of the timefunc function passed to the constructor.\'\npriority: Events scheduled for the same time will be executed in the order of their priority.\naction: Executing the event means executing action(args...; kwargs...)\nargs: args is a sequence holding the positional arguments for the action.\nkwargs: kwargs is a dictionary holding the keyword arguments for the action.\n\n\n\n\n\n"
},

{
    "location": "#Sched.Priority",
    "page": "Sched.jl",
    "title": "Sched.Priority",
    "category": "type",
    "text": "Priority(time_, priority)\n\nPriority of events\n\n\n\n\n\n"
},

{
    "location": "#Sched.TimeFunc",
    "page": "Sched.jl",
    "title": "Sched.TimeFunc",
    "category": "type",
    "text": "Abstract type for struct that returns real-time or simulated time when called (functor)\n\n\n\n\n\n"
},

{
    "location": "#Sched.UTCDateTimeFuncStruct",
    "page": "Sched.jl",
    "title": "Sched.UTCDateTimeFuncStruct",
    "category": "type",
    "text": "UTCDateTimeFuncStruct()\n\nFunctor that return real-time as DateTime (UTC) when called\n\n\n\n\n\n"
},

{
    "location": "#Sched.FloatTimeFuncStruct",
    "page": "Sched.jl",
    "title": "Sched.FloatTimeFuncStruct",
    "category": "type",
    "text": "FloatTimeFuncStruct()\n\nFunctor that return real-time as Float when called\n\n\n\n\n\n"
},

{
    "location": "#Package-Internals-1",
    "page": "Sched.jl",
    "title": "Package Internals",
    "category": "section",
    "text": "EventPriorityTimeFuncUTCDateTimeFuncStructFloatTimeFuncStruct"
},

{
    "location": "#See-also-1",
    "page": "Sched.jl",
    "title": "See also",
    "category": "section",
    "text": "ExtensibleScheduler.jl a more advanced and extensible Julia events scheduler\nhttps://discourse.julialang.org/t/julia-cron-like-event-scheduler/6899"
},

]}
