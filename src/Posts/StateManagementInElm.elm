module Posts.StateManagementInElm exposing (contents)

import Html exposing (Html, text, div, a)
import Html.Attributes exposing (class, href)
import Posts.Style exposing (..)
import Ui.Svgs exposing (githubIcon)


contents : List (Html msg)
contents =
    List.concat [
        intro
        , authentication
        , init
    ]


intro : List (Html msg)
intro =
    [ blogP [ text """
    Managing state in an Elm single-page application (SPA) requires careful structuring.
    Over time, I've refined an approach that balances simplicity and scalability.
    This post shares my methodology using a minimal example app covering:
    """ ]
    , blogP [ text """
    I thought it'd be helpful to share the approach I've so far standardized on - 
    and to do so I've built a simple, plain web application demonstrating the
    various places where state is managed including:
    """ ]
    , blogList [
        "Simple pages that don't need a model nor any commands"
        , "Stateful pages"
        , "A global template that itself has state"
        , "Session authentication and update"
    ]
    , blogP [ text """
    In this application, we also demonstrate how to implement Login, Logout and profile updates
    which impact other components (e.g. changing your name in the application should immediately
    update the global template).
    """ ]
    , blogP [ text """
    Hope you find this useful and if you have any suggestions, improvements or questions please do share!
    """ ]
    , div [class "flex mt-4 gap-x-4"] [
        blogButton "https://github.com/mbryzek/state-management-in-elm" [
            githubIcon
            , text "Source code"
        ]
        , blogButton "https://monkfish-app-eiejy.ondigitalocean.app/" [
            text "Live app"
        ]
    ]
    ]

authentication : List (Html msg)
authentication =
    [ blogH2 [ text "Authentication" ]
    , blogP [ text """
    I've found that it has been helpful to handle most of Authentication in Main.elm.
    My approach has been to define a type "GlobalState" which tracks authentication status.
    In all cases, we keep track of the Nav Key and the current URL. If a user is
    successfully authenticated, we also keep track of the Session.
    """ ]
    , blogCode """
type GlobalState
    = GlobalStateAnonymous GlobalStateAnonymousData
    | GlobalStateAuthenticated GlobalStateAuthenticatedData


type alias GlobalStateAnonymousData =
    { navKey : Nav.Key
    , currentUrl : Url
    }


type alias GlobalStateAuthenticatedData =
    { navKey : Nav.Key
    , currentUrl : Url
    , session : Session
    }
    """
    , blogP [ text """
    Within Main, we need to first initialize the state and then route to the appropriate page.
    This also means that we can centralize the logic on when to ask the user to login or register directly
    in Main.
    """ ]
    , blogP [ text """
    To handle initialization, we declare the Model in Main as either being in the init state (InitModel) or Ready (ReadyModel).
    Note here you will also see our Shell.Model introduced which will store all of the state needed for the Template.
    """ ]
    , blogCode """
type Model
    = Init InitModel
    | Ready ReadyModel


type alias InitModel =
    { sessionId : String
    , url : Url.Url
    , key : Nav.Key
    }


type alias ReadyModel =
    { global : GlobalState
    , shellModel : Shell.Model
    , page : Page
    }
"""
    , blogP [ text """
    In Main, if we are provided a Session ID, we will then load the session and upon completion continue with a ready model.

    """]
    ]



init : List (Html msg)
init =
    [ blogH2 [text "Page Initialization"]
    , blogP [ text """
    In page initialization, we keep track of whether or not a particular page requires the user to have
    already authenticated. If so, we check authentication and either redirect to the login page or
    provide the authenticated data to the page.
    """ ]
    , blogCode """
pageAuthenticatedData : GlobalState -> (GlobalStateAuthenticatedData -> ( Page, Cmd PageMsg )) -> ( Page, Cmd PageMsg )
pageAuthenticatedData global f =
    case global of
        GlobalStateAuthenticated data ->
            f data

	_ ->
            ( PageNotAuthorized, Nav.pushUrl (Global.getNavKey global) "/login" )
    """
    , blogCode """
getPageFromRoute : GlobalState -> Maybe Route -> ( Page, Cmd PageMsg )
getPageFromRoute global maybeRoute =
    case maybeRoute of
    	Just Route.RouteRestricted ->
            pageAuthenticatedData global (\\g ->
                ( PageRestricted.init g |> PageRestricted, Cmd.none)
"""
    ]

