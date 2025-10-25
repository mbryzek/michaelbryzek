-- codegen.global.state: GlobalStateAnonymousData
module Page.Courts exposing (view)

import Browser
import Html exposing (Html, a, div, footer, h1, header, img, p, section, source, text, video)
import Html.Attributes as Attr
import Templates.Shell as Shell


view : Shell.ViewProps mainMsg -> Browser.Document mainMsg
view props =
    Shell.render props Nothing [ contents ]


contents : Html msg
contents =
    div
        [ Attr.class "min-h-screen p-5"
        , Attr.style "background" "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        ]
        [ div
            [ Attr.class "max-w-screen-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden" ]
            [ pageHeader
            , timeline
            , pageFooter
            ]
        ]


pageHeader : Html msg
pageHeader =
    header
        [ Attr.class "text-white text-center py-16 px-10"
        , Attr.style "background" "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
        ]
        [ h1 [ Attr.class "text-5xl mb-2.5 font-bold" ] [ text "Courts with a View" ]
        , div [ Attr.class "w-full h-1.5 bg-gray-300 rounded-sm overflow-hidden my-5" ]
            [ div
                [ Attr.class "h-full animate-grow"
                , Attr.style "background" "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                , Attr.style "width" "100%"
                ]
                []
            ]
        ]


timeline : Html msg
timeline =
    div [ Attr.class "p-10" ]
        [ section1H2024
        , sectionNov2024
        , sectionMay2025
        , sectionJun2025
        , sectionJul2025
        , sectionAug2025
        , sectionSep2025
        , sectionOct2025
        , sectionCourtsComplete
        , sectionDronePhotography
        ]


monthSection : String -> String -> List (Html msg) -> Html msg
monthSection badge title photos =
    div
        [ Attr.class "mb-16 border-b-2 border-gray-100 pb-10 last:border-b-0" ]
        [ div [ Attr.class "flex items-center mb-8" ]
            [ div
                [ Attr.class "text-white py-3 px-6 rounded-full font-semibold text-lg mr-5 shadow-md"
                , Attr.style "background" "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                ]
                [ text badge ]
            , div [ Attr.class "text-2xl text-blue-900 font-semibold" ] [ text title ]
            ]
        , div [ Attr.class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5" ] photos
        ]


photoItem : String -> String -> String -> Html msg
photoItem url alt caption =
    div [ Attr.class "relative rounded-xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-gray-50" ]
        [ img [ Attr.src url, Attr.alt alt, Attr.attribute "loading" "lazy", Attr.class "w-full h-auto block" ] []
        , div [ Attr.class "p-4 bg-white text-sm text-gray-600 text-center" ] [ text caption ]
        ]


videoItem : String -> String -> Html msg
videoItem url caption =
    div [ Attr.class "relative rounded-xl overflow-hidden shadow-md bg-black" ]
        [ video [ Attr.controls True, Attr.attribute "preload" "metadata", Attr.class "w-full h-auto" ]
            [ source [ Attr.src url, Attr.type_ "video/quicktime" ] []
            , source [ Attr.src url, Attr.type_ "video/mp4" ] []
            , text "Your browser does not support the video tag."
            ]
        , div [ Attr.class "p-4 bg-white text-sm text-gray-600 text-center" ] [ text caption ]
        ]


section1H2024 : Html msg
section1H2024 =
    monthSection "1H 2024" "Site Selection"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2024-01-a.w800.JPG" "January 2024 - So beautiful" "So beautiful"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2024-06-a.w800.JPG" "June 2024 - Site before construction" "Original site view"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2024-06-b.w800.JPG" "June 2024 - Land of ferns" "Land of ferns"
        ]


sectionNov2024 : Html msg
sectionNov2024 =
    monthSection "Nov 2024" "Early Site Preparation"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2024-11-a.w800.jpg" "November 2024 - Site preparation begins" "Initial site work begins"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2024-11-b.w800.jpg" "November 2024 - Preparation progress" "Preparation work progressing"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2024-11-c.w800.jpg" "November 2024 - Site ready" "Site staged for construction"
        ]


sectionMay2025 : Html msg
sectionMay2025 =
    monthSection "May 2025" "First we need drainage"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-05-a.w800.jpg" "May 2025 - Drainage work begins" "Drainage installation begins"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-05-b.w800.jpg" "May 2025 - Water everywhere" "Water everywhere"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-05-c.w800.jpg" "May 2025 - 32 ton hammer!" "32 ton hammer!"
        ]


sectionJun2025 : Html msg
sectionJun2025 =
    monthSection "Jun 2025" "Foundation & Site Work"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-06-a.w800.JPG" "June 2025 - Early foundation work" "Early foundation work begins"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-06-b.w800.jpg" "June 2025 - Foundation progress" "Foundation work progressing"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-06-c.w800.jpg" "June 2025 - Fence posts installed" "Fence posts are in!"
        ]


sectionJul2025 : Html msg
sectionJul2025 =
    monthSection "Jul 2025" "Ground Preparation"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-07-a.w800.JPG" "July 2025 - Ground leveling" "Ground leveling and grading"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-07-b.w800.JPG" "July 2025 - Site preparation" "getting htere"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-07-c.w800.JPG" "July 2025 - Progress" "Progress!"
        ]


sectionAug2025 : Html msg
sectionAug2025 =
    monthSection "Aug 2025" "Concrete & Post-Tensioning"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-08-a.w800.JPG" "August 2025 - Pavilion construction" "Pavilion!"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-08-f.w800.jpeg" "August 2025 - Laying post tension cables" "Laying post tension cables"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-09-e.w800.jpg" "August 2025 - Finally the pour!!" "Finally the pour!!"
        , videoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-08-d.MOV" "Post-tensioning the concrete slab"
        ]


sectionSep2025 : Html msg
sectionSep2025 =
    monthSection "Sep 2025" "Getting Close!"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-09-a.w800.jpg" "September 2025 - Court completion" "Courts nearing completion"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-09-b.w800.JPEG" "September 2025 - Light pole construction" "Light pole construction"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-09-c.w800.JPEG" "September 2025 - Pro cushion installation" "Pro cushion installation"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-09-d.w800.JPEG" "September 2025 - Fencing" "Fencing"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-09-f.w800.jpg" "September 2025 - Clubhouse!" "Clubhouse!"
        ]


sectionOct2025 : Html msg
sectionOct2025 =
    monthSection "Oct 2025" "Final Touches & Completion"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-a.w800.jpg" "October 2025 - First coat of paint" "First coat of paint"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-b.w800.JPG" "October 2025 - Almost ready" "Courts nearly complete"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-c.w800.JPG" "October 2025 - Completed" "First Game!"
        ]


sectionCourtsComplete : Html msg
sectionCourtsComplete =
    div
        [ Attr.class "mb-16 border-b-2 border-gray-100 pb-10" ]
        [ div [ Attr.class "flex items-center mb-8" ]
            [ div
                [ Attr.class "text-white py-3 px-6 rounded-full font-semibold text-lg mr-5 shadow-md"
                , Attr.style "background" "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                ]
                [ text "Complete" ]
            , div [ Attr.class "text-2xl text-blue-900 font-semibold" ] [ text "Courts Complete" ]
            ]
        , div [ Attr.class "text-center py-5" ]
            [ img
                [ Attr.src "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-complete.w1200.JPG"
                , Attr.alt "Courts Complete"
                , Attr.attribute "loading" "lazy"
                , Attr.class "max-w-full h-auto rounded-xl shadow-lg"
                , Attr.style "max-width" "100%"
                ]
                []
            ]
        ]


sectionDronePhotography : Html msg
sectionDronePhotography =
    monthSection "Aerial View" "From Above - Drone Photography"
        [ photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-drone-a.w800.PNG" "Drone view - Complete facility overview" "Complete facility from above"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-drone-b.w800.PNG" "Drone view - Court with a view!" "Court with a view!"
        , photoItem "https://raw.githubusercontent.com/mbryzek/static/refs/heads/main/michaelbryzek/courts/2025-10-drone-c.w800.PNG" "Drone view - Above the clubhouse" "Above the clubhouse"
        ]


pageFooter : Html msg
pageFooter =
    footer [ Attr.class "bg-gray-50 py-8 text-center text-gray-600 text-sm" ]
        [ p [ Attr.class "font-bold" ] [ text "Court Development Timeline" ]
        , p [ Attr.class "mt-2.5" ] [ text "January 2024 - October 2025" ]
        ]
