defmodule Itemli.Repo.Migrations.AddTagArticlesIndex do
  use Ecto.Migration

  def change do
    alter table(:tags) do
      add :articles_index, :map
    end
  end
end
