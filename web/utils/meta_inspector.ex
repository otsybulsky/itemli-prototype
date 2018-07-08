defmodule Itemli.MetaInspector do
  
  @moduledoc false

  def get_info(link) do
    request = "https://head-meta.gigalixirapp.com/?url="<>link
    
    case HTTPoison.get request do
      {:ok, response} ->
        IO.puts "--------------------------------------------"
        IO.inspect Poison.Parser.parse(response.body)
        %{} 
      _ -> %{}  
    end
    
  end

end