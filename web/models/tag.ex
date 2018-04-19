defmodule Itemli.Tag do
  use Itemli.Web, :model
  use Arbor.Tree, foreign_key_type: :binary_id

  @derive {Poison.Encoder, only: [:id, :parent_id, :title, :description]}

  schema "tags" do
    field :title, :string
    field :url, :string
    field :description, :string
    field :articles_index, :map

    belongs_to :user, Itemli.User
    belongs_to :parent, __MODULE__  
    many_to_many :articles, Itemli.Article, join_through: "tags_articles"
    
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:parent_id, :title, :url, :description, :articles_index])  
  end

  
end