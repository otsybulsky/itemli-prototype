defmodule Itemli.Repo.Migrations.ArticleFieldExtend do
  use Ecto.Migration

  def change do
    alter table(:articles) do
      modify :title, :text
      modify :favicon, :text
    end
  end
end
