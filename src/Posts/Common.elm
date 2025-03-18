module Posts.Common exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Posts.MotivationBehindTrueAcumen as MotivationBehindTrueAcumen
import Posts.StateManagementInElm as StateManagementInElm
import Posts.Style exposing (blogH1)
import Ui.Elements exposing (textColor)


type alias Post =
    { title : String
    , date : String
    , slug : Slug
    }


getContents : Post ->Html msg
getContents post =
    case post.slug of
        SlugMotivationBehindTrueAcumen ->
            renderPost post MotivationBehindTrueAcumen.contents

        SlugStateManagementInElm ->
            renderPost post StateManagementInElm.contents

renderPost : Post -> List (Html msg) -> Html msg
renderPost post contents =
    div []
        (List.concat
            [ [ blogH1 post.title
              , div [ class textColor, class "mt-2 italic" ] [ text post.date ]
              ]
            , contents
            ]
        )


allBlogPosts : List Post
allBlogPosts =
    List.map findBlogPost allSlugs

findBlogPost : Slug -> Post
findBlogPost slug =
    case slug of
        SlugMotivationBehindTrueAcumen ->
            { title = "Motivation for True Acumen"
            , date = "January 2025"
            , slug = slug
            }

        SlugStateManagementInElm ->
            { title = "State Management in Elm"
            , date = "March 2025"
            , slug = slug
            }

type Slug =
    SlugMotivationBehindTrueAcumen
    | SlugStateManagementInElm

allSlugs : List Slug
allSlugs =
    [ SlugStateManagementInElm
    , SlugMotivationBehindTrueAcumen
    ]

slugToString : Slug -> String
slugToString slug =
    case slug of
        SlugMotivationBehindTrueAcumen ->
            "motivation-behind-true-acumen"

        SlugStateManagementInElm ->
            "state-management-in-elm"


slugFromString : String -> Maybe Slug
slugFromString slug =
    List.filter (\s -> slugToString s == slug) allSlugs
    |> List.head

