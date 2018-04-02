defmodule Itemli.Router do
  use Itemli.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Itemli.Plugs.SetUser
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Itemli.Plugs.SetUser
  end

  scope "/", Itemli do
    pipe_through :browser # Use the default browser stack

    get "/", MainController, :index
    get "/app", ReactController, :index
  end

  scope "/auth", Itemli do
    pipe_through :browser

    get "/signout", AuthController, :signout
    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
  end

  # Other scopes may use custom stacks.
  scope "/api", Itemli do
    pipe_through :api

    get "/check", ApiController, :check
  end
end
