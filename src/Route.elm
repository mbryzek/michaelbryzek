module Route exposing (Route(..), fromUrl)

import Url exposing (Url)
import Url.Parser exposing (..)


type Route
    = RouteIndex
    | RouteProjects
    | RouteBlog
    | RouteTalks


fromUrl : Url -> Maybe Route
fromUrl url =
    parse matchRoute url


matchRoute : Parser (Route -> a) a
matchRoute =
    oneOf
        [ map RouteIndex top
        , map RouteProjects (s "projects")
        , map RouteBlog (s "blog")
        , map RouteTalks (s "talks")
        ]
