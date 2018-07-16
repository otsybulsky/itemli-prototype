defmodule MetaInspector do
  use GenServer
  alias Itemli.Endpoint

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, [])
  end

  def init(_) do
    {:ok, nil}
  end

  def handle_call(%{:url => link, :user_id => user_id}, _from, state) do
    
    request = "https://head-meta.gigalixirapp.com/?url="<>link
    
    case HTTPoison.get request do
      {:ok, response} ->
        result =  Poison.Parser.parse(response.body)
        Endpoint.broadcast("room:" <> user_id, "meta_inspector", %{body: response.body})
        {:reply, result, state}
      _ -> 
        result = %{}  
        {:reply, result, state}
    end

    
  end

end