-- codegen.global.state: GlobalStateAnonymousData


module Page.PbWaiver exposing (Model, Msg, init, update, view)

import Browser
import Global exposing (MainViewProps)
import Html exposing (div, text)
import Html.Attributes exposing (class)
import Ports exposing (redirectToUrl)
import Task
import Ui.Elements exposing (p)


type alias Model =
    {}


type Msg
    = Redirect


init : ( Model, Cmd Msg )
init =
    ( {}, Task.perform (\_ -> Redirect) (Task.succeed ()) )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Redirect ->
            ( model, redirectToUrl "https://docs.google.com/document/d/1ay8e0TrYQDBHhHCTiSya539npbJzrBVt/edit" )


view : MainViewProps Msg mainMsg -> Browser.Document mainMsg
view _ =
    { title = "Redirecting"
    , body =
        [ div [ class "text-center py-8" ]
            [ p [] [ text "Redirecting to waiver..." ]
            ]
        ]
    }
