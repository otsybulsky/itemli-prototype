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

  defp get_layout(user) do
    Layout
    |> where(user_id: ^user.id)
    |> order_by(desc: :inserted_at)
    |> limit(1)
    |> Repo.one

  end

  defp hash_exist(user, new_hash) do    
    case get_layout(user) do
      %{"hash": current_hash} ->
        cond do
          current_hash !== new_hash -> :false
          :true -> :true
        end
      _ -> :false
    end    
  end

  defp restrict_layouts_history(user) do
    recs_count = Repo.one(
      from ly in "layouts",
      select: count(ly.id), 
      where: ly.user_id == type(^user.id, :binary_id) 
    )
    
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
  end

  def handle_in("layout:save", %{"hash" => hash, "layout" => layout}, socket) do
    user = socket.assigns.user

    case hash_exist(user, hash) do
      :false ->
        ly = user
        |> build_assoc(:layouts)
        |> Layout.changeset(%{hash: hash, layout: layout})

        case Repo.insert(ly) do
          {:ok, _layout} ->
            restrict_layouts_history(user)
            broadcast_from! socket, "layout:updated", %{}
            {:reply, {:ok, %{message: "Layout saved"}}, socket}
          {:error, changeset} ->
            {:reply, {:error, %{message: "Error save layout"}}, socket}
        end
      _ ->
        {:reply, {:ok, %{message: "Layout exist"}}, socket}
    end

  end


  defp get_tag_ids(tag_list) do
    tag_list
    |> Enum.map(fn item ->
      case item do
        %{"id" => id, "sub_tags" => sub_tags } ->
          t_ids = sub_tags
          |> get_tag_ids
    
         [id] ++ t_ids  
         _ ->
          []
      end
    end) 
  end

 

  def handle_in("layout:fetch", %{}, socket) do
    user = socket.assigns.user
    
    current_layout = %{}
    current_layout_tag_ids = []
    case get_layout(user) do
      %{"layout": layout} ->
        case layout do
          %{"tag_ids" => tag_list} ->
            current_layout = layout
            current_layout_tag_ids = current_layout["tag_ids"] 
            tag_ids = tag_list
            |> get_tag_ids
            |> List.flatten
          _ ->
            tag_ids =[]
        end
      _ ->
        tag_ids = []
    end
    
    tags = Tag
    |> where([t], t.user_id == type(^user.id, :binary_id))
    |> Repo.all
    |> Repo.preload([:articles])

    new_tags = Tag
    |> where([t], not(t.id in ^tag_ids) and (t.user_id == ^user.id))
    |> order_by(desc: :inserted_at)
    |> Repo.all
    |> Enum.map(fn(%{"id": id}) -> %{"id" => id, "sub_tags" => [], "collapsed" => :false} end)

    actual_layout = current_layout
    |> Map.put("tag_ids", new_tags ++ current_layout_tag_ids)

    tags = Enum.map(tags, fn(tag) -> 
      %{id: tag.id, title: tag.title, description: tag.description, articles_count: Enum.count(tag.articles)} 
    end)

    # {:noreply, socket}
    {:reply, {:ok, %{layout: actual_layout, tags: tags}}, socket}
  end

  def handle_in("articles:fetch", %{"tag_id" => tag_id}, socket) do
    user = socket.assigns.user

    tag = Tag
    |> where([t], (t.id == ^tag_id) and (t.user_id == ^user.id))    
    |> Repo.one
    |> Repo.preload([:articles])

    case tag.articles_index do
      %{"index" => article_ids} ->
        kw_articles = tag.articles
        |> Enum.map fn(article) -> {String.to_atom(article.id), article} end
        
        articles = article_ids
        |> Enum.map fn(article_id) ->
          article = kw_articles[String.to_atom(article_id)] 
        end

        ids_exists = article_ids
        |> Enum.map fn(article_id) ->
          String.to_atom(article_id) 
        end

        kw_articles = Keyword.drop(kw_articles, ids_exists)
        articles_without_index = Keyword.to_list(kw_articles)
        
        articles = articles ++ articles_without_index
      _ ->
        articles = tag.articles
    |> Enum.map(fn (article) -> %{"id" => article.id, "title" => article.title, "url" => article.url, "favicon" => article.favicon, "description" => article.description  } end)
    end
    
    
    {:reply, {:ok, %{articles: articles, tag_id: tag.id}}, socket}
  end

  def handle_in("tag:reorder_articles", %{"tag_id" => tag_id, "article_ids" => article_ids}, socket) do
    user = socket.assigns.user
    
    cs = Repo.get(Tag, tag_id)
    |> Ecto.Changeset.change( articles_index: article_ids)

    case Repo.update cs do
      {:ok, struct}       -> # Updated with success
        broadcast_from! socket, "articles_index:updated", %{tag_id: tag_id}
        :ok  
      {:error, changeset} -> # Something went wrong  
        :error
    end
    {:noreply, socket}
  end

  def handle_in("tag:edit", params, socket) do
    user = socket.assigns.user

    case params do
      %{"tag_id" => tag_id, "title" => title, "description" => description} ->  
        #update tag
        
        cs = Repo.get(Tag, tag_id)
        |> Ecto.Changeset.change( title: title, description: description)
        case Repo.update cs do
          {:ok, tag}       -> # Updated with success
            {:reply, {:ok, %{id: tag.id}},socket}
          {:error, changeset} -> # Something went wrong  
          {:reply, {:error, %{message: "DB error"}}, socket}    
        end

      %{"title" => title, "description" => description} ->
        #insert new tag
        new_tag = user
        |> build_assoc(:tags)
        |> Tag.changeset(%{title: title, description: description })
        case Repo.insert(new_tag) do
          {:ok, tag} ->
            {:reply, {:ok, %{id: tag.id}},socket}
          {:error, reason} ->
            {:reply, {:error, %{errors: reason}}, socket}  
        end
      _ -> 
        {:reply, {:error, %{message: "Bad params"}}, socket}
    end
  end

  def handle_in("tabs:add", %{"tabs" => content, "tag_title" => tag_title}, socket) do

    user = socket.assigns.user

    new_tag = user
    |> build_assoc(:tags)
    |> Tag.changeset(%{title: tag_title})
    
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