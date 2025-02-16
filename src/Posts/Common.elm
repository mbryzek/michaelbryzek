module Posts.Common exposing (..)

import Html exposing (Html, div)
import Posts.MotivationForTrueAcumen as MotivationForTrueAcumen
import Posts.Style exposing (blogH1)


type alias Post =
    { title : String
    , date : String
    , slug: String
    }

getContents : Post -> Maybe (Html msg)
getContents post =
    case post.slug of
        "motivation-for-true-acumen" -> -- motivationForTrueAcumenSlug
            Just (renderPost post MotivationForTrueAcumen.contents)

        _ ->
            Nothing

renderPost : Post -> List (Html msg) -> Html msg
renderPost post contents =
    div [] (List.concat [
        [ blogH1 post.title ]
        , contents
    ])


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

