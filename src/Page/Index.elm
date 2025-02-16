module Page.Index exposing (view)

import Browser
import Html exposing (Html, text)
import Templates.Shell as Shell
import Ui.Elements exposing (p)
import Util exposing (externalLinkToAcumen)


view : Shell.ViewProps mainMsg -> Browser.Document mainMsg
view props =
    Shell.render props Nothing [ contents ]


contents : Html mainMsg
contents =
    Html.div []
        [ p (text "My name is Michael Bryzek and I'm a developer living in New Jersey. ")
        , p (text "I’m a serial entrepreneur, best known for founding Gilt Groupe in 2007 and Flow Commerce in 2015, which now powers international commerce inside Shopify.")
        , Html.div []
            [ p (text "Recently I've been spending most of my time improving personal expense and budget management and have been working on the app ")
            , externalLinkToAcumen
            ]
        ]
