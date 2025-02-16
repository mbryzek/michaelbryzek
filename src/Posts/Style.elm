module Posts.Style exposing (..)

import Html exposing (Html, text, ul, li, span, div)
import Html.Attributes exposing (class)
import Ui.Elements exposing (h1, h2, p, textColor)

blogH1 : String -> Html msg
blogH1 title =
    h1 [] [ text title ]

blogH2 : List (Html msg) -> Html msg
blogH2 content =
    h2 [ class "mt-8" ] content

blogP : List (Html msg) -> Html msg
blogP content =
    p [ class "mt-4" ] content

type alias ItemWithTitle =
    { title : String
    , content : String
    }

blogListWithTitles : List ItemWithTitle -> Html msg
blogListWithTitles items =
    ul [ class ("mt-4 list-disc pl-8 " ++ textColor) ] (List.map (\item -> renderItem item) items)

renderItem : ItemWithTitle -> Html msg
renderItem item =
    li [class "mt-4"] [
        div [class "flex flex-col gap-y-2"] [
            div [class "font-bold"] [text item.title]
        , div [] [text item.content]
        ]
    ]
