defmodule Itemli.UserSocket do
  use Phoenix.Socket

  channel "room:*", Itemli.RoomChannel

  transport :websocket, Phoenix.Transports.WebSocket
  
  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, Application.get_env(:itemli, :token_secret), token, max_age: 60) do
      {:ok, user_id} ->
        {:ok, assign(socket, :user_id, user_id)}
      {:error, _error} ->
        :error
    end
  end

  def id(socket), do: "users_socket:#{socket.assigns.user_id}"
end
