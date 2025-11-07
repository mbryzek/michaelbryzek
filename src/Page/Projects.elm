-- codegen.global.state: GlobalStateAnonymousData
module Page.Projects exposing (view)

import Browser
import Html exposing (Html, div, text)
import Html.Attributes as Attr
import Templates.Shell as Shell
import Ui.Elements exposing (h2, p, externalLink)
import Ui.Svgs exposing (..)
import Posts.Common exposing (Slug(..), slugToString)
import Urls


type alias Project =
    { name : String
    , description : List String
    , githubUrl : Maybe String
    , projectUrl : Maybe String
    , blogUrl : Maybe String
    }


projects : List Project
projects =
    [ { name = "Private Dinkers"
      , description =
            [ "AI-powered pickleball game scheduling application making it easy to schedule great games with your favorite players."
            ]
      , githubUrl = Nothing
      , projectUrl = Just "https://privatedinkers.com"
      , blogUrl = Nothing
      }
    , { name = "True Acumen"
      , description =
            [ "Simple, accurate expense and budget management."
            , "I recently have become really obsessed with making it easy to track family expenses and to make a simple budget."
            ]
      , githubUrl = Nothing
      , projectUrl = Just "https://www.trueacumen.com"
      , blogUrl = Just (Urls.blogPost { slug = slugToString SlugMotivationBehindTrueAcumen })
      }
    , { name = "API Builder"
      , description =
            [ "Simple, Comprehensive Tooling for Modern APIs."
            , "A project we started at Gilt when we needed to build client SDKs to access our APIs from multiple languages, including Ruby, Java, Scala, Swift, Objective C, Kotlin, etc."
            , "We also built Flow Commerce on the back of API Builder - helping us build a high quality, broad API Platform."
            ]
      , githubUrl = Just "https://github.com/apicollective/apibuilder"
      , projectUrl = Just "https://www.apibuilder.io"
      , blogUrl = Nothing
      }
    , { name = "Schema Evolution Manager"
      , description =
            [ "Easily manage schema evolutions as independent artifacts for Postgresql Databases."
            , "This project is mature, well tested and used in production for over a decade. "
            , "The main idea is to separate schema evolutions from application changes making it easier to ensure application changes can be successfully rolled back."
            ]
      , githubUrl = Just "https://github.com/mbryzek/schema-evolution-manager"
      , projectUrl = Nothing
      , blogUrl = Nothing
      }
    , { name = "Bergen Tech Hackathon"
      , description =
            [ "We run an annual Hackathon at our local high school encouraging and introducing students to the passion we share for computer science. "
            , "This competition website is built in Elm and open source as an example for the students."
            ]
      , githubUrl = Just "https://github.com/mbryzek/hackathon"
      , projectUrl = Just "https://www.bthackathon.com"
      , blogUrl = Nothing
      }
    , { name = "Home Owners Association Management Platform"
      , description =
            [ "I'm currently the president of our homeowner's assocation in the Poconos, PA. "
            , "I built this project to help manage our community with a focus on contact information, bills and key resources."
            ]
      , githubUrl = Nothing
      , projectUrl = Just "https://www.hemlockpoint.net"
      , blogUrl = Nothing
      }
    , { name = "Personal Website"
      , description =
            [ "This is the source code for this website, built with Elm."
            ]
      , githubUrl = Just "https://github.com/mbryzek/michaelbryzek"
      , projectUrl = Nothing
      , blogUrl = Nothing
      }
    ]


view : Shell.ViewProps mainMsg -> Browser.Document mainMsg
view props =
    Shell.render props Nothing [ contents ]


contents : Html msg
contents =
    div []
        [ div
            [ Attr.class "grid grid-cols-1 md:grid-cols-2 gap-6" ]
            (List.map projectCard projects)
        ]


projectCard : Project -> Html msg
projectCard project =
    div
        [ Attr.class "bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors" ]
        (List.append
            [ div
                [ Attr.class "flex items-start justify-between mb-4" ]
                [ h2 [] [ text project.name ]
                , div
                    [ Attr.class "flex gap-x-4" ]
                    [ link websiteIcon project.projectUrl
                    , link githubIcon project.githubUrl
                    , link blogIcon project.blogUrl
                    ]
                ]
            ]
            (List.map (\t -> p [] [ text t ]) project.description)
        )


link : Html msg -> Maybe String -> Html msg
link icon url =
    case url of
        Just u ->
            externalLink [] u [ icon ]

        Nothing ->
            text ""
