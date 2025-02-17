module Posts.StateManagementInElm exposing (contents)

import Html exposing (Html, text)
import Posts.Style exposing (blogP)


contents : List (Html msg)
contents =
    [ blogP [ text """
    Managing state in an Elm single-page application (SPA) requires careful structuring.
    Over time, I’ve refined an approach that balances simplicity and scalability.
    This post shares my methodology using a minimal example app covering:
    """]
    ]
