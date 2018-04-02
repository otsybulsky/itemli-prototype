defmodule Itemli.ApiController do
  use Itemli.Web, :controller

  def check(conn, params) do
    conn
    |> render("check.json")
  end

end
