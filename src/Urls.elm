module Urls exposing (..)

index : String
index =
    "/"


blog : String
blog =
    "/blog"

type alias BlogPostParams =
    { slug : String }


blogPost : BlogPostParams -> String
blogPost params =
    "/blog/" ++ params.slug


projects : String
projects =
    "/projects"


talks : String
talks =
    "/talks"
