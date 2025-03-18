module Posts.Style exposing (..)

import Html exposing (Html, div, li, text, ul)
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
    ul [ class ("mt-4 list-disc pl-8 " ++ textColor) ] (List.map (\item -> renderItem (Just item.title) (Just item.content)) items)

blogList : List String -> Html msg
blogList items =
    ul [ class ("mt-4 list-disc pl-8 " ++ textColor) ] (List.map (\item -> renderItem Nothing (Just item)) items)


renderItem : Maybe String -> Maybe String -> Html msg
renderItem maybeTitle maybeContents =
    let
        title : Html msg
        title =
            case maybeTitle of
                Just t ->
                    div [ class "font-bold" ] [ text t ]

                Nothing ->
                    div [] []
        contents : Html msg
        contents =
            case maybeContents of
                Just c ->
                    div [] [ text c ]

                Nothing ->
                    div [] []
    in
    li [ class "mt-2" ]
        [ div [ class "flex flex-col gap-y-2" ]
            [ title, contents ]
        ]

blogCode : List String -> Html msg
blogCode code =
    div [ class "mt-4 w-full max-w-2xl bg-[#1E1E1E] text-gray-300 rounded-lg p-4 shadow-lg overflow-x-auto border border-gray-700" ]
        (List.map (\line -> div [ class "whitespace-pre-wrap" ] [text line]) code)
