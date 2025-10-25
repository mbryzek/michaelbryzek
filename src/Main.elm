module Main exposing (Model, Msg, main)

import Browser
import Browser.Navigation as Nav
import Global exposing (GlobalState, MainViewProps)
import NotFound
import Route exposing (Route)
import Templates.Shell as Shell
import Url
import Page.Blog.Index as PageBlogIndex
import Page.Blog.Post as PageBlogPost
import Page.Courts as PageCourts
import Page.Index as PageIndex
import Page.PbWaiver as PagePbWaiver
import Page.Projects as PageProjects
import Page.Talks as PageTalks


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }


type Model
    = Ready ReadyModel


type alias ReadyModel =
    { global : GlobalState
    , page : Page
    , shellModel : Shell.Model
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    initWithGlobal { navKey = key, url = url }


initWithGlobal : GlobalState -> ( Model, Cmd Msg )
initWithGlobal global =
    let
        ( shellModel, shellCmd ) =
            Shell.init

        ( page, cmd ) =
            Route.fromUrl global.url
                |> getPageFromRoute
    in
    ( Ready
        { global = global
        , page = page
        , shellModel = shellModel
        }
    , Cmd.batch
        [ Cmd.map (ReadyMsg << ChangedPage) cmd
        , Cmd.map (ReadyMsg << ChangedInternal << ShellMsg) shellCmd
        ]
    )


type Msg
    = ReadyMsg ReadyMsg
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


type ReadyMsg
    = ChangedInternal InternalMsg
    | ChangedPage PageMsg


type InternalMsg
    = ShellMsg Shell.Msg


redirectTo : Model -> String -> Cmd Msg
redirectTo model url =
    let
        key : Nav.Key
        key =
            case model of
                Ready rm ->
                    Global.getNavKey rm.global
    in
    Nav.pushUrl key url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( LinkClicked urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, redirectTo model (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        ( UrlChanged url, Ready readyModel ) ->
            let
                ( page, cmd ) =
                    Route.fromUrl url
                        |> getPageFromRoute
            in
            ( Ready { readyModel | page = page, global = updateGlobalState readyModel.global url }
            , Cmd.map (ReadyMsg << ChangedPage) cmd
            )

        ( ReadyMsg readyMsg, Ready readyModel ) ->
            updateReady readyMsg readyModel |> Tuple.mapFirst (\m -> Ready m)


updateGlobalState : GlobalState -> Url.Url -> GlobalState
updateGlobalState global url =
    { global | url = url }


updateReady : ReadyMsg -> ReadyModel -> ( ReadyModel, Cmd Msg )
updateReady msg model =
    case msg of
        ChangedInternal internalMsg ->
            updateInternal internalMsg model

        ChangedPage pageMsg ->
            updatePage model pageMsg
                |> Tuple.mapFirst (\page -> { model | page = page })


updateInternal : InternalMsg -> ReadyModel -> ( ReadyModel, Cmd Msg )
updateInternal msg model =
    case msg of
        ShellMsg shellMsg ->
            let
                ( shellModel, shellCmd ) =
                    Shell.update (shellViewProps model) shellMsg
            in
            ( { model | shellModel = shellModel }
            , Cmd.map (ReadyMsg << ChangedInternal << ShellMsg) shellCmd
            )


shellViewProps : ReadyModel -> Shell.ViewProps Msg
shellViewProps model =
    { global = model.global
    , shellModel = model.shellModel
    , onShellMsg = ReadyMsg << ChangedInternal << ShellMsg
    }


mainViewProps : GlobalState -> (a -> PageMsg) -> MainViewProps a Msg
mainViewProps global a =
    { global = global
    , msgMap = ReadyMsg << ChangedPage << a
    }


view : Model -> Browser.Document Msg
view model =
    case model of
        Ready readyModel ->
            viewReady readyModel


subscriptions : Model -> Sub Msg
subscriptions _ =
    pageSubscriptions |> Sub.map (ReadyMsg << ChangedPage)



-- Organized so the below can be code generated
-- CODEGEN START
pageSubscriptions : Sub PageMsg
pageSubscriptions =
    Sub.none


type Page
    = PageBlogIndex
    | PageBlogPost PageBlogPost.Model
    | PageCourts
    | PageIndex
    | PagePbWaiver PagePbWaiver.Model
    | PageProjects
    | PageTalks
    | PageNotFound


type PageMsg
    = PageBlogIndexMsg PageBlogIndex.Msg
    | PagePbWaiverMsg PagePbWaiver.Msg


getPageFromRoute : Maybe Route -> ( Page, Cmd PageMsg )
getPageFromRoute maybeRoute =
    case maybeRoute of
        Just (Route.RouteBlogPost params)->
            ( PageBlogPost.init params |> PageBlogPost, Cmd.none)

        Just Route.RoutePbWaiver ->
            PagePbWaiver.init
                |> Tuple.mapFirst PagePbWaiver
                |> Tuple.mapSecond (Cmd.map PagePbWaiverMsg)
        Just Route.RouteBlogIndex ->
            ( PageBlogIndex, Cmd.none )
        Just Route.RouteCourts ->
            ( PageCourts, Cmd.none )
        Just Route.RouteIndex ->
            ( PageIndex, Cmd.none )
        Just Route.RouteProjects ->
            ( PageProjects, Cmd.none )
        Just Route.RouteTalks ->
            ( PageTalks, Cmd.none )

        Nothing ->
            ( PageNotFound, Cmd.none )


viewReady : ReadyModel -> Browser.Document Msg
viewReady model =
    case model.page of
        PageBlogIndex ->
            PageBlogIndex.view (mainViewProps model.global PageBlogIndexMsg) (shellViewProps model)

        PageBlogPost pageModel ->
            PageBlogPost.view (shellViewProps model) pageModel

        PageCourts ->
            PageCourts.view (shellViewProps model)

        PageIndex ->
            PageIndex.view (shellViewProps model)

        PagePbWaiver _ ->
            PagePbWaiver.view (mainViewProps model.global PagePbWaiverMsg)

        PageProjects ->
            PageProjects.view (shellViewProps model)

        PageTalks ->
            PageTalks.view (shellViewProps model)

        PageNotFound ->
            NotFound.view


updatePage : ReadyModel -> PageMsg -> ( Page, Cmd Msg )
updatePage model msg =
    case ( model.page, msg ) of
        ( PageBlogIndex, PageBlogIndexMsg pageMsg ) ->
            PageBlogIndex.update model.global pageMsg
                |> \c -> (model.page, Cmd.map (ReadyMsg << ChangedPage << PageBlogIndexMsg) c)

        ( PagePbWaiver pageModel, PagePbWaiverMsg pageMsg ) ->
            PagePbWaiver.update pageMsg pageModel
                |> Tuple.mapFirst PagePbWaiver
                |> Tuple.mapSecond (Cmd.map (ReadyMsg << ChangedPage << PagePbWaiverMsg))

        ( page, _ ) ->
            ( page, Cmd.none )