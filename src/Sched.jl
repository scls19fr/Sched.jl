"""
A generally useful event scheduler class.
Each instance of this class manages its own queue.
No multi-threading is implied; you are supposed to hack that
yourself, or use a single instance per application.
Each instance is parametrized with two functions, one that is
supposed to return the current time, one that is supposed to
implement a delay.    You can implement real-time scheduling by
substituting time and sleep from built-in module time, or you can
implement simulated time by writing your own functions.    This can
also be used to integrate scheduling with STDWIN events; the delay
function is allowed to modify the queue.    Time can be expressed as
integers or floating point numbers, as long as it is consistent.
Events are specified by tuples (time, priority, action, argument, kwargs).
As in UNIX, lower priority numbers mean higher priority; in this
way the queue can be maintained as a priority queue.    Execution of the
event means calling the action function, passing it the argument
sequence in "argument" (remember that in Python, multiple function
arguments are be packed in a sequence) and keyword parameters in "kwargs".
The action function may be an instance method so it
has another way to reference private data (besides global variables).
"""

module Sched

    export Scheduler, enter, enterabs

    using DataStructures: PriorityQueue, peek, dequeue!

    """
    Abstract type for struct that returns real-time or simulated time
    when called (functor)
    """
    abstract type TimeFunc end

    """
    Functor that returns real-time as DateTime (UTC) when called
    """
    struct UTCTimeFunc <: TimeFunc
        func::Function
        args

        UTCTimeFunc() = new(now, [Dates.UTC])
    end
    function (timefunc::UTCTimeFunc)()
        timefunc.func(timefunc.args...)
    end

    """
    Default time function
    """
    # Time as Float64
    #_time = time

    # Time as DateTime (UTC)
    _time = UTCTimeFunc()

    """
    Event struct
    """
    struct Event
        time_    # Numeric type compatible with the return value of the timefunc function passed to the constructor.'
        priority # Events scheduled for the same time will be executed in the order of their priority.
        action   # Executing the event means executing action(args...; kwargs...)
        args     # args is a sequence holding the positional arguments for the action.
        kwargs   # kwargs is a dictionary holding the keyword arguments for the action.

        """
        Initialize an event struct
        """
        Event(time_, priority, action, args...; kwargs...) = new(time_, priority, action, args, kwargs)
    end
    run(event::Event) = event.action(event.args...; event.kwargs...)

    struct Scheduler
        timefunc::TimeFunc
        delayfunc::Function

            _queue::PriorityQueue
            _lock::ReentrantLock

            """
            Initialize a new Scheduler instance, passing optionaly
            the time and delay functions
            """
            function Scheduler(; timefunc=_time, delayfunc=sleep)
                q = PriorityQueue{Event, Priority}(Base.Order.Reverse)
                l = ReentrantLock()
                new(timefunc, delayfunc, q, l)
            end
    end

    """
    Priority of events
    """
    struct Priority
        time_
        priority
    end
    function Base.isless(p1::Sched.Priority, p2::Sched.Priority)
        if p1.time_ > p2.time_
            true
        elseif p1.time_ < p2.time_
            false
        else
            p1.priority > p2.priority
        end
    end

    """
    Enter a new event in the queue at an absolute time.
    Returns an ID for the event which can be used to remove it,
    if necessary.
    """
    function enterabs(sched::Scheduler, time_, priority, action, args...; kwargs...)
        #println("enterabs $sched $time_ $priority $action with args=$args kwargs=$kwargs")
        event = Event(time_, priority, action, args...; kwargs...)
        l = sched._lock
        lock(l)
        try
            sched._queue[event] = Priority(time_, priority)
        finally
            unlock(sched._lock)
        end
    end

    """
    Enter a new event in the queue at a relative time.
    A variant of enterabs that specifies the time as a relative time.
    This is actually the more commonly used interface.
    """
    function enter(sched::Scheduler, delay, priority, action, args...; kwargs...)
        next_time = sched.timefunc() + delay
        enterabs(sched, next_time, priority, action, args...; kwargs...)
    end

    """
    Execute events until the queue is empty.
    If blocking is False executes the scheduled events due to
    expire soonest (if any) and then return the deadline of the
    next scheduled call in the scheduler.
    When there is a positive delay until the first event, the
    delay function is called and the event is left in the queue;
    otherwise, the event is removed from the queue and executed
    (its action function is called, passing it the argument).  If
    the delay function returns prematurely, it is simply
    restarted.
    It is legal for both the delay function and the action
    function to modify the queue or to raise an exception;
    exceptions are not caught but the scheduler's state remains
    well-defined so run() may be called again.
    A questionable hack is added to allow other threads to run:
    just after an event is executed, a delay of 0 is executed, to
    avoid monopolizing the CPU when other threads are also
    runnable.
    """
    function Base.run(sched::Scheduler; blocking=true)
        l = sched._lock
        q = sched._queue
        delayfunc = sched.delayfunc
        timefunc = sched.timefunc
        while(true)
            lock(l)
            if length(q) == 0
                break
            end
            next_event, priority = peek(q)
            now_ = timefunc()
            if next_event.time_ > now_
                delay = true
            else
                delay = false
                event = dequeue!(q)
            end
            unlock(l)
            if delay
                if !blocking
                        return next_event.time_ - now_
                end
                delayfunc(next_event.time_ - now_)
            else
                run(event)
                delayfunc(0)     # Let other threads run
            end
        end
    end

    """
    Remove an event from the queue.
    This must be presented the ID as returned by enter().
    If the event is not in the queue, this raises ValueError.
    """
    function cancel(sched::Scheduler, event::Event)
        error("NotImplemented")
    end

    """
    Check whether the queue is empty.
    """
    function empty(sched::Scheduler)
        error("NotImplemented")
    end

    """
    An ordered list of upcoming events.
    """
    function queue(sched::Scheduler)
        error("NotImplemented")
    end

end # module
