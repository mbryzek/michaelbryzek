module Ui.Elements exposing (p, h1, h2, externalLink, textColor, button)

import Html exposing (Html, Attribute, a)
import Html.Attributes exposing (class, href, target, rel)


textColor : String
textColor =
    "text-gray-100"


externalLink : List (Attribute msg) -> String -> List (Html msg) -> Html msg
externalLink attributes url contents =
    a 
        (finalAttributes attributes [
            href url
            , target "_blank"
            , rel "noopener noreferrer"
            , class "underline hover:no-underline"
        ])
        contents

p : List (Attribute msg) -> List (Html msg) -> Html msg
p attributes content =
    Html.p (finalAttributes attributes [ class "leading-relaxed" ]) content

h1 : List (Attribute msg) -> List (Html msg) -> Html msg
h1 attributes content =
    Html.h2 (finalAttributes attributes [ class "text-3xl font-bold text-gray-100" ]) content


h2 : List (Attribute msg) -> List (Html msg) -> Html msg
h2 attributes content =
    Html.h2 (finalAttributes attributes [ class "text-xl font-semibold text-gray-100" ]) content

finalAttributes : List (Attribute msg) -> List (Attribute msg) -> List (Attribute msg)
finalAttributes attributes1 attributes2 =
    List.concat [
        attributes1
        , attributes2
        , [ class textColor ]
    ]

button : List (Attribute msg) -> List (Html msg) -> Html msg
button attributes content =
    Html.button (finalAttributes attributes [ class "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition-colors shadow-sm" ]) content
