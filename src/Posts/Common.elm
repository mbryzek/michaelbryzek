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
        MotivationBehindTrueAcumenSlug ->
            renderPost post MotivationBehindTrueAcumen.contents

        StateManagementInElmSlug ->
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
        MotivationBehindTrueAcumenSlug ->
            { title = "Motivation for True Acumen"
            , date = "January 2025"
            , slug = slug
            }

        StateManagementInElmSlug ->
            { title = "State Management in Elm"
            , date = "February 2025"
            , slug = slug
            }

type Slug =
    MotivationBehindTrueAcumenSlug
    | StateManagementInElmSlug

allSlugs : List Slug
allSlugs =
    [ StateManagementInElmSlug
    , MotivationBehindTrueAcumenSlug
    ]

slugToString : Slug -> String
slugToString slug =
    case slug of
        MotivationBehindTrueAcumenSlug ->
            "motivation-for-true-acumen"

        StateManagementInElmSlug ->
            "state-management-in-elm"


slugFromString : String -> Maybe Slug
slugFromString slug =
    List.filter (\s -> slugToString s == slug) allSlugs
    |> List.head

