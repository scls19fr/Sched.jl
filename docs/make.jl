using Documenter
using Sched


makedocs(
    format = :html,
    sitename = "Sched.jl",
    pages = [
        "index.md",
    ]
)

deploydocs(
    repo = "github.com/scls19fr/Sched.jl",
    julia  = "0.6",
    latest = "master",
    target = "build",
    deps = nothing,  # we use the `format = :html`, without `mkdocs`
    make = nothing,  # we use the `format = :html`, without `mkdocs`
)
