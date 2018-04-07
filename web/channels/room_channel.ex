defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel
  alias Itemli.{Article, User}

  def join("room:" <> _room_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("tabs:add", %{"content" => content}, socket) do
    user = Repo.get(User, socket.assigns.user_id)

    changeset = user
    |> build_assoc(:articles)
    |> Article.changeset(%{description: "test"})
    
    case Repo.insert(changeset) do
      {:ok, article} ->
        broadcast! socket, "tabs:added", %{content: content}
        {:reply, {:ok, %{content: content}}, socket}
      {:error, _reason} -> 
         {:reply, {:error, %{errors: changeset}}, socket}     
    end

    
    
  end
  
end