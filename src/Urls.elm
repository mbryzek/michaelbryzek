module Urls exposing (..)

index : String
index =
    "/"


blog : String
blog =
    "/blog"


blogPost : String -> String
blogPost slug =
    "/blog/p/" ++ slug


projects : String
projects =
    "/projects"


talks : String
talks =
    "/talks"
