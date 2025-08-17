module UpdateAfterTest exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)


-- Mock the updateAfter function for testing 
-- In a real setup, this would be imported from Main
{-| Updates elements, depending on whether the previous matched a predicate.

f1 is used for elements where the previous does not match.
f2 is used for elements where the previous element matched the predicate.

Uses circular logic where last element is considered previous to first element.
-}
updateAfter : (a -> b) -> (a -> b) -> (a -> Bool) -> List a -> List b
updateAfter f1 f2 p aa =
    let
        offset =
            case aa of
                [] ->
                    []
                x :: xs ->
                    case List.reverse aa of
                        [] -> []
                        last :: _ ->
                            last :: (List.take (List.length aa - 1) aa)

        windows =
            List.map2 Tuple.pair aa offset
    in
    List.map
        (\( a, toCheck ) ->
            if p toCheck then
                f2 a
            else
                f1 a
        )
        windows


suite : Test
suite =
    describe "updateAfter function"
        [ test "applies f1 when previous element doesn't match predicate" <|
            \_ ->
                let
                    addOne x = x + 1
                    addTwo x = x + 2
                    isEven x = modBy 2 x == 0
                    input = [1, 2, 3, 4]
                    -- Previous elements in circular fashion: [4, 1, 2, 3]
                    -- 4 is even (True) -> apply addTwo to 1 -> 3
                    -- 1 is odd (False) -> apply addOne to 2 -> 3
                    -- 2 is even (True) -> apply addTwo to 3 -> 5  
                    -- 3 is odd (False) -> apply addOne to 4 -> 5
                    expected = [3, 3, 5, 5]
                in
                Expect.equal (updateAfter addOne addTwo isEven input) expected
        
        , test "handles empty list" <|
            \_ ->
                let
                    addOne x = x + 1
                    addTwo x = x + 2
                    isEven x = modBy 2 x == 0
                in
                Expect.equal (updateAfter addOne addTwo isEven []) []
        
        , test "handles single element (circular reference to itself)" <|
            \_ ->
                let
                    double x = x * 2
                    triple x = x * 3
                    isGreaterThanFive x = x > 5
                    
                    -- Test with element that doesn't match predicate
                    result1 = updateAfter double triple isGreaterThanFive [3]
                    -- 3 > 5 is False, so apply double -> 6
                    expected1 = [6]
                    
                    -- Test with element that matches predicate  
                    result2 = updateAfter double triple isGreaterThanFive [7]
                    -- 7 > 5 is True, so apply triple -> 21
                    expected2 = [21]
                in
                Expect.all
                    [ \_ -> Expect.equal result1 expected1
                    , \_ -> Expect.equal result2 expected2
                    ] ()
        
        , test "correctly applies transformation based on previous element" <|
            \_ ->
                let
                    toString x = String.fromInt x
                    toStringUpper x = String.fromInt x ++ "!"
                    isOdd x = modBy 2 x == 1
                    input = [2, 3, 4, 1]
                    -- Previous elements: [1, 2, 3, 4] 
                    -- 1 is odd (True) -> apply toStringUpper to 2 -> "2!"
                    -- 2 is even (False) -> apply toString to 3 -> "3"
                    -- 3 is odd (True) -> apply toStringUpper to 4 -> "4!"
                    -- 4 is even (False) -> apply toString to 1 -> "1"
                    expected = ["2!", "3", "4!", "1"]
                in
                Expect.equal (updateAfter toString toStringUpper isOdd input) expected
        ]
