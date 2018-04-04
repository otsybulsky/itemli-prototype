defmodule Itemli.RoomChannel do
  use Itemli.Web, :channel

  def join(_name, _params, socket) do
    {:ok, socket}
  end

  def handle_in(_name, _params, socket) do
    {:ok, socket}
  end
  
end