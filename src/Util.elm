module Util exposing (..)

import Html exposing (Html, a, text)
import Html.Attributes exposing (class, href, rel, target)
import Ui.Elements exposing (textColor)

externalLink : String -> Html msg -> Html msg
externalLink url label =
    a 
        [ href url
        , target "_blank"
        , rel "noopener noreferrer"
        , class (textColor ++ " underline hover:no-underline")
        ]
        [ label ]

externalLinkToAcumen : Html msg
externalLinkToAcumen =
    externalLink "https://www.trueacumen.com" (text "True Acumen")
