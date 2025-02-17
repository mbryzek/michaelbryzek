module Posts.Style exposing (..)

import Html exposing (Html, div, li, text, ul, a, pre, code)
import Html.Attributes exposing (class, href, target, rel)
import Ui.Elements exposing (externalLink, h1, h2, p, textColor)
import String


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

blogList : List String -> Html msg
blogList items =
    ul [ class ("mt-4 list-disc pl-8 " ++ textColor) ] (List.map (\item -> li [ class "mt-4" ] [ text item ]) items)


renderItem : ItemWithTitle -> Html msg
renderItem item =
    li [ class "mt-4" ]
        [ div [ class "flex flex-col gap-y-2" ]
            [ div [ class "font-bold" ] [ text item.title ]
            , div [] [ text item.content ]
            ]
        ]

blogExternalLink : String -> String -> Html msg
blogExternalLink url label =
    div [ class "mt-4" ] [ externalLink [] url [ text label ] ]


blogButton : String -> List (Html msg) -> Html msg
blogButton url content =
    a
        [ class "inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition-colors shadow-sm"
        , href url  
        , target "_blank"
        , rel "noopener noreferrer"
        ]
        content

blogCode : String -> Html msg
blogCode content =
    div [ class "my-6" ]
        [ pre [ class "bg-gray-900 p-4 rounded-lg border border-gray-200 font-mono overflow-x-scroll" ]
            [ code [] [ text (String.trim content) ]
            ]
        ]