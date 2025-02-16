module Page.Blog.Post exposing (Msg, update, view)

import Browser
import Browser.Navigation as Nav
import Global exposing (GlobalState, MainViewProps)
import Html exposing (Html, article, button, div, text)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Templates.Shell as Shell
import Ui.Elements exposing (h2, p)
import Urls




posts : List Post
posts =
    [ { title = "State Management in Elm"
      , date = "February 2025"
      , url = Urls.blogPost "state-management-in-elm"
      }
    , { title = "Motivation for True Acumen"
      , date = "January 2025"
      , url =  Urls.blogPostMotivationForTrueAcumen
      }
    ]


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
    div [] []