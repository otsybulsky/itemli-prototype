defmodule Itemli.Tag do
  use Itemli.Web, :model
  use Arbor.Tree, foreign_key_type: :binary_id

  @derive {Poison.Encoder, only: [:id, :parent_id, :title, :description]}

  schema "tags" do
    field :title, :string
    field :url, :string
    field :description, :string

    belongs_to :user, Itemli.User
    belongs_to :parent, __MODULE__  
    
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:parent_id, :title, :url, :description])  
  end

  
end