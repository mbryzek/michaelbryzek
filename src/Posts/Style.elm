module Posts.Style exposing (..)

import Html exposing (Html)
import Html.Attributes exposing (class)
import Ui.Elements exposing (h2, p)


blogH2 : List (Html msg) -> Html msg
blogH2 content =
    h2 [ class "mt-8" ] content

blogP : List (Html msg) -> Html msg
blogP content =
    p [ class "mt-4" ] content

