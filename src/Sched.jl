module Sched

  export Scheduler, enter, enterabs

  using DataStructures: PriorityQueue, peek, dequeue!

  abstract type TimeFunc end

  struct UTCTimeFunc <: TimeFunc
    func::Function
    args

    UTCTimeFunc() = new(now, [Dates.UTC])
  end
    function (timefunc::UTCTimeFunc)()
      timefunc.func(timefunc.args...)
    end

  _time = UTCTimeFunc()


  struct Event
    time_
    priority
    action
    args
    kwargs

    Event(time_, priority, action, args...; kwargs...) = new(time_, priority, action, args, kwargs)
  end
  run(event::Event) = event.action(event.args...; event.kwargs...)

  struct Scheduler
    timefunc::TimeFunc
    delayfunc::Function

      _queue::PriorityQueue
      _lock::ReentrantLock

      function Scheduler(; timefunc=_time, delayfunc=sleep)
        q = PriorityQueue{Event, Priority}(Base.Order.Reverse)
        l = ReentrantLock()
        new(timefunc, delayfunc, q, l)
      end
  end

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

  function enter(sched::Scheduler, delay, priority, action, args...; kwargs...)
    next_time = sched.timefunc() + delay
    enterabs(sched, next_time, priority, action, args...; kwargs...)
  end

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
        delayfunc(0)   # Let other threads run
      end
    end
  end

end # module
