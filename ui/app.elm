module Main exposing (..)

import Html exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Http
import Json.Encode as Encode
import Json.Decode as Decode
import WebSocket


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : ( Model, Cmd msg )
init =
    ( Model "" "" "" "" "" "", Cmd.none )



-- MODEL


type alias Model =
    { selectedDate : String
    , minTime : String
    , maxTime : String
    , minPrice : String
    , maxPrice : String
    , origin : String
    }



-- UPDATE


type Msg
    = Submit
    | SelectedDate String
    | MinPrice String
    | MaxPrice String
    | MinTime String
    | MaxTime String
    | SelectedOrigin String
    | RequestRes (Result Http.Error String)
    | Receive String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Submit ->
            ( model, submit model )

        MinPrice minPrice ->
            ( { model | minPrice = minPrice }, Cmd.none )

        MaxPrice maxPrice ->
            ( { model | maxPrice = maxPrice }, Cmd.none )

        MinTime minTime ->
            ( { model | minTime = minTime }, Cmd.none )

        MaxTime maxTime ->
            ( { model | maxTime = maxTime }, Cmd.none )

        SelectedDate selectedDate ->
            ( { model | selectedDate = selectedDate }, Cmd.none )

        SelectedOrigin origin ->
            ( { model | origin = origin }, Cmd.none )

        RequestRes (Ok res) ->
            ( model, Cmd.none )

        RequestRes (Err _) ->
            ( model, Cmd.none )

        Receive a ->
            ( model, Cmd.none )


submit : Model -> Cmd Msg
submit model =
    Http.send RequestRes <| postRequest model


postRequest : Model -> Http.Request String
postRequest model =
    Http.post "http://localhost:3000" (encodeModel model) Decode.string


encodeModel : Model -> Http.Body
encodeModel model =
    Http.jsonBody <|
        Encode.object
            [ ( "minPrice", Encode.string model.minPrice )
            , ( "maxPrice", Encode.string model.maxPrice )
            , ( "selectedDate", Encode.string model.selectedDate )
            , ( "minTime", Encode.string model.minTime )
            , ( "maxTime", Encode.string model.maxTime )
            , ( "origin", Encode.string model.origin )
            ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen "ws://localhost:3000" Receive



-- VIEW


view : Model -> Html Msg
view model =
    Html.div []
        [ Html.div [] [ Html.text "Origin: ", Html.select [ E.onInput SelectedOrigin ] [ Html.option [] [ Html.text "Paris" ], Html.option [] [ Html.text "London" ] ] ]
        , Html.div [] [ Html.text "Departure Date: ", Html.input [ A.type_ "date", E.onInput SelectedDate ] [] ]
        , Html.div [] [ Html.text "Min Departure Time: ", Html.input [ A.type_ "time", E.onInput MinTime ] [] ]
        , Html.div [] [ Html.text "Max Departure Time: ", Html.input [ A.type_ "time", E.onInput MaxTime ] [] ]
        , Html.div [] [ Html.text "Min Price: ", Html.input [ A.type_ "number", E.onInput MinPrice ] [] ]
        , Html.div [] [ Html.text "Max Price: ", Html.input [ A.type_ "number", E.onInput MaxPrice ] [] ]
        , Html.div [] [ Html.button [ E.onClick Submit ] [ Html.text "Submit" ] ]
        ]
