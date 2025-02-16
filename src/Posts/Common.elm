module Posts.Common exposing (..)

import Html exposing (Html)
import Posts.MotivationForTrueAcumen as MotivationForTrueAcumen

type alias Post =
    { title : String
    , date : String
    , slug: String
    }

getContents : Post -> Html msg
getContents post =
    case post.slug of
        "motivation-for-true-acumen" ->
            MotivationForTrueAcumen.render

        _ ->
            Html.text "TODO"

allBlogPosts : List Post
allBlogPosts =
    [ { title = "State Management in Elm"
      , date = "February 2025"
      , slug = "state-management-in-elm"
      }
    , { title = "Motivation for True Acumen"
      , date = "January 2025"
      , slug = motivationForTrueAcumenSlug
      }
    ]


findBlogPost : String -> Maybe Post
findBlogPost slug =
    List.filter (\post -> post.slug == slug) allBlogPosts
        |> List.head


motivationForTrueAcumenSlug : String
motivationForTrueAcumenSlug =
    "motivation-for-true-acumen"

