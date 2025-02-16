module Util exposing (..)

import Html exposing (Html, text)
import Ui.Elements exposing (externalLink)

externalLinkToAcumen : Html msg
externalLinkToAcumen =
    externalLink [] "https://www.trueacumen.com" [ text "True Acumen" ]
