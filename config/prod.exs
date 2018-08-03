use Mix.Config

config :itemli, Itemli.Endpoint,
  load_from_system_env: true,
  url: [host: "example.com", port: 80],
  cache_static_manifest: "priv/static/cache_manifest.json",
  server: true,
  secret_key_base: "${SECRET_KEY_BASE}"

config :logger, level: :info
# config :logger, :console, format: "[$level] $message\n"

config :itemli, Itemli.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: "${DATABASE_URL}",
  database: "",
  ssl: true,
  pool_size: 1

config :cors_plug,
  origin: ~r/^.*-extension:/,
  max_age: 86400,
  methods: ["GET", "POST"]

config :libcluster,
  topologies: [
    k8s_example: [
      strategy: Cluster.Strategy.Kubernetes,
      config: [
        kubernetes_selector: "${LIBCLUSTER_KUBERNETES_SELECTOR}",
        kubernetes_node_basename: "${LIBCLUSTER_KUBERNETES_NODE_BASENAME}"]]]

config :ueberauth, Ueberauth.Strategy.Facebook.OAuth,
  client_id: "${ITEMLI_FACEBOOK_ID}" ,
  client_secret: "${ITEMLI_FACEBOOK_SECRET}"

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: "${ITEMLI_GITHUB_ID}",
  client_secret: "${ITEMLI_GITHUB_SECRET}" 

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: "${ITEMLI_GOOGLE_ID}",
  client_secret: "${ITEMLI_GOOGLE_SECRET}"

config :itemli,
  token_secret: "${ITEMLI_TOKEN_SECRET}"