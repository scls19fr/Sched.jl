using Sched
using Sched: Priority
using Base.Test

@testset "Priority Tests" begin

  @testset "Priority Equality" begin
    p1 = Priority(DateTime(2010, 1, 1), 0)
    p2 = Priority(DateTime(2010, 1, 1), 0)
    @test p1 == p2
  end;

  @testset "Priority Inequality" begin
    @testset "Same DateTime" begin
      p1 = Priority(DateTime(2010, 1, 1), 0)
      p2 = Priority(DateTime(2010, 1, 1), 1)
      @test p1 != p2
    end;

    @testset "Same priority level" begin
      p1 = Priority(DateTime(2010, 1, 1), 0)
      p2 = Priority(DateTime(2010, 1, 2), 0)
      @test p1 != p2
    end;

  end;

  @testset "Priority order" begin
    p1 = Priority(DateTime(2010, 1, 2), 0)
    p2 = Priority(DateTime(2010, 1, 1), 0)
    @test p2 > p1

    p1 = Priority(DateTime(2010, 1, 1), 1)
    p2 = Priority(DateTime(2010, 1, 1), 0)
    @test p2 > p1
  end;

  @testset "Sample" begin

    s = Scheduler()

    # Time as Float64
    _time = time

    # Time as DateTime
    using Sched: UTCTimeFunc
    _time = UTCTimeFunc()


    function print_time_noparam()
        println("From print_time_noparam $(_time())")
    end

    function print_time_args(x)
        println("From print_time_args $(_time()) $x")
    end

    function print_time_kwargs(; a="default")
        println("From print_time_kwargs $(_time()) $a")
    end


    function print_some_times()
        println(_time())
        enter(s, Dates.Second(10), 1, print_time_noparam)
        enter(s, Dates.Second(5), 2, print_time_args, ("positional, argument"))
        enter(s, Dates.Second(5), 1, print_time_kwargs; Dict(:a=>"keyword")...)
        Sched.run(s)
        println(_time())
    end

    print_some_times()

  end;

end;
