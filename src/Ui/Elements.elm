module Ui.Elements exposing (p, h1, h2, externalLink)

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
    Html.p (finalAttributes attributes [ class "leading-relaxed mb-2" ]) content

h1 : List (Attribute msg) -> List (Html msg) -> Html msg
h1 attributes content =
    Html.h2 (finalAttributes attributes [ class "text-3xl font-bold text-gray-100 mb-2" ]) content


h2 : List (Attribute msg) -> List (Html msg) -> Html msg
h2 attributes content =
    Html.h2 (finalAttributes attributes [ class "text-xl font-semibold text-gray-100 mb-2" ]) content

finalAttributes : List (Attribute msg) -> List (Attribute msg) -> List (Attribute msg)
finalAttributes attributes1 attributes2 =
    List.concat [
        attributes1
        , attributes2
        , [ class textColor ]
    ]
