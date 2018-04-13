defmodule Itemli.Repo.Migrations.DeleteInterfacesAddLayouts do
  use Ecto.Migration

  def change do
    drop table(:interfaces)

    create table(:layouts, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:users, type: :uuid), null: false
      add :hash, :string
      add :layout, :map #jsonb postgres, json others database

      timestamps()
    end 
  end
end
