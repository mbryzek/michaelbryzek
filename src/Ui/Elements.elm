module Ui.Elements exposing (..)

import Html exposing (Html)
import Html.Attributes exposing (class)


textColor : String
textColor =
    "text-gray-100"


p : Html msg -> Html msg
p content =
    Html.p [ class (textColor ++ " leading-relaxed mb-2") ]
        [ content ]


h2 : Html msg -> Html msg
h2 label =
    Html.h2 [ class "text-xl font-semibold text-gray-100 mb-2" ]
        [ label ]
