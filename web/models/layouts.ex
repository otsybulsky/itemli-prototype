defmodule Itemli.Layout do
  use Itemli.Web, :model

  schema "layouts" do
    field :hash, :string
    field :layout, :map

    belongs_to :user, Itemli.User 

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:hash, :layout ]) 
  end

end