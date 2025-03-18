-- codegen.global.state: GlobalStateAnonymousData
module Page.Blog.Index exposing (Msg, update, view)

import Browser
import Browser.Navigation as Nav
import Global exposing (GlobalState, MainViewProps)
import Html exposing (Html, article, button, div, text)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Templates.Shell as Shell
import Ui.Elements exposing (p)
import Posts.Common exposing (Post, allBlogPosts, slugToString)
import Urls

type Msg
    = RedirectTo String


update : GlobalState -> Msg -> Cmd Msg
update global msg =
    case msg of
        RedirectTo url ->
            Nav.pushUrl global.navKey url


view : MainViewProps Msg mainMsg -> Shell.ViewProps mainMsg -> Browser.Document mainMsg
view { msgMap } shellProps =
    Shell.render shellProps Nothing [ contents |> Html.map msgMap ]


contents : Html Msg
contents =
    div [ Attr.class "grid gap-6" ] (List.map viewBlogPost allBlogPosts)


viewBlogPost : Post -> Html Msg
viewBlogPost post =
    article
        [ Attr.class "bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 transition-colors" ]
        [ div
            [ Attr.class "space-y-2" ]
            [ localLink (Urls.blogPost { slug = slugToString post.slug }) post.title
            , p [] [ text post.date ]
            ]
        ]


localLink : String -> String -> Html Msg
localLink url label =
    button
        [ onClick (RedirectTo url)
        , class "underline hover:no-underline"
        ]
        [ text label ]
