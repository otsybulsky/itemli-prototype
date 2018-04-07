defmodule Itemli.Article do
  use Itemli.Web, :model

  schema "articles" do
    field :title, :string
    field :url, :string
    field :favicon, :string
    field :description, :string

    belongs_to :user, Itemli.User  

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :url, :favicon, :description])  
  end
  
end