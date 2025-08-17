module Example exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)


suite : Test
suite =
    describe "Basic functionality tests"
        [ test "Math works correctly" <|
            \_ ->
                Expect.equal (2 + 2) 4
        , test "String concatenation works" <|
            \_ ->
                Expect.equal ("Hello" ++ " World") "Hello World"
        ]
