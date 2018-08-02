defmodule Itemli.UserSocket do
  use Phoenix.Socket
  alias Itemli.{Repo, User}

  channel "room:*", Itemli.RoomChannel

  transport :websocket, Phoenix.Transports.WebSocket
  
  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, Application.get_env(:itemli, :token_secret), token, max_age: 86400) do #max 1 day 86400
      {:ok, user_id} ->
        user = Repo.get(User, user_id)
        
        {:ok,
          socket
          |> assign(:user_id, user_id)
          |> assign(:user, user)
        }
      {:error, _error} ->
        :error
    end
  end

  def id(socket), do: "users_socket:#{socket.assigns.user_id}"
end
