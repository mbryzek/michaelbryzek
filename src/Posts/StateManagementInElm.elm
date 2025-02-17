module Posts.StateManagementInElm exposing (contents)

import Html exposing (Html, text)
import Posts.Style exposing (..)


contents : List (Html msg)
contents =
    [ blogP [ text """
    Managing state in an Elm single-page application (SPA) requires careful structuring.
    Over time, I’ve refined an approach that balances simplicity and scalability.
    This post shares my methodology using a minimal example app covering:
    """ ]
    , blogP [ text """
    I thought it’d be helpful to share the approach I’ve so far standardized on - 
    and to do so I’ve build a very simple, plain web application demonstrating the
    various places where state is managed including:
    """ ]
    , blogList [
        "Simple pages that don’t need a model nor any commands"
        , "Stateful pages"
        , "A global template that itself has state"
    ]
    , blogP [ text """
    In this application, we also demonstrate how to implement Login, Logout and profile updates
    which impact other components (e.g. changing your name in the application should immediately
    update the global template).
    """ ]
    , blogP [ text """
    Hope you find this useful and if you have any suggestions, improvements or questions please do share!
    """ ]
    , blogExternalLink "https://github.com/mbryzek/state-management-in-elm" "View the code on GitHub"
    , blogExternalLink "https://monkfish-app-eiejy.ondigitalocean.app/" "View the live app"
    ]