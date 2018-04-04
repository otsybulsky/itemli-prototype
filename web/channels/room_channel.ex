defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel

  def join("room:" <> room_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("tabs:" <> mode, %{"content" => content}, socket) do
    {:reply, {:ok, %{content: content}}, socket}
  end
  
end