defmodule Itemli.Repo.Migrations.AddTagArticle do
  use Ecto.Migration

  def change do
    create table(:tags_articles, primary_key: false) do
      add :tag_id, references(:tags, type: :uuid), null: false
      add :article_id, references(:articles, type: :uuid), null: false
    end  
  end
end
