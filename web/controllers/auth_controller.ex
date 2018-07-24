defmodule Itemli.AuthController do
    use Itemli.Web, :controller
    alias Itemli.User
    plug Ueberauth

    def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
        user_params = %{token: auth.credentials.token, email: auth.info.email, name: auth.info.name, provider: Atom.to_string(auth.provider)}        
        
        signin(conn, user_params)
    end

    def signout(conn, _params) do
        conn
        |> configure_session(drop: true)
        |> redirect(to: main_path(conn, :index))
    end

    defp signin(conn, user_params) do
        case check_user(user_params) do
            {:ok, user} ->
                conn
                |> put_session(:user_id, user.id)
                |> redirect(to: react_path(conn, :index))
            {:error, _reason} ->
                conn
                |> put_flash(:error, "Error signing in")
                |> redirect(to: main_path(conn, :index))
        end
    end

    defp check_user(user_params) do
        case Repo.get_by(User, email: user_params.email) do
            nil ->
                changeset = User.changeset(%User{}, user_params)
                Repo.insert(changeset)
            user ->
                # {:ok, user}
                changeset = User.changeset(user, user_params)
                Repo.update(changeset)
        end
    end
end