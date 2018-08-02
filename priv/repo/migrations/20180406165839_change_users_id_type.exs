defmodule Itemli.Repo.Migrations.ChangeUsersIdType do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :id # remove the existing id column
      add :id, :uuid, primary_key: true
    end
  end
end
