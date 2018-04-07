defmodule Itemli.Repo.Migrations.AddArticles do
  use Ecto.Migration

  def change do
    create table(:articles, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:users, type: :uuid), null: false
      add :title, :string
      add :url, :string
      add :favicon, :string
      add :description, :string

      timestamps()
    end  
  end
end
