module Templates.Shell exposing (ViewProps, Msg, Section, Model, init, update, render, renderSimple)

import Browser
import Browser.Navigation as Nav
import Global exposing (GlobalState)
import Html exposing (Html, div, h1, button, main_, nav, text, a, span)
import Html.Attributes exposing (class, target, rel, href)
import Html.Events exposing (onClick)
import Task
import Time
import Url
import Urls
import Ui.Svgs exposing (..)
import Date

type alias Model =
    { posix : Maybe Time.Posix }

emptyModel : Model
emptyModel =
    { posix = Nothing }

type alias ViewProps a =
    { global : GlobalState
    , shellModel : Model
    , onShellMsg : Msg -> a
    }

type alias Section =
    { href : String, name : String }

type Msg =
    RedirectTo String
    | CurrentTime Time.Posix

init : (Model, Cmd Msg)
init =
    (emptyModel, Task.perform CurrentTime Time.now)


update : ViewProps msg -> Msg -> (Model, Cmd Msg)
update { shellModel, global } msg =
    case msg of
        RedirectTo url ->
            ( shellModel, Nav.pushUrl global.navKey url )

        CurrentTime posix ->
            ( { shellModel | posix = Just posix }, Cmd.none )


allSections : List Section
allSections =
    [ { href = Urls.index, name = "About" }
    , { href = Urls.blog, name = "Blog" }
    , { href = Urls.projects, name = "Projects" }
    , { href = Urls.links, name = "Links" }
    , { href = Urls.talks, name = "Talks" }
    ]


topNavSections : Url.Url -> Html Msg
topNavSections currentUrl =
    div
        [ class "flex ml-2 mr-2"]
        (List.map (navLink currentUrl) allSections)


isSectionActive : Url.Url -> Section -> Bool
isSectionActive currentUrl section =
    currentUrl.path == section.href


navLink : Url.Url -> Section -> Html Msg
navLink currentUrl section =
    let
        isActive : Bool
        isActive =
            isSectionActive currentUrl section
    in
    button
        [ onClick (RedirectTo section.href)
        , class <|
            "rounded-md px-2 py-2 text-sm font-medium "
                ++ (if isActive then
                        "bg-gray-900 text-white"

                    else
                        "text-gray-300 hover:bg-gray-700 hover:text-white"
                   )
        ]
        [ text section.name ]


render : (ViewProps mainMsg) -> Maybe String -> List (Html mainMsg) -> Browser.Document mainMsg
render { shellModel, global, onShellMsg } title contents =
    { title = title |> Maybe.withDefault "Michael Bryzek"
    , body = [ renderBody shellModel title (renderNav global |> Html.map onShellMsg) contents ]
    }

renderSimple : Maybe String -> List (Html mainMsg) -> Browser.Document mainMsg
renderSimple title contents =
    { title = title |> Maybe.withDefault "Michael Bryzek"
    , body = [ renderBody emptyModel title (Html.text "")contents ]
    }

renderNav : GlobalState -> Html Msg
renderNav global =
    nav
        [ class "border-b border-gray-700"
        ]
        [ div
            [ class "mx-auto max-w-3xl px-4 py-6"
            ]
            [ div
                [ class "flex items-center justify-between"
                ]
                [ button 
                    [ class "text-xl font-bold text-gray-100 hover:text-white"
                    , onClick (RedirectTo Urls.index)
                    ]
                    [ text "Michael Bryzek" ]
                , topNavSections global.url
                ]
            ]
        ]


renderBody : Model -> Maybe String -> Html msg -> List (Html msg) -> Html msg
renderBody model title nav contents =
    div
        [ class "min-h-screen bg-gray-800 text-gray-200"
        ]
        [ nav
        , main_ 
            [ class "mx-auto max-w-3xl px-4 py-6" ]
            [ renderTitle title
            , div [class "mt-6"] contents
            ]
        , footer model
        ]

renderTitle : Maybe String -> Html msg
renderTitle title =
    case title of
        Just t ->
            h1
                [ class "text-2xl font-bold text-gray-100" ]
                [ text t ]

        Nothing ->
            text ""

footer : Model -> Html msg
footer model =
    let
        year : String
        year =
            model.posix
                |> Maybe.map (Date.year << Date.fromPosix Time.utc)
                |> Maybe.map (\y -> " " ++ String.fromInt y)
                |> Maybe.withDefault ""
    in
    div
        [ class "mt-4 bg-gray-800 border-t border-gray-700"
        ]
        [ div 
            [ class "mx-auto max-w-3xl px-4 py-4" ]
            [ div 
                [ class "flex items-center justify-between gap-x-4 px-2" ]
                [ div 
                    [ class "text-sm text-gray-500" ]
                    [ text ("©" ++ year ++ " Michael Bryzek") ]
                , div [] [ renderIcons ]
                ]
            ]
        ]

renderIcons : Html msg
renderIcons =
    div [ class "flex space-x-2"]
        [ socialLink "Email" "mailto:mbryzek@gmail.com" emailIcon
        , socialLink "X" "https://twitter.com/mbryzek" xIcon
        , socialLink "GitHub" "https://github.com/mbryzek" githubIcon
        , socialLink "Linked In" "https://www.linkedin.com/in/mbryzek" linkedInIcon
        ]

socialLink : String -> String -> Html msg -> Html msg
socialLink label url icon =
    a
        [ class "text-sm text-gray-500 transition hover:text-gray-600"
        , target "_blank"
        , rel "noopener noreferrer"
        , href url
        ]
        [ span [ class "sr-only" ] [ text label ]
        , icon
        ]