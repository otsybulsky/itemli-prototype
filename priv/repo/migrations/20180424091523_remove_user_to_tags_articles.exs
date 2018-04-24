defmodule Itemli.Repo.Migrations.RemoveUserToTagsArticles do
  use Ecto.Migration

  def change do
    alter table(:tags_articles) do
      remove :user_id
    end
  end
end
