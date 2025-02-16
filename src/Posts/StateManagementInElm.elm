module Posts.StateManagementInElm exposing (contents)

import Html exposing (Html, text)
import Posts.Style exposing (blogP)


contents : List (Html msg)
contents =
    [ blogP [ text "Coming Soon" ]
    ]
