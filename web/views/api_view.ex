defmodule Itemli.ApiView do
  use Itemli.Web, :view

  def render("check.json", _params) do
    %{status: :ok}
  end
  
  def render("need_auth.json", _params) do
    %{status: :need_auth}
  end
  
end