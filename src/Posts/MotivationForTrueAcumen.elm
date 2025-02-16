module Posts.MotivationForTrueAcumen exposing (render)

import Html exposing (Html, div, h1, h2, p, text, ul, li, a)
import Html.Attributes exposing (class, href)

render : Html msg
render =
    div [ class "max-w-2xl mx-auto p-6 space-y-6" ]
        [ h1 [ class "text-3xl font-bold text-gray-800" ] [ text "The Journey to True Acumen: A Personal Passion Project" ]
        , p [ class "text-gray-600" ] [ text "True Acumen has been a long-standing journey and a deeply personal passion project." ]
        , p [ class "text-gray-600" ] [ text "The story begins in 2020, during the early months of the COVID-19 pandemic. One evening at the dinner table, I suggested that since we were all working and schooling from home, each of us should take on a personal project." ]
        , p [ class "text-gray-600" ] [ text "My wife, Lisa, and I have two children who were still young at the time—Cameron, 14, and Julien, 11. Cameron was the first to respond, sharing that he was writing a novel. Julien thought for a moment before deciding to build an online game. Lisa, on the other hand, quickly declared, “I’m not doing that.” We all laughed. Then my kids turned the question back to me: “What’s your project going to be?”" ]
        , h2 [ class "text-2xl font-semibold text-gray-700" ] [ text "Finding the Right Project" ]
        , p [ class "text-gray-600" ] [ text "That was a good question. At work, we were in the early stages of discovery for a potential new product and were diving deep into the React library. I was eager to learn more about the technology and figured the best way to do that was by building something myself." ]
        , p [ class "text-gray-600" ] [ text "At the same time, I realized that my interest in this project was also shaped by my background. My parents came to the U.S. as refugees in 1979 with just $300 to their name. I was two years old. It took time for them to get settled, and I remember what it was like growing up with very little." ]
        , h2 [ class "text-2xl font-semibold text-gray-700" ] [ text "The Birth of True Acumen" ]
        , p [ class "text-gray-600" ] [ text "Back at the dinner table, I shared my idea: I’m going to create a personal expense and budgeting app for our family." ]
        , ul [ class "list-disc pl-6 text-gray-600" ]
            [ li [] [ text "Minimal Effort, Maximum Clarity – Instead of monthly reviews, I wanted quick daily tracking." ]
            , li [] [ text "Accurate Categorization – Manual tagging was crucial to ensure data accuracy." ]
            , li [] [ text "Smart Delegation – My wife and I needed an easy way to split categorization tasks." ]
            ]
        , h2 [ class "text-2xl font-semibold text-gray-700" ] [ text "A New Beginning in 2024" ]
        , ul [ class "list-disc pl-6 text-gray-600" ]
            [ li [] [ text "Plaid reopened access to Chase transactions." ]
            , li [] [ text "I had sold my business, Flow Commerce." ]
            , li [] [ text "I discovered Elm and wanted to use it for a project." ]
            ]
        , p [ class "text-gray-600" ] [ text "So, I got to work rewriting True Acumen in Elm. Around the same time, my son Cameron started using it seriously, and I had a sports accident that put me on bed rest for months. With more time on my hands, I focused on refining the app." ]
        , h2 [ class "text-2xl font-semibold text-gray-700" ] [ text "Today: Sharing True Acumen" ]
        , p [ class "text-gray-600" ] [ text "And that brings us to today. I’m excited to share True Acumen as an alpha release with close friends and family. My goal is to learn how others find value in it and refine the product based on real-world feedback." ]
        , p [ class "text-gray-600" ] [ text "If you’re interested in trying out True Acumen, I’d love for you to join our waitlist!" ]
        , a [ class "text-blue-500 underline", href "#" ] [ text "Join the Waitlist" ]
        ]
