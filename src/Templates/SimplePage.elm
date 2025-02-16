module Templates.SimplePage exposing (render)

import Browser
import Html exposing (Html)
import Templates.Shell exposing (renderSimple)


render : String -> Html msg -> Browser.Document msg
render title contents =
    renderSimple (Just title) [contents]