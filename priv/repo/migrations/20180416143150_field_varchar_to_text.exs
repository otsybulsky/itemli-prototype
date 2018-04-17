defmodule Itemli.Repo.Migrations.FieldVarcharToText do
  use Ecto.Migration

  def change do
    alter table(:tags) do
      modify :url, :text
      modify :description, :text
    end
    alter table(:articles) do
      modify :url, :text
      modify :description, :text
    end
  end
end
