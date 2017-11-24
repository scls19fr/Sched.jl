# Sched.jl

A [Julia](https://julialang.org/) event scheduler inspired by [Python sched](https://docs.python.org/3/library/sched.html).

```@meta
CurrentModule = Sched
```

```@docs
Sched
```

## Install

```julia
Pkg.clone("https://github.com/scls19fr/Sched.jl")
```

## Usage

[See example](../../sample/sample.jl)

## Contents

```@contents
Pages = [
    "index.md",
]
```

## Syntax

```@docs
Scheduler
```

```@docs
enterabs
```

```@docs
enter
```

```@docs
cancel
```

```@docs
isempty
```

```@docs
Sched.run
```

```@docs
queue
```

## Package Internals
```@docs
Event
```

```@docs
Priority
```

```@docs
TimeFunc
```

```@docs
UTCDateTimeFuncStruct
```

```@docs
FloatTimeFuncStruct
```

## See also
 - [https://discourse.julialang.org/t/julia-cron-like-event-scheduler/6899](https://discourse.julialang.org/t/julia-cron-like-event-scheduler/6899)
