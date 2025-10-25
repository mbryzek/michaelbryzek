module Route exposing (Route(..), fromUrl)

import Url exposing (Url)
import Url.Parser exposing (..)
import Urls


type Route
    = RouteIndex
    | RouteProjects
    | RouteBlogIndex
    | RouteBlogPost Urls.BlogPostParams
    | RouteTalks
    | RoutePbWaiver
    | RouteCourts


fromUrl : Url -> Maybe Route
fromUrl url =
    parse matchRoute url


matchRoute : Parser (Route -> a) a
matchRoute =
    oneOf
        [ map RouteIndex top
        , map RouteProjects (s "projects")
        , map RouteBlogIndex (s "blog")
        , map (\slug -> RouteBlogPost { slug = slug }) (s "blog" </> string)
        , map RouteTalks (s "talks")
        , map RoutePbWaiver (s "pb" </> s "waiver")
        , map RouteCourts (s "courts")
        ]
