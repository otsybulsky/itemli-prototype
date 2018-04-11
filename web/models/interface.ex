defmodule Itemli.Interface do
  use Itemli.Web, :model

  schema "interfaces" do
    field :hash, :string
    field :store, :map

    belongs_to :user, Itemli.User 

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:hash, :store ]) 
  end

end