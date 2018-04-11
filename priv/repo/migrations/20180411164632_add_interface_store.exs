defmodule Itemli.Repo.Migrations.AddInterfaceStore do
  use Ecto.Migration

  def change do
    create table(:interfaces, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:users, type: :uuid), null: false
      add :hash, :string
      add :store, :map #jsonb postgres, json others database

      timestamps()
    end 
  end
end
