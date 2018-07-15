defmodule Itemli.MetaUpdater do
  use Task

  def start_link(_arg) do
    Task.start_link(&poll/0)
  end

  def poll() do
    receive do
    after 5_000 ->
        test()
        poll()
    end    
  end

  defp test() do
    IO.puts "Shedule for update article - #{DateTime.utc_now}"
  end

end