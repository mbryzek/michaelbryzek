module Page.Blog.Post exposing (Model, Msg, init, update, view)

import Browser
import Browser.Navigation as Nav
import Global exposing (GlobalState, MainViewProps)
import Html exposing (Html, article, button, div, text, h1, h2, p, ul, li, a)
import Html.Attributes exposing (class, href)
import Templates.Shell as Shell
import Urls
import Posts.Common exposing (Post, findBlogPost, getContents)
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
            case getContents post of
                Just contents ->
                    Shell.render shellProps Nothing [ contents |> Html.map msgMap ]
                Nothing ->
                    NotFound.view

        Nothing ->
            NotFound.view
