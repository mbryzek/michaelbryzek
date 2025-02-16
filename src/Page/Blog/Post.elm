module Page.Blog.Post exposing (Model, Msg, init, update, view)

import Browser
import Browser.Navigation as Nav
import Global exposing (GlobalState, MainViewProps)
import Html exposing (Html, article, button, div, text)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Templates.Shell as Shell
import Ui.Elements exposing (h2, p)
import Urls
import Posts.Common exposing (Post, findBlogPost)
import NotFound as NotFound


type alias Model =
    { post : Maybe Post }


type Msg
    = RedirectTo String


init : Urls.BlogPostParams -> Model
init params =
    { post = findBlogPost params.slug }


update : GlobalState -> Msg -> Cmd mainMsg
update global msg =
    case msg of
        RedirectTo url ->
            Nav.pushUrl global.navKey url


view : MainViewProps Msg mainMsg -> Shell.ViewProps mainMsg -> Model -> Browser.Document mainMsg
view { msgMap } shellProps model =
    case model.post of
        Just post ->
            Shell.render shellProps Nothing [ contents post |> Html.map msgMap ]

        Nothing ->
            NotFound.view


contents : Post -> Html mainMsg
contents post =
    div [] [ text post.title ]
