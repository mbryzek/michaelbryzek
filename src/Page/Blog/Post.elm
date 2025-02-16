module Page.Blog.Post exposing (Model, init, view)

import Browser
import Posts.Common exposing (Post, findBlogPost, getContents, slugFromString)
import Templates.Shell as Shell
import Urls
import NotFound


type alias Model =
    { post : Maybe Post }


init : Urls.BlogPostParams -> Model
init params =
    { post = slugFromString params.slug |> Maybe.map findBlogPost }


view : Shell.ViewProps mainMsg -> Model -> Browser.Document mainMsg
view shellProps model =
    case model.post of
        Just post ->
            Shell.render shellProps Nothing [ getContents post ]

        Nothing ->
            NotFound.view
