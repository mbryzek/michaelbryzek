-- codegen.global.state: GlobalStateAnonymousData
module Page.Links exposing (view)

import Browser
import Html exposing (Html, div, text)
import Html.Attributes as Attr
import Templates.Shell as Shell
import Ui.Elements exposing (h2, p, externalLink)
import Ui.Svgs exposing (..)


type alias Link =
    { name : String
    , description : List String
    , url : String
    }


links : List Link
links =
    [ { name = "Abundant Nexus"
      , description =
            [ "My father's last company honored him with an incredible conference - the Abundant Nexus - recognizing my father's optimism, passion for MEMS and focus on improving the world with Adbundance."
            ]
      , url = "https://abundantnexus.com"
      }
    , { name = "Cameron Bryzek"
      , description =
            [ "My oldest child Cameron has an amazing hobby building leather works from raw cowhide."
            ]
      , url = "https://cameron.bryzek.com"
      }
    ]


view : Shell.ViewProps mainMsg -> Browser.Document mainMsg
view props =
    Shell.render props (Just "Links") [ contents ]


contents : Html msg
contents =
    div []
        [ div
            [ Attr.class "grid grid-cols-1 md:grid-cols-2 gap-6" ]
            (List.map linkCard links)
        ]


linkCard : Link -> Html msg
linkCard link =
    div
        [ Attr.class "bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer"
        , Attr.attribute "onclick" ("window.location.href='" ++ link.url ++ "'")
        ]
        (List.append
            [ div
                [ Attr.class "flex items-start justify-between mb-4" ]
                [ h2 [] [ text link.name ]
                , externalLink [] link.url [ websiteIcon ]
                ]
            ]
            (List.map (\t -> p [] [ text t ]) link.description)
        )
