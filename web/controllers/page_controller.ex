defmodule Itemli.PageController do
  use Itemli.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
