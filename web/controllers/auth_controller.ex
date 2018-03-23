defmodule Itemli.AuthController do
    use Itemli.Web, :controller
    plug Ueberauth

    def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
        user_params = %{token: auth.credentials.token, email: auth.info.email, provider: auth.provider}
        
    end
end