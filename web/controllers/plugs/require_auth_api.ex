defmodule Itemli.Plugs.RequireAuthApi do
  import Plug.Conn
  import Phoenix.Controller

  alias Itemli.Router.Helpers

  def init(_params) do
        
  end

  def call(conn, _from_init) do
      if conn.assigns[:user] do
          conn
      else
          conn
          |> redirect(to: Helpers.api_path(conn, :need_auth))   
          |> halt() 
      end
  end
end