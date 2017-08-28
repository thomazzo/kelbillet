module Main exposing (..)

import Html exposing (Html, div, program, text, input, select, option)
import Html.Attributes as H exposing (placeholder, type_, min, max)
import Html.Events exposing (onClick, onInput)
import DatePicker
import Date
import Debug
import Http
import Json.Decode as J exposing (list, string)


main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { datePicker : DatePicker.DatePicker
    , selectedDate : Maybe Date.Date

    -- , minTime : String
    -- , maxTime : String
    , minPrice : String
    , maxPrice : String
    , origin : Origin
    }


type Origin
    = Paris
    | London


init : ( Model, Cmd Msg )
init =
    let
        ( datePickerInit, datePickerCmd ) =
            DatePicker.init
    in
        ( Model datePickerInit Nothing "" "" Paris, Cmd.map SetDatePicker datePickerCmd )



-- UPDATE


type Msg
    = Submit
    | SetDatePicker DatePicker.Msg
    | MinPrice String
    | MaxPrice String
    | PostResponse (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Submit ->
            ( model, submit model )

        SetDatePicker datePickerMsg ->
            let
                ( newDatePicker, datePickerCmd, dateEvent ) =
                    DatePicker.update DatePicker.defaultSettings datePickerMsg model.datePicker

                date =
                    case dateEvent of
                        DatePicker.NoChange ->
                            model.selectedDate

                        DatePicker.Changed newDate ->
                            newDate
            in
                ( { model
                    | selectedDate = date
                    , datePicker = newDatePicker
                  }
                , Cmd.map SetDatePicker datePickerCmd
                )

        MinPrice minPrice ->
            ( { model | minPrice = minPrice }, Cmd.none )

        MaxPrice maxPrice ->
            ( { model | maxPrice = maxPrice }, Cmd.none )

        PostResponse (Ok response) ->
            ( model, Cmd.none )

        PostResponse (Err _) ->
            ( model, Cmd.none )


submit model =
    Http.send PostResponse (Http.post "http://localhost:3000" Http.emptyBody J.string)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ div []
            [ input [ H.placeholder "Min Price", onInput MinPrice ] [] ]
        , div []
            [ input [ H.placeholder "Max Price", onInput MaxPrice ] [] ]
        , div []
            [ text "Origin: ", select [] [ option [] [ text "Paris" ], option [] [ text "London" ] ] ]
        , div []
            [ Html.map SetDatePicker (DatePicker.view model.selectedDate DatePicker.defaultSettings model.datePicker) ]
        , div []
            [ Html.button [ onClick Submit ] [ text "Submit" ] ]
        ]
