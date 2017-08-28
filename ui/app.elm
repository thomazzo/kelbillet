import Html exposing (Html, div, program, text, input, select, option)
import Html.Attributes exposing (placeholder, type_)
import Html.Events exposing (onClick, onInput)
import DatePicker
import Date
import Debug


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
  , origin: Origin
  }

type Origin = Paris | London

init : (Model, Cmd Msg)
init =
    let
        ( datePickerInit, datePickerCmd ) =
            DatePicker.init 
    in
        (Model datePickerInit Nothing "" "" Paris, Cmd.map SetDatePicker datePickerCmd)


-- UPDATE

type Msg =
    Submit
  | SetDatePicker DatePicker.Msg
  | MinPrice String
  | MaxPrice String

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Submit ->
      (model, submit model)
    SetDatePicker datePickerMsg ->
            let
                (newDatePicker, datePickerCmd, dateEvent) =
                    DatePicker.update DatePicker.defaultSettings datePickerMsg model.datePicker

                date =
                    case dateEvent of
                        DatePicker.NoChange ->
                            model.selectedDate

                        DatePicker.Changed newDate ->
                            newDate
            in
                (
                    { model
                        | selectedDate = date
                        , datePicker = newDatePicker
                    }
                    , Cmd.map SetDatePicker datePickerCmd
                )
    MinPrice minPrice -> ({model | minPrice = minPrice}, Cmd.none)
    MaxPrice maxPrice -> ({model | maxPrice = maxPrice}, Cmd.none)

submit model = 
    let a = Debug.log "model" <| toString model
    in Cmd.none
    
-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
   Sub.none

-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ div [] 
        [input [placeholder "Min Price", onInput MinPrice] []]
    , div [] 
        [input [placeholder "Max Price", onInput MaxPrice] []]
    , div [] 
        [text "Origin: ", select [] [option [] [text "Paris"],option [] [text "London"]]]
    , div [] 
        [Html.map SetDatePicker (DatePicker.view model.selectedDate DatePicker.defaultSettings model.datePicker)]
    , div []
        [Html.button [onClick Submit] [text "Submit"]]
    ]
