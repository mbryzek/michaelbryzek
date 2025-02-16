module Page.Blog.Post exposing (Model, init, view)

import Browser
import NotFound
import Posts.Common exposing (Post, findBlogPost, getContents)
import Templates.Shell as Shell
import Urls


type alias Model =
    { post : Maybe Post }


init : Urls.BlogPostParams -> Model
init params =
    { post = findBlogPost params.slug }


view : Shell.ViewProps mainMsg -> Model -> Browser.Document mainMsg
view shellProps model =
    case model.post of
        Just post ->
            case getContents post of
                Just contents ->
                    Shell.render shellProps Nothing [ contents ]

                Nothing ->
                    NotFound.view

        Nothing ->
            NotFound.view
