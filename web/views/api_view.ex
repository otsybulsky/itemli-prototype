defmodule Itemli.ApiView do
  use Itemli.Web, :view

  def render("check.json", _params) do
    %{status: :ok}
  end
  
end