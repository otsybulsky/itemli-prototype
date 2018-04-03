defmodule Itemli.ApiController do
  use Itemli.Web, :controller

  plug Itemli.Plugs.RequireAuthApi when action in [:check]

  def check(conn, _params) do
    conn
    |> render("check.json")
  end

  def need_auth(conn, _params) do
    conn
    |> render("need_auth.json")
  end

end
