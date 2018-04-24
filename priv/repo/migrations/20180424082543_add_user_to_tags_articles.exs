defmodule Itemli.Repo.Migrations.AddUserToTagsArticles do
  use Ecto.Migration

  def change do
    alter table(:tags_articles) do
      add :user_id, references(:users, type: :uuid), null: false
    end
  end
end
