-- codegen.global.state: GlobalStateAnonymousData
module Page.Index exposing (view)

import Browser
import Html exposing (Html, text)
import Html.Attributes exposing (class)
import Templates.Shell as Shell
import Ui.Elements exposing (p)
import Util exposing (externalLinkToAcumen)


view : Shell.ViewProps mainMsg -> Browser.Document mainMsg
view props =
    Shell.render props Nothing [ contents ]


contents : Html mainMsg
contents =
    Html.div []
        [ p [] [ text "My name is Michael Bryzek and I'm a developer and serial entrepreneur living in New Jersey. " ]
        , p [class "mt-4"] [ text "I’m best known for founding Gilt Groupe in 2007 and Flow Commerce in 2015, which now powers international commerce inside Shopify." ]
        , p [class "mt-4"] [    
                text "Recently, I spend most my time building "
                , externalLinkToAcumen
                , text ", a personal expense and budget management application."
            ]
        ]
