defmodule Itemli.ApiView do
  use Itemli.Web, :view

  def render("check.json", %{conn: conn }) do
    
    user_token = if (conn.assigns.user), do: Phoenix.Token.sign(Itemli.Endpoint, "key", conn.assigns.user.id), else: nil
    %{status: :ok, params: %{ token: user_token, channelId: conn.assigns.user.id}}
  end
  
  def render("need_auth.json", _params) do
    %{status: :need_auth}
  end
  
end