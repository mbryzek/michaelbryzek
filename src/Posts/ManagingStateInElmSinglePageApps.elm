module Posts.ManagingStateInElmSinglePageApps exposing (contents)

import Html exposing (Html, text)
import Posts.Style exposing (blogP, blogH2, blogList, blogCode)
import Ui.Elements exposing (externalLink)

contents : List (Html msg)
contents =
    [ blogP [ text "I've now built a few different applications in Elm - everything from simple event websites to more complex SAAS based applications. I've iterated multiple times on structuring single-page applications in Elm. My focus has been on managing state efficiently across pages, templates, and shared components that can be rendered across multiple pages." ]
    , blogP [ text "I thought it'd be helpful to share the approach I've so far standardized on - and to do so I've built a very simple, plain web application demonstrating the various places where state is managed including:" ]
    , blogList [
        "Simple pages that don't need a model nor any commands",
        "Stateful pages",
        "A global template that itself has state"
    ]
    , blogP [ text "In this application, we also demonstrate how to implement Login, Logout and profile updates which may then impact other components (e.g. changing your name in the application should immediately update the global template)." ]
    , blogP [ text "Hope you find this useful and if you have any suggestions, improvements or questions please do share!" ]
    , blogH2 [ text "Source Code & Live Demo" ]
    , blogP [ text "Source Code: ", externalLink [] "https://github.com/mbryzek/state-management-in-elm" [text "GitHub Repo"]]
    , blogH2 [ text "Authentication" ]
    , blogP [ text "I've found that it has been helpful to handle authentication in Main.elm as this provides a single place to check state and enables us to create pages that document whether or not they require a user to be logged in." ]
    , blogP [ text "My approach has been to define a type 'GlobalState' type which tracks authentication status:" ]
    , blogCode [
        "type GlobalState"
        , "   = GlobalStateAnonymous GlobalStateAnonymousData"
        , "   | GlobalStateAuthenticated GlobalStateAuthenticatedData"
        ]
    , blogP [ text "Within main then, we need to first initialize the state and then route to the appropriate page. This also means that we can centralize the logic on when to ask the user to login or register directly from Main." ]
    , blogP [ text "To handle initialization, we declare the Model in Main as either being in the init state (InitModel) or Ready (ReadyModel)." ]
    , blogCode [
        "type Model"
        , "   = Init InitModel"
        , "   | Ready ReadyModel"
        ]
    , blogP [ text "If we initialize the application with a session id - we will then load the session and upon completion continue with a ready model." ]
    , blogP [ text "Example of redirecting the user to login as necessary:" ]
    , blogCode [
        "Just Route.RouteRestricted ->\n"
        , "    pageAuthenticatedData global (\\g ->\n"
        , "        ( PageRestricted.init g |> PageRestricted, Cmd.none)\n"
        , "    )"
        ]
    , blogP [ text "The method pageAuthenticatedData will parse the global state and either redirect the user to login or else init PageRestricted, passing in the fully authenticated information." ]
    , blogH2 [ text "Update" ]
    , blogP [ text "When invoking update from Main, we construct the arguments we need based on what the page requires. Possibilities include:" ]
    , blogList 
        [ "The specific type of GlobalState the page requires",
        "A msgMap to convert page messages back into the Main Msg type. We'll need this when handling login or other events",
        "Variants to handle onLoggedIn, onLoggedOut, OnSessionUpdate which are essentially callbacks to Main when one of these events happen."
        ]
    , blogP [ text "For pages that use the global template (called Shell in this application), we provide the Shell.ViewProps which contain the model for the Shell itself as well as a function to map messages in the template to the Main Msg type" ]
    , blogP [ text "The key design goals here are to:" ]
    , blogList 
        [ "Minimize the boilerplate in Pages by providing only what the page needs",
        "Centralizing key State where it belongs - Main owns the Global State. Shell owns the Shell Model. All operations on this state have a single owner and the current state is passed to pages or components as needed."
        ]
    , blogP [ text "As an example - when you increment the counter in the header, that message is handled by the ShellMsg defined in Main - and then updates are passed in explicitly to all pages that render the template. This is how we ensure state changes propagate immediately to all components." ]
    , blogH2 [ text "Public Page" ]
    , blogP [ text "The page Content is available to all users. This page does not actually need any global data in any of the normal Elm functions (init, update, view) and thus uses a comment to specify that the page should be accessible by anonymous users:" ]
    , blogCode [
        "-- codegen.global.state: GlobalStateAnonymousData"
        , "module Page.Content exposing (view)"
        ]
    , blogH2 [ text "Restricted Page" ]
    , blogP [ text "The page Restricted is available only to logged in users, but similarly does not access Global State in any of the standard elm functions. Thus we document that authentication is required with a comment:" ]
    , blogCode [
        "-- codegen.global.state: GlobalStateAuthenticatedData"
        , "module Page.Restricted exposing (Model, Article, init, view)"
        ]
    , blogH2 [ text "Code Generation" ]
    , blogP [ text "In my own work and applications, I use a built code generators which works by:" ]
    , blogList 
        [ "Find all files under src/Page",
        "Parse the init, update, and view functions to understand the arguments and return values",
        "Generates the code you see in Main.elm based on the type signatures of those functions"
        ]
    , blogP [ text "Broadly the goal is to fully standardize the inputs to the various pages to enable features like code generation which can be helpful as applications grow." ]
    , blogH2 [ text "Thank you" ]
    , blogP [
        text "A big thank you to Richard Feldman for his original work on an "
        , externalLink [] "https://github.com/rtfeldman/elm-spa-example" [text "Elm Spa example"]
        , text " and to Dwayne Crooks for his recent example "
        , externalLink [] "https://discourse.elm-lang.org/t/announcing-dwayne-elm-conduit-a-replacement-for-rtfeldman-elm-spa-example/9758" [text "Dwayne's Conduit"]
        ]
    , blogP [ text "Have suggestions or comments? Please find me on X @mbryzek" ]
    ]
