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

motivationForTrueAcumenSlug : String
motivationForTrueAcumenSlug =
    "motivation-for-true-acumen"

