module Posts.MotivationBehindTrueAcumen exposing (contents)

import Html exposing (Html, text)
import Ui.Elements exposing (externalLink)
import Posts.Style exposing (blogH2, blogP, blogListWithTitles)


contents : List (Html msg)
contents =
    [ blogP [ text "True Acumen has been a long-standing journey and a deeply personal passion project." ]
    , blogP [ text "The story begins in 2020, during the early months of the COVID-19 pandemic. One evening at the dinner table, I suggested that since we were all working and schooling from home, with more free time than usual, each of us should take on a personal project." ]
    , blogP [ text "My wife, Lisa, and I have two children who were still young at the time—Cameron, 14, and Julien, 11. Cameron was the first to respond, sharing that he was writing a novel. Julien thought for a moment before deciding to build an online game. Lisa, on the other hand, quickly declared, “I’m not doing that.” We all laughed. Then my kids turned the question back to me: “What’s your project going to be?”" ]
    , blogH2 [ text "Finding the Right Project" ]
    , blogP [ text "That was a good question. At work, we were in the early stages of discovery for a potential new product and were diving deep into the React library. I was interested to learn more about the technology and figured the best way to do that was by building something myself." ]
    , blogP [ text "At the same time, I realized that my interest in this project was also shaped by my background. My parents came to the U.S. as refugees in 1979 with just $300 to their name. I was two years old. It took time for them to get settled, and I remember what it was like growing up with very little. My mother carefully clipped coupons, never overspent on groceries, and we slept on the floor because we couldn’t afford furniture. Those early years had a lasting impact on me." ]
    , blogP [ text "I also vividly remember the weekend my wife and I ran out of money. Raising two kids on a single income outside of New York City was challenging, and we reached a point where we couldn’t pay our bills. Fortunately, we recovered quickly—but the experience stuck with me." ]
    , blogH2 [ text "The Birth of True Acumen" ]
    , blogP [ text "Back at the dinner table, I shared my idea: I’m going to create a personal expense and budgeting app for our family." ]
    , blogP [ text "By this time, I had tried at least 20 different budgeting tools—everything from Mint to QuickBooks—but nothing worked the way I needed it to. I didn’t think our needs were that unique, but there were a few things that were critical to me:" ]
    , blogListWithTitles [
        { title = "Minimal Effort, Maximum Clarity"
            , content = "I dislike setting aside time for big, tedious financial reviews. Instead of doing a major review at the end of the month, I wanted to spend just 30–60 seconds per day maintaining our expenses"
            }
        , { title = "Accurate Categorization"
            , content = "Almost every existing tool automatically categorizes transactions, but they all make mistakes. If you can’t trust the data, then any analysis built on top of it is flawed. I needed a system where I could tag every transaction myself—quickly and efficiently."
            }
        , { title = "Smart Delegation"
            , content = "Since my wife and I share a few accounts, I needed a way to delegate transaction categorization to her when necessary, but without making it a burden."
            }
        ]
    , blogP [ text "And so, I started building True Acumen. The first version was a simple React app that our family used during COVID. It was a prototype, but for the first time, I had a complete, accurate picture of our finances. That was a game-changer."]
    , blogP [ text "Then, an unexpected roadblock hit. Chase Bank changed its policies, and Plaid—the service I was using to fetch transactions—required an enterprise account with a security review. Our prototype was dead."]
    , blogH2 [ text "A New Beginning in 2024" ]
    , blogListWithTitles [
        { title = "Plaid reopened access to Chase transactions"
            , content = "I could again retrieve our financial data."
            }
        , { title = "I had sold my business, Flow Commerce"
            , content = "After launching with our partner Shopify and spending a few years growing the product, I had transitioned out of the company and now had a lot of free time."
            }
        , { title = "I discovered the Elm Language"
            , content = "Just like with React in 2020, I was interested in learning this new language and needed a project to experiment with it."
            }
        ]
    , blogP [ text "So, I got to work rewriting True Acumen in Elm. Just as I had everything back up and running for our family, two more unexpected events happened:"]
    , blogListWithTitles [
        { title = "Cameron started using True Acumen"
            , content = "My oldest had been diligently managing his expenses in a spreadsheet for years. When he told me that True Acumen had matured enough to replace his spreadsheet, I knew I was onto something."
            }
        , { title = "I had a sports accident"
            , content = "Suddenly, I was off my feet for 3–6 months and had a lot more unexpected time to focus on True Acumen."
            }
        ]
    , blogP [ text "At that point, I started to wonder: If True Acumen was helping our family so much, could it help others too?"]
    , blogH2 [ text "Today: Sharing True Acumen" ]
    , blogP [ text "And that brings us to today. I’m excited to share True Acumen as an alpha release with close friends and family. My goal is to learn how others find value in it and refine the product based on real-world feedback." ]
    , blogP [ text "If you’re interested in trying out True Acumen, I’d love for you to join our waitlist!" ]
    , externalLink [] "https://www.trueacumen.com/waitlist" [ text "Join the Waitlist" ]
    ]
