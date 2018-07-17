defmodule MetaInspector do
  use GenServer
  alias Itemli.{Endpoint, Repo, Article}

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, [])
  end

  def init(_) do
    {:ok, nil}
  end

  defp check_string(str) do
    case str do
      nil ->
        :false
      _ ->  
        case str |> String.trim |> String.length do
          0 -> 
            :false
          _ ->
            :true
        end
    end
  end

  def handle_call(%{ :article => article, :user_id => user_id}, _from, state) do

    check_title = check_string(article["title"])
    check_favicon = check_string(article["favicon"])
    check_description = check_string(article["description"])
    
    case check_title && check_favicon && check_description do
      :false ->
        link = article["url"]

        if check_string(link) do
          request = "https://head-meta.gigalixirapp.com/?url="<>link  
          
          case HTTPoison.get request do
            {:ok, response} ->
              result =  Poison.Parser.parse(response.body)
              case result do
                {:ok, %{"meta" => meta}} ->
                  %{"url" => meta_url, "title" => meta_title, "favicon" => 
                  
                  meta_favicon, "description" => meta_description} = meta
                 
                  current_article = Repo.get!(Article, article["id"]) |> Repo.preload([:tags]) 

                  if current_article.updated_at === article["updated_at"] do
                    
                    changes = %{}
                    |> (fn(cs) -> 
                      case check_title do
                        :false -> Map.put_new(cs, :title, meta_title)
                        _ -> cs
                      end
                    end).()
                    |> (fn(cs) -> 
                      case check_favicon do
                        :false -> Map.put_new(cs, :favicon, meta_favicon)
                        _ -> cs
                      end
                    end).()
                    |> (fn(cs) ->
                      case check_description do
                        :false -> Map.put_new(cs, :description, meta_description)
                        _ -> cs
                      end
                    end).()
                    

                    changeset = Ecto.Changeset.change(current_article, changes)

                    case Repo.update changeset do
                      {:ok, article} ->
                        IO.puts "=========================================="
                        IO.inspect article
                        Endpoint.broadcast("room:" <> user_id, "article:updated", %{article: article})
                      _ -> nil
                    end

                  end
                _ -> nil                  
              end
            _ -> nil
          end          
        end
        
        {:reply, %{}, state}
      _ -> 
        {:reply, %{}, state}  
    end
    
  end

end