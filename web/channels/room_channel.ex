defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel
  alias Itemli.{Article, Tag, TagArticle, Layout}
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

  defp hash_exist(user, new_hash) do
    
    ly = Layout
    |> select([:hash])
    |> where(user_id: ^user.id)
    |> order_by(desc: :inserted_at)
    |> limit(1)
    |> Repo.one

    case ly do
      %{"hash": current_hash} ->
        cond do
          current_hash !== new_hash -> :false
          :true -> :true
        end
      _ -> :false
    end
    
  end

  def handle_in("layout:save", %{"hash" => hash, "layout" => layout}, socket) do
    user = socket.assigns.user

    case hash_exist(user, hash) do
      :false ->
        user
        |> build_assoc(:layouts)
        |> Layout.changeset(%{hash: hash, layout: layout})
        |> Repo.insert 

        recs_count = Repo.one(from ly in "layouts", select: count(ly.id), where: ly.user_id == type(^user.id, :binary_id) )

        max_layout_count = 3 # feature plan - create users options

        cond do
          recs_count > max_layout_count ->
            count_delete = recs_count - max_layout_count
            for_delete = Layout
            |> where(user_id: ^user.id)
            |> order_by(asc: :inserted_at)
            |> limit(^count_delete)
            |> Repo.all
            
            Enum.map(for_delete, fn(ly) -> Repo.delete(ly) end )
          :true ->
            
        end
          
        {:reply, {:ok, %{message: "Layout saved."}}, socket}
      _ ->
        {:reply, {:ok, %{message: "Layout exist."}}, socket}
    end

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