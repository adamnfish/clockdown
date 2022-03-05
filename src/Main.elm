module Main exposing (..)

import Browser
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html exposing (Html)
import List.Extra
import Maybe.Extra
import Svg
import Svg.Attributes
import Task
import Time exposing (Posix, millisToPosix, posixToMillis)



---- MODEL ----


type alias Model =
    { lifecycle : Lifecycle
    , now : Posix
    , resources : Resources
    }


type alias Resources =
    { stripesSvg : String
    }


type Lifecycle
    = Welcome GameSettings
    | Clock Timer


type alias GameSettings =
    { count : Count
    , players : List Color
    }


type alias Timer =
    { count : Count
    , players : List Player
    , paused : Maybe Posix
    }


type Count
    = Down Int
    | Up


type Player
    = Active Posix Int Color
    | Thinking Int Color


colours =
    { red = rgb255 180 100 100
    , blue = rgb255 100 150 180
    , green = rgb255 100 180 100
    , yellow = rgb255 180 180 100
    , purple = rgb255 150 100 180
    , orange = rgb255 200 120 80
    , brown = rgb255 100 60 10
    }


init : Resources -> ( Model, Cmd Msg )
init resources =
    ( { lifecycle =
            Welcome
                { count = Up, players = [ colours.red, colours.blue ] }
      , now = millisToPosix 0
      , resources = resources
      }
    , Task.perform Tick Time.now
    )



---- UPDATE ----


type Msg
    = NoOp
    | Tick Posix
    | UpdateGameSettings GameSettings
    | AddPlayer Color
    | Start
    | FirstPlayer Color -- TODO: swap for index
    | Pause
    | Next


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        Tick time ->
            ( { model | now = time }
            , Cmd.none
            )

        UpdateGameSettings newGameSettings ->
            case model.lifecycle of
                Welcome gameSettings ->
                    ( { model | lifecycle = Welcome newGameSettings }
                    , Cmd.none
                    )

                Clock timer ->
                    -- TODO: handle this
                    ( model, Cmd.none )

        AddPlayer colour ->
            case model.lifecycle of
                Welcome gameSettings ->
                    let
                        newGameSettings =
                            { gameSettings | players = gameSettings.players ++ [ colour ] }
                    in
                    ( { model | lifecycle = Welcome newGameSettings }
                    , Cmd.none
                    )

                Clock timer ->
                    -- TODO: handle this
                    ( model, Cmd.none )

        Start ->
            case model.lifecycle of
                Welcome gameSettings ->
                    ( { model
                        | lifecycle =
                            Clock
                                { count = gameSettings.count
                                , players =
                                    List.map (Thinking 0) gameSettings.players
                                , paused = Nothing
                                }
                      }
                    , Cmd.none
                    )

                Clock _ ->
                    -- TODO: handle thia
                    ( model, Cmd.none )

        FirstPlayer colour ->
            case model.lifecycle of
                Welcome _ ->
                    -- TODO: handle thia
                    ( model, Cmd.none )

                Clock timer ->
                    let
                        newPlayers =
                            List.map
                                (\p ->
                                    case p of
                                        Thinking acc playerColour ->
                                            if colour == playerColour then
                                                Active model.now acc playerColour

                                            else
                                                p

                                        Active _ _ _ ->
                                            p
                                )
                                timer.players
                    in
                    ( { model | lifecycle = Clock { timer | players = newPlayers } }
                    , Cmd.none
                    )

        Pause ->
            case model.lifecycle of
                Welcome _ ->
                    -- TODO: handle thia
                    ( model, Cmd.none )

                Clock timer ->
                    case timer.paused of
                        Just pausedTime ->
                            let
                                elapsedPauseMs =
                                    posixToMillis model.now - posixToMillis pausedTime

                                adjustedPlayers =
                                    List.map
                                        (\p ->
                                            case p of
                                                Active when acc colour ->
                                                    Active
                                                        (millisToPosix (posixToMillis when + elapsedPauseMs))
                                                        acc
                                                        colour

                                                Thinking acc colour ->
                                                    Thinking acc colour
                                        )
                                        timer.players

                                newTimer =
                                    { timer
                                        | paused = Nothing
                                        , players = adjustedPlayers
                                    }
                            in
                            ( { model | lifecycle = Clock newTimer }
                            , Cmd.none
                            )

                        Nothing ->
                            let
                                newTimer =
                                    { timer | paused = Just model.now }
                            in
                            ( { model | lifecycle = Clock newTimer }
                            , Cmd.none
                            )

        Next ->
            case model.lifecycle of
                Welcome _ ->
                    ( model
                    , Cmd.none
                    )

                Clock timer ->
                    let
                        isActive p =
                            case p of
                                Active _ _ _ ->
                                    True

                                Thinking _ _ ->
                                    False

                        deactivate p =
                            case p of
                                Active when acc colour ->
                                    let
                                        newAcc =
                                            acc + (posixToMillis model.now - posixToMillis when)
                                    in
                                    Thinking newAcc colour

                                Thinking acc colour ->
                                    Thinking acc colour

                        activate p =
                            case p of
                                Active when acc colour ->
                                    Active when acc colour

                                Thinking acc colour ->
                                    Active model.now acc colour

                        newPlayers =
                            updateAfter deactivate activate isActive timer.players

                        newTimer =
                            { timer | players = newPlayers }
                    in
                    ( { model | lifecycle = Clock newTimer }
                    , Cmd.none
                    )


activeColour : List Player -> Maybe Color
activeColour players =
    List.head <|
        List.filterMap
            (\p ->
                case p of
                    Active _ _ colour ->
                        Just colour

                    Thinking _ _ ->
                        Nothing
            )
            players


{-| Updates elements, depending on whether the previous matched a predicate.

f1 is used for elements where the previous does not match.
f2 is used for elements where the previous element matched the predicate.

-}
updateAfter : (a -> b) -> (a -> b) -> (a -> Bool) -> List a -> List b
updateAfter f1 f2 p aa =
    let
        offset =
            case ( List.Extra.init aa, List.Extra.last aa ) of
                ( Just firsts, Just last ) ->
                    last :: firsts

                _ ->
                    []

        windows =
            List.Extra.zip aa offset
    in
    List.map
        (\( a, toCheck ) ->
            if p toCheck then
                f2 a

            else
                f1 a
        )
        windows



---- VIEW ----


view : Model -> Html Msg
view model =
    layout
        [ Background.color <| rgb255 80 80 80 ]
    <|
        ui model


ui : Model -> Element Msg
ui model =
    column
        [ width fill
        , height fill
        , Font.color <| rgba255 230 230 230 0.8
        ]
        [ row
            [ width fill
            , alignTop
            , padding 12
            , Background.color <| rgb255 50 50 50
            , Border.widthEach
                { bottom = 1
                , top = 0
                , left = 0
                , right = 0
                }
            , Border.color <| rgb255 200 200 200
            ]
            [ text "clockdown"
            ]
        , row
            [ width fill
            , height fill
            , alignTop
            ]
            [ case model.lifecycle of
                Welcome gameSettings ->
                    welcomeScreen model gameSettings

                Clock timer ->
                    clockScreen model timer
            ]
        ]


welcomeScreen : Model -> GameSettings -> Element Msg
welcomeScreen model gameSettings =
    let
        nextColour =
            if not <| List.member colours.yellow gameSettings.players then
                colours.yellow

            else if not <| List.member colours.purple gameSettings.players then
                colours.purple

            else if not <| List.member colours.orange gameSettings.players then
                colours.orange

            else
                let
                    next =
                        50 + List.length gameSettings.players
                in
                rgb255 next next next
    in
    column
        [ width fill
        , height fill
        ]
        [ row
            [ width fill
            , paddingEach
                { top = 16
                , bottom = 8
                , left = 16
                , right = 16
                }
            , spacing 8
            ]
            [ Input.button
                [ width <| fillPortion 3
                , height <| px 150
                , Background.color <| rgb255 100 100 100
                , Border.width 4
                , Border.color <| rgb255 200 200 200
                , Font.center
                ]
                { onPress = Just Start
                , label =
                    text "Start"
                }
            , Input.button
                [ width <| fillPortion 1
                , height <| px 150
                , Background.color <| rgb255 100 100 100
                , Border.width 4
                , Border.color <| rgb255 200 200 200
                , Font.center
                ]
                { onPress = Just <| AddPlayer nextColour
                , label =
                    text "+ player"
                }
            ]
        , column
            [ width fill
            , height fill
            , paddingEach
                { top = 8
                , bottom = 16
                , left = 16
                , right = 16
                }
            , spacing 8
            ]
          <|
            List.map
                (\colour ->
                    el
                        [ width fill
                        , height fill
                        , Background.color colour
                        ]
                    <|
                        Element.none
                )
                gameSettings.players
        ]


clockScreen : Model -> Timer -> Element Msg
clockScreen model timer =
    let
        allPlayersThinking =
            List.all
                (\p ->
                    case p of
                        Thinking _ _ ->
                            True

                        _ ->
                            False
                )
                timer.players

        isPaused =
            Maybe.Extra.isJust timer.paused
    in
    column
        [ width fill
        , height fill
        , padding 16
        , spacing 16
        ]
        [ row
            [ width fill
            , spacing 8
            ]
            [ el
                [ width <| fillPortion 3 ]
                Element.none
            , case activeColour timer.players of
                Nothing ->
                    el
                        [ width <| fillPortion 1
                        , height <| px 150
                        , Background.color <| rgb255 100 100 100
                        , Border.width 4
                        , Border.color <| rgb255 100 100 100
                        ]
                    <|
                        el [ centerX, centerY ] <|
                            text "-"

                Just colour ->
                    Input.button
                        [ width <| fillPortion 1
                        , height <| px 100
                        , Background.color
                            (if isPaused then
                                colour

                             else
                                rgba255 0 0 0 0
                            )
                        , Border.width 4
                        , Border.color <| rgb255 200 200 200
                        , Font.center
                        ]
                        { onPress =
                            Just Pause
                        , label =
                            if isPaused then
                                text "Resume"

                            else
                                text "Pause"
                        }
            ]
        , column
            [ width fill
            , height fill
            , spacing 16
            ]
          <|
            List.indexedMap
                (\i p ->
                    let
                        rotation =
                            --if modBy 2 i == 0 then
                            --    rotate ((2 * pi) / (toFList.length timer.players))
                            --
                            --else
                            rotate 0
                    in
                    case p of
                        Active when acc colour ->
                            let
                                timeDelta =
                                    case timer.paused of
                                        Just pausedTime ->
                                            (posixToMillis model.now - posixToMillis when) - (posixToMillis model.now - posixToMillis pausedTime)

                                        Nothing ->
                                            posixToMillis model.now - posixToMillis when
                            in
                            el
                                [ width fill
                                , height fill
                                , Background.color colour
                                ]
                            <|
                                if isPaused then
                                    el
                                        [ width fill
                                        , height fill
                                        , Border.color <| rgb255 180 180 180
                                        , Border.width 8
                                        , Background.tiled model.resources.stripesSvg
                                        ]
                                    <|
                                        el [ centerX, centerY, rotation, Font.size 40 ] <|
                                            formatTime (timeDelta + acc)

                                else
                                    Input.button
                                        [ width fill
                                        , height fill
                                        , Background.color colour
                                        , Border.color <| rgb255 180 180 180
                                        , Border.width 8
                                        ]
                                        { onPress = Just Next
                                        , label =
                                            el
                                                [ centerX, centerY, rotation, Font.size 40 ]
                                            <|
                                                formatTime (timeDelta + acc)
                                        }

                        Thinking acc colour ->
                            el
                                [ width fill
                                , height fill
                                ]
                            <|
                                if allPlayersThinking then
                                    Input.button
                                        [ width fill
                                        , height fill
                                        , Background.color <| rgb255 100 100 100
                                        , Border.color colour
                                        , Border.width 8
                                        , Font.center
                                        ]
                                        { onPress = Just <| FirstPlayer colour
                                        , label = el [ centerX, centerY, rotation, Font.size 30 ] <| text "start"
                                        }

                                else
                                    el
                                        [ width fill
                                        , height fill
                                        , Background.color <| rgb255 100 100 100
                                        , Border.color colour
                                        , Border.width 8
                                        ]
                                    <|
                                        el [ centerX, centerY, rotation, Font.size 30 ] <|
                                            formatTime acc
                )
                timer.players
        ]


formatTime : Int -> Element Msg
formatTime millis =
    let
        totalSeconds =
            millis // 1000

        minutes =
            totalSeconds // 60

        seconds =
            modBy 60 totalSeconds
    in
    el
        [ Font.shadow
            { offset = ( 1, 1 )
            , blur = 1
            , color = rgb255 50 50 50
            }
        ]
        (if minutes > 0 then
            row
                [ width fill ]
                [ text <| String.fromInt minutes
                , text "' "
                , text <| String.padLeft 2 '0' <| String.fromInt seconds
                , text "\""
                ]

         else
            text <| (String.fromInt totalSeconds ++ "\"")
        )


stripedBg : Color -> Element Msg
stripedBg colour =
    html <|
        Svg.svg
            [ Svg.Attributes.width "100%"
            , Svg.Attributes.height "100%"
            , Svg.Attributes.viewBox "0 0 100 100"
            ]
            [ Svg.defs
                []
                [ Svg.pattern
                    [ Svg.Attributes.id "stripes_pattern"
                    , Svg.Attributes.patternUnits "userSpaceOnUse"
                    , Svg.Attributes.width "15"
                    , Svg.Attributes.height "15"
                    , Svg.Attributes.patternTransform "rotate(45)"
                    ]
                    [ Svg.line
                        [ Svg.Attributes.x1 "0"
                        , Svg.Attributes.y "0"
                        , Svg.Attributes.x2 "0"
                        , Svg.Attributes.y2 "15"
                        , Svg.Attributes.stroke <| rgbToStyle <| toRgb colour
                        , Svg.Attributes.strokeWidth "20"
                        ]
                        []
                    ]
                ]
            , Svg.rect
                [ Svg.Attributes.width "100%"
                , Svg.Attributes.height "100%"
                , Svg.Attributes.fill "url(#stripes_pattern)"
                , Svg.Attributes.opacity "1"
                ]
                []
            ]


to255 : Float -> Int
to255 f =
    round <| f * 255


rgbToStyle : { red : Float, green : Float, blue : Float, alpha : Float } -> String
rgbToStyle rgb =
    "rgb("
        ++ String.fromInt (to255 rgb.red)
        ++ ","
        ++ String.fromInt (to255 rgb.green)
        ++ ","
        ++ String.fromInt (to255 rgb.blue)
        ++ ")"



---- PROGRAM ----


main : Program Resources Model Msg
main =
    Browser.element
        { view = view
        , init = init
        , update = update
        , subscriptions =
            \model -> Time.every 50 Tick
        }
