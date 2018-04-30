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

  defp get_articles_without_tag(user) do
    articles_query = from a in Article,
      where: a.user_id == type(^user.id, :binary_id),
      left_join: t in assoc(a, :tags),
      group_by: a.id,
      select: %{id: a.id, tags_count: count(t.id)}

    articles = Repo.all(articles_query)
    |> Enum.filter(fn(item) -> item.tags_count == 0 end)
    |> Enum.map(fn(item) -> item.id end)
    
  end

  def handle_in("articles:fetch_unbound", %{}, socket) do
    user = socket.assigns.user

    article_ids = get_articles_without_tag(user)
    
    articles_query = from a in Article,
      where: a.id in ^article_ids,
      order_by: [desc: a.inserted_at],
      select: %{id: a.id, title: a.title, description: a.description, url: a.url, favicon: a.favicon}
    
    articles = Repo.all(articles_query)

    {:reply, {:ok, %{articles: articles, tag_id: nil}}, socket}
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
    
    articles_without_tag = get_articles_without_tag(user) 

    tags_query = from t in Tag,
      where: t.user_id == type(^user.id, :binary_id),
      left_join: a in assoc(t, :articles),
      group_by: t.id,
      select: %{id: t.id, title: t.title, description: t.description, articles_count: count(a.id)}

    tags = Repo.all(tags_query)

    new_tags = Tag
    |> where([t], not(t.id in ^tag_ids) and (t.user_id == ^user.id))
    |> order_by(desc: :inserted_at)
    |> Repo.all
    |> Enum.map(fn(%{"id": id}) -> %{"id" => id, "sub_tags" => [], "collapsed" => :false} end)

    actual_layout = current_layout
    |> Map.put("tag_ids", new_tags ++ current_layout_tag_ids)

    {:reply, {:ok, %{layout: actual_layout, tags: tags, articles_without_tag_count: length(articles_without_tag)}}, socket}
  end

  def handle_in("articles:fetch", %{"tag_id" => tag_id}, socket) do
    user = socket.assigns.user

    tag = Tag
    |> where([t], (t.id == ^tag_id) and (t.user_id == ^user.id))    
    |> Repo.one
    |> Repo.preload([:articles])

    art_ids = tag.articles
    |> Enum.map(fn(article) -> article.id end)

    article_list = Article
    |> where([t], (t.id in ^art_ids))
    |> Repo.all
    |> Repo.preload([:tags])   
    
    

    case tag.articles_index do
      %{"index" => article_ids} ->

        kw_articles = article_list
        |> Enum.map fn(article) -> {String.to_atom(article.id), article} end
       
        articles = article_ids
        |> Enum.map(fn(article_id) ->
          article = kw_articles[String.to_atom(article_id)] 
        end)
        |> Enum.reject(&is_nil/1)
       
        ids_exists = article_ids
        |> Enum.map fn(article_id) ->
          String.to_atom(article_id) 
        end

        articles_without_index = kw_articles
        |> Keyword.drop ids_exists
        
        articles = Keyword.values(articles_without_index) ++ articles
        |> Enum.map(fn (article) -> %{"id" => article.id, "title" => article.title, "url" => article.url, "favicon" => article.favicon, "description" => article.description, "tags" => article.tags  } end)
      _ ->
        articles = article_list
    |> Enum.map(fn (article) -> %{"id" => article.id, "title" => article.title, "url" => article.url, "favicon" => article.favicon, "description" => article.description, "tags" => article.tags  } end)
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

  def handle_in("article:edit", params, socket) do
    user = socket.assigns.user
    case params do
      %{"article_id" => article_id, "title" => title, "description" => description, "url" => url, "tag_ids" => tag_ids} -> #update article

      tags_query = from t in Tag,
      where: (t.id in ^tag_ids) and (t.user_id == ^user.id),
      select: t
      tags = Repo.all(tags_query)

        cs = Repo.get(Article, article_id)
        |> Ecto.Changeset.change( title: title, description: description, url: url, tag: tags)

      case Repo.update cs do
        {:ok, article}       -> # Updated with success
          {:reply, {:ok, %{id: article.id}},socket}
        {:error, changeset} -> # Something went wrong  
        {:reply, {:error, %{message: "DB error"}}, socket}    
      end

      %{"title" => title, "description" => description, "url" => url, "tag_ids" => tag_ids} -> #new article
      
      tags_query = from t in Tag,
        where: (t.id in ^tag_ids) and (t.user_id == ^user.id),
        select: t

      tags = Repo.all(tags_query)
      
      new_article = user
        |> build_assoc(:articles)
        |> Article.changeset(%{tag: tags, title: title, description: description, url: url})

        case Repo.insert(new_article) do
          {:ok, article} ->
            {:reply, {:ok, %{id: article.id}},socket}
          {:error, reason} ->
            {:reply, {:error, %{errors: reason}}, socket}  
        end
      _ ->
        {:reply, {:error, %{message: "Bad params"}}, socket}
    end
  end

  def handle_in("article:delete", params, socket) do
    user = socket.assigns.user
    case params do
      %{"article_id" => article_id} ->
        article = Repo.get!(Article, article_id)

        case Repo.delete article do 
          {:ok, struct} ->
            {:reply, {:ok, %{}}, socket}    
          {:error, changeset} ->    
            {:reply, {:error, %{message: "Error db"}}, socket}
        end

      _ -> 
        {:reply, {:error, %{message: "Bad params"}}, socket}
    end  
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

  def handle_in("tag:delete", params, socket) do
    user = socket.assigns.user
    case params do
      %{"tag_id" => tag_id} ->
        tag = Repo.get!(Tag, tag_id)

        case Repo.delete tag do 
          {:ok, struct} ->
            {:reply, {:ok, %{}}, socket}    
          {:error, changeset} ->    
            {:reply, {:error, %{message: "Error db"}}, socket}
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
    |> Multi.run(:save_articles, 
      fn %{tag: tag} ->
        articles = for item <- content do
          case item do
            %{"title" => title, "url" => url, "favIconUrl" => favicon} ->
              article = user
              |> build_assoc(:articles)
              |> Article.changeset(%{tag: [tag], title: title, url: url, favicon: favicon})
              |> Repo.insert
            %{"title" => title, "url" => url} ->
              article = user
              |> build_assoc(:articles)
              |> Article.changeset(%{tag: [tag], title: title, url: url})
              |> Repo.insert
            _ ->
              IO.puts "-------------------------------------------------------------- MATCH ERROR "
              IO.inspect item
          end
        end
        {:ok, tag }
      end)
    
    case Repo.transaction(batch) do
        {:ok, tag} ->
          
          result = %{
            id: tag.save_articles.id,
            title: tag.save_articles.title,
            description: tag.save_articles.description,
            articles_count: length(content)
          }

          broadcast! socket, "tabs:added", %{content: result}
          {:reply, {:ok, %{content: result}},socket}


        {:error, reason} ->
          {:reply, {:error, %{errors: reason}}, socket}     
    end

  end
  
end