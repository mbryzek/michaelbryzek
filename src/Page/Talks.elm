module Page.Talks exposing (view)

import Browser
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Templates.Shell as Shell
import Ui.Elements exposing (h2, externalLink)


type alias Talk msg =
    { title : String
    , event : String
    , date : String
    , description : Html msg
    , videoUrl : String
    }


talks : List (Talk msg)
talks =
    [ { title = "Testing in Production"
      , event = "Software Unscripted Podcast"
      , date = "January 2025"
      , description = text "A conversation with Richard Feldman about embracing 'testing in production' as a way to improve overall quality of software. We dive into aligning organizational incentives, embracing true continuous delivery and some rarer practices including the elimination of testing and staging environments."
      , videoUrl = "https://www.youtube.com/watch?v=j6ow-UemzBc"
      }
    , { title = "Design Microservice Architectures the Right Way"
      , event = "QCon NYC 2018"
      , date = "September 2018"
      , description =
            div []
                [ text "A deep dive into how we designed and built the microservice architecture at Flow Commerce, based on the lessons we learned at Gilt Groupe. This talk has over 700k views as of 2025 and got a nice mention on the "
                , externalLink [] "https://news.ycombinator.com/item?id=18740939" [text "2018 best talks thread in hacker news"]
                ]
      , videoUrl = "https://www.youtube.com/watch?v=j6ow-UemzBc"
      }
    , { title = "Building a Startup in NYC"
      , event = "Startup Grind"
      , date = "December 2013"
      , description = text "This was a really fun talk for me with my family visiting in NYC. We talked about what it was like to build gilt.com - but also about my family's background escaping Poland and building a new life in America - events that have deeply shaped my own personality, work ethic, and values."
      , videoUrl = "https://www.youtube.com/watch?v=XWM_H3Acq8w&t=5s"
      }
    ]


view : Shell.ViewProps mainmsg -> Browser.Document mainmsg
view props =
    Shell.render props Nothing [ contents ]


contents : Html mainmsg
contents =
    div [ class "grid" ] (List.map viewTalk talks)


viewTalk : Talk msg -> Html msg
viewTalk talk =
    div
        [ class "bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 transition-colors" ]
        [ div
            [ class "flex items-start justify-between mb-2" ]
            [ div
                []
                [ h2 [] [ externalLink [] talk.videoUrl [ text talk.title ] ]
                , Html.p
                    [ class "text-gray-300 leading-relaxed italic" ]
                    [ text (talk.event ++ " • " ++ talk.date) ]
                ]
            ]
        , Html.p
            [ class "text-gray-300 leading-relaxed" ]
            [ talk.description ]
        ]
