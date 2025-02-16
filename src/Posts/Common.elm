module Posts.Common exposing (..)

type alias Post =
    { title : String
    , date : String
    , slug: String
    }


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

