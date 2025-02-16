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


type alias Model =
    { slug : String }


type Msg
    = RedirectTo String


init : Urls.BlogPostParams -> Model
init params =
    { slug = params.slug }


update : GlobalState -> Msg -> Cmd mainMsg
update global msg =
    case msg of
        RedirectTo url ->
            Nav.pushUrl global.navKey url


view : MainViewProps Msg mainMsg -> Shell.ViewProps mainMsg -> Browser.Document mainMsg
view { msgMap } shellProps =
    Shell.render shellProps Nothing [ contents |> Html.map msgMap ]


contents : Html Msg
contents =
    div [] []