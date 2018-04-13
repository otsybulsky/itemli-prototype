defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel
  alias Itemli.{Article, Tag, TagArticle, Interface}
  alias Ecto.Multi

  def join("room:" <> _room_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("tags:fetch", _params, socket) do
    user = socket.assigns.user

    tags = Tag.roots
    |> Repo.all where: user_id = user.id

    tags_ids = tags
    |> Enum.map(fn(%{"id": tag_id}) -> %{id: tag_id} end)

    {:reply, {:ok, %{tag_ids: tags_ids, tags: tags}}, socket}
  end

  def handle_in("layout:save", %{"hash" => hash, "layout" => layout}, socket) do
    user = socket.assigns.user

    user
    |> build_assoc(:interfaces)
    |> Interface.changeset(%{hash: hash, store: layout})
    |> Repo.insert

    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("tabs:add", %{"content" => content}, socket) do

    user = socket.assigns.user

    new_tag = user
    |> build_assoc(:tags)
    |> Tag.changeset(%{title: DateTime.to_string(DateTime.utc_now())})
    
    batch = Multi.new()
    |> Multi.insert(:tag, new_tag) 
    |> Multi.run(:save_articles, fn %{tag: tag} ->
      articles = for %{"title" => title, "url" => url, "favIconUrl" => favicon} <- content do
        article = user
        |> build_assoc(:articles)
        |> Article.changeset(%{tag: [tag], title: title, url: url, favicon: favicon})
        |> Repo.insert
      end
      {:ok, tag }
    end)
    
    case Repo.transaction(batch) do
        {:ok, tag} ->
          result = tag.save_articles
          broadcast! socket, "tabs:added", %{content: result}
          {:reply, {:ok, %{content: result}},socket}


        {:error, reason} ->
          {:reply, {:error, %{errors: reason}}, socket}     
    end

  end
  
end