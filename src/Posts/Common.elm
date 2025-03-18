module Posts.Common exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Posts.MotivationBehindTrueAcumen as MotivationBehindTrueAcumen
import Posts.ManagingStateInElmSinglePageApps as ManagingStateInElmSinglePageApps
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

        SlugManagingStateInElmSinglePageApps ->
            renderPost post ManagingStateInElmSinglePageApps.contents

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

        SlugManagingStateInElmSinglePageApps ->
            { title = "Managing State in Elm Single Page Applications"
            , date = "March 2025"
            , slug = slug
            }

type Slug =
    SlugMotivationBehindTrueAcumen
    | SlugManagingStateInElmSinglePageApps

-- this is the order of the posts on the blog page
allSlugs : List Slug
allSlugs =
    [ SlugManagingStateInElmSinglePageApps
      , SlugMotivationBehindTrueAcumen
    ]

slugToString : Slug -> String
slugToString slug =
    case slug of
        SlugMotivationBehindTrueAcumen ->
            "motivation-behind-true-acumen"

        SlugManagingStateInElmSinglePageApps ->
            "managing-state-in-elm-single-page-applications"


slugFromString : String -> Maybe Slug
slugFromString slug =
    List.filter (\s -> slugToString s == slug) allSlugs
    |> List.head

