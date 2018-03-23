# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :itemli,
  ecto_repos: [Itemli.Repo]

# Configures the endpoint
config :itemli, Itemli.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "I7MTm/d/gt+CyKum9ZIztvdLf1j9i/piBiktfKHgq5BWyPtifu9pBPuhpBJ49M1G",
  render_errors: [view: Itemli.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Itemli.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :ueberauth, Ueberauth,
  providers: [
    facebook: {Ueberauth.Strategy.Facebook, []},
    github: {Ueberauth.Strategy.Github, []}
  ]

#add the code to dev.secret.exs (github or other)
# config :ueberauth, Ueberauth.Strategy.Facebook.OAuth,
#   client_id: "FACEBOOK_CLIENT_ID",
#   client_secret: "FACEBOOK_CLIENT_SECRET"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
