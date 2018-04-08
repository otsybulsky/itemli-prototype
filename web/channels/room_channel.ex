defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel
  alias Itemli.{Article, User}

  def join("room:" <> _room_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("tabs:add", %{"content" => content}, socket) do

    user = Repo.get(User, socket.assigns.user_id)

    changesets = for %{"title" => title, "url" => url, "favIconUrl" => favicon} <- content do
      user
      |> build_assoc(:articles)
      |> Article.changeset(%{title: title, url: url, favicon: favicon})
    end

    batch = changesets
    |> Enum.with_index()
    |> Enum.reduce(Ecto.Multi.new(), 
        fn ({changeset, index}, multi) ->
          Ecto.Multi.insert(multi, Integer.to_string(index), changeset)
        end)
    
    case Repo.transaction(batch) do
        {:ok, articles} ->
          
          result = articles
          |> Map.values
          |> Enum.map fn(article) -> %{title: article.title, id: article.id} end

          broadcast! socket, "tabs:added", %{content: result}
          {:reply, {:ok, %{content: result}}, socket}
        {:error, _reason} ->
          {:reply, {:error, %{errors: _reason}}, socket}     
    end

  end
  
end