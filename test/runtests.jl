using Sched
using Sched: Priority
using Base.Test

function print_time()
    println("From print_time $(time())")
end

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
            t0 = _time()
            println(t0)
            enter(s, Dates.Second(10), 1, print_time_noparam)
            enter(s, Dates.Second(5), 2, print_time_args, ("positional, argument"))
            enter(s, Dates.Second(5), 1, print_time_kwargs; Dict(:a=>"keyword")...)
            run(s)
            t1 = _time()
            println(t1)
            t1 - t0
        end

        delta_t = print_some_times()
        @test delta_t >= Dates.Second(10)
        @test delta_t < Dates.Second(11)

    end;


    @testset "empty" begin
        s = Scheduler()
        @test isempty(s)
        enter(s, Dates.Second(10), 0, print_time)
        @test !isempty(s)
    end;

    @testset "cancel" begin
        s = Scheduler()
        event = enter(s, Dates.Second(10), 0, print_time)
        @test !isempty(s)
        cancel(s, event)
        @test isempty(s)
    end;

    # @testset "queue" begin
    # end;

end;
