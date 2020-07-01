import React from "react";
import { render, fireEvent, getByTestId } from "@testing-library/react";
import Snowman from "./Snowman";

beforeEach(function() {
  jest
    .spyOn(Math, "random")
    .mockReturnValueOnce(914/1610)
    .mockReturnValueOnce(0.75);
});

it("renders without crashing", () => {
  render(<Snowman/>);
});

it("snapshot test", () => {
  const { asFragment } =  render(<Snowman/>);
  expect(asFragment()).toMatchSnapshot();
});

it("checks to see if images changes after wrong guess", () => {
  const { getByText, getByTestId, getByAltText } = render(<Snowman words={["apple"]} />);

  let image = getByTestId("image");
  expect(image.src).toContain("0");
  expect(image.src).not.toContain("1");
  image = getByAltText("snowman-0");
  
  
  // make a wrong guess
  const bButton = getByText("b");
  fireEvent.click(bButton);

  image = getByTestId("image");
  expect(image.src).toContain("1");
  expect(image.src).not.toContain("0");
});

it("allows only 6 wrong guesses", () => {
  const { getByText, getByTestId } = render(<Snowman words={["apple"]}/>);

  let image = getByTestId("image");
  expect(image.src).toContain("0");
  expect(image.src).not.toContain("1");
  
  // make 6 wrong guesses
  let wrongGuess = getByText("b");
  fireEvent.click(wrongGuess);
  wrongGuess = getByText("c");
  fireEvent.click(wrongGuess);
  wrongGuess = getByText("d");
  fireEvent.click(wrongGuess);
  wrongGuess = getByText("f");
  fireEvent.click(wrongGuess);
  wrongGuess = getByText("g");
  fireEvent.click(wrongGuess);
  wrongGuess = getByText("h");
  fireEvent.click(wrongGuess);

  // confirm now on last image
  image = getByTestId("image");
  expect(image.src).toContain("6");
  expect(image.src).not.toContain("0");

  // make a 7th wrong guess, but button should be gone from DOM
  // wrongGuess = getByText("i");
  // fireEvent.click(wrongGuess);

  // check that "You Lose" is on the page
  getByText("You Lose");

  // the image should still be on the 6th
  image = getByTestId("image");
  expect(image.src).toContain("6");
});

it("works for apple", () => {
  const { getByText, getByAltText } = render(<Snowman words={["apple"]} />);

  let guess = getByText("a");
  getByAltText("snowman-0"); // check that it was right b/c snowman stay same
  guess = getByText("p");
  getByAltText("snowman-0"); // check that it was right
  guess = getByText("l");
  getByAltText("snowman-0"); // check that it was right
  guess = getByText("e");
  getByAltText("snowman-0"); // check that it was right
});

afterEach(function() {
  Math.random.mockRestore();
});