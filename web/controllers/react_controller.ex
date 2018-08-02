defmodule Itemli.ReactController do
    use Itemli.Web, :controller

    plug Itemli.Plugs.RequireAuth when action in [:index]

    def index(conn, _params) do
        render conn, "index.html"
    end

    def blank(conn, _params) do
        render conn, "blank.html"
    end
end