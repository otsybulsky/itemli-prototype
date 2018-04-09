defmodule Itemli.Repo.Migrations.AddTags do
  use Ecto.Migration

  def change do
    create table(:tags, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :parent_id, :binary_id
      add :user_id, references(:users, type: :uuid), null: false
      add :title, :string
      add :url, :string
      add :description, :string

      timestamps()
    end  
  end
end
