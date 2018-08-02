defmodule Itemli.Article do
  use Itemli.Web, :model

  @derive {Poison.Encoder, only: [:id, :title, :url, :favicon, :description, :updated_at]}

  schema "articles" do
    field :title, :string
    field :url, :string
    field :favicon, :string
    field :description, :string

    belongs_to :user, Itemli.User  
    many_to_many :tags, Itemli.Tag, [join_through: "tags_articles", on_delete: :delete_all, on_replace: :delete]

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    
   case params do
    %{"tag": tags} ->
      struct
      |> cast(params, [:title, :url, :favicon, :description])  
      |> put_assoc(:tags, params.tag || nil) #for tabs:add from ext client
    _ ->
      struct
      |> cast(params, [:title, :url, :favicon, :description, :tags])  
   end


    
  end
  
end