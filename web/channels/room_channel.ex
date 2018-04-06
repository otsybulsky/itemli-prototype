defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel

  def join("room:" <> _room_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("tabs:add", %{"content" => content}, socket) do
    broadcast! socket, "tabs:added", %{content: content}
    {:reply, {:ok, %{content: content}}, socket}
  end
  
end